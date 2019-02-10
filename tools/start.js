const path = require('path');
const Koa = require('koa');
const webpack = require('webpack');
const clientWebpackconfig = require('./webpack.client.config');
const serverWebpackconfig = require('./webpack.server.config');
const webpackDevMiddleware = require('./middlewares/webpackDevMiddleware');
const webpackHotMiddleware = require('./middlewares/webpackHotMiddleware');
const http = require('http');
const cluster = require('cluster');

const COMPILER_STATS = {
  START: 0,
  FINISHED: 1,
  FAIL: -1,
  EXIT: 999,
}

//主进程负责编译
if (cluster.isMaster) {
  let worker;
  const app = new Koa();
  const multiCompiler = webpack([clientWebpackconfig, serverWebpackconfig]);
  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client',
  );
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server',
  );
  let proxy;
  serverCompiler.hooks.compile.tap('server', () => {
    console.log('---------------------server start compile---------------------')
    proxy = [];
    const newPromise = new Promise((resolve, reject) => {
      worker = cluster.fork();
      worker.once('listening', function () {
        resolve();
        worker.send(COMPILER_STATS.START);
        for (let id in cluster.workers) {
          if (id === worker.id.toString()) continue;
          cluster.workers[id].send(COMPILER_STATS.EXIT);
        };
      });
    });
    proxy.push(newPromise);
  });
  cluster.on('disconnect', (worker) => {
    console.log(`The worker #${worker.id} has disconnected`);
  });
  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: '/',
  }));
  app.use(webpackDevMiddleware(serverCompiler, {
    writeToDisk: true,
  }));
  app.use(webpackHotMiddleware(clientCompiler));

  serverCompiler.hooks.done.tap('server', stats => {
    Promise.all(proxy).then(() => {
      if (stats.hasErrors()) {
        worker.send(COMPILER_STATS.FAIL);
      } else {
        console.log('---------------------server end compile---------------------')
        worker.send(COMPILER_STATS.FINISHED);
      };
    })
  });
} else {
  (async function () {
    const app = new Koa();
    app.listen(3000, () => {
      console.info(`The server is running at http://localhost:${3000}/`)
    });
    let server;
    let waitResolve;
    let waitPromise;
    const serverPromise = new Promise(resolve => (serverResolve = resolve));

    process.on('message', (msg) => {
      switch (msg) {
        case COMPILER_STATS.START: {
          waitPromise = new Promise(resolve => (waitResolve = resolve));
          break;
        };
        case COMPILER_STATS.FAIL:
        case COMPILER_STATS.FINISHED: {
          serverResolve();
          waitResolve();
          break;
        };
        case COMPILER_STATS.EXIT: {
          process.exit(0);
        };
      }
    });

    app.use(async function (ctx, next) {
      await waitPromise;
      await next();
    });

    await serverPromise;
    server = require('../dist/server/server').default;
    server(app);
  })()
}