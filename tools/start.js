const path = require('path');
const Koa = require('koa');
const webpack = require('webpack');
const clientWebpackconfig = require('./webpack.client.config');
const serverWebpackconfig = require('./webpack.server.config');
const webpackDevMiddleware = require('./middlewares/webpackDevMiddleware');
const webpackHotMiddleware = require('./middlewares/webpackHotMiddleware');
const http = require('http');
const cluster = require('cluster');
const utils = require('./utils');

const COMPILER_STATS = {
  SERVER_START: 0,
  SERVER_FINISHED: 1,
  CLIENT_START: 2,
  CLIENT_FINISHED: 3,
  FAIL: -1,
  EXIT: 999,
}

//主进程负责编译
if (cluster.isMaster) {
  const app = new Koa();
  const multiCompiler = webpack([clientWebpackconfig, serverWebpackconfig]);
  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client',
  );
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server',
  );

  const creatWorker = (function () {
    let isCreatWorker = false;
    let worker;
    return (cb) => {
      if (isCreatWorker) {
        cb(worker);
        return worker;
      }
      return new Promise((resolve, reject) => {
        isCreatWorker = true;
        worker = cluster.fork();
        cb(worker);
        worker.once('listening', function () {
          isCreatWorker = false;
          resolve(worker);
          for (let id in cluster.workers) {
            if (id === worker.id.toString()) continue;
            cluster.workers[id].send(COMPILER_STATS.EXIT);
          };
        });
      });
    };
  })();

  let clientEvents;
  clientCompiler.hooks.compile.tap('client', () => {
    clientEvents = utils.creatProxy(
      'worker',
      'clientDone',
      function (worker, clientStats) {
        if (clientStats.hasErrors()) {
          worker.send(COMPILER_STATS.FAIL);
        } else {
          worker.send(COMPILER_STATS.CLIENT_FINISHED);
        };
      },
    );
    clientEvents('worker', creatWorker(function (worker) {
      worker.send(COMPILER_STATS.CLIENT_START);
    }));
  });
  clientCompiler.hooks.done.tap('client', stats => {
    clientEvents('clientDone', stats);
  });

  let serverEvents;
  serverCompiler.hooks.compile.tap('server', () => {
    serverEvents = utils.creatProxy(
      'worker',
      'serverDone',
      function (worker, serverStats) {
        if (serverStats.hasErrors()) {
          worker.send(COMPILER_STATS.FAIL);
        } else {
          worker.send(COMPILER_STATS.SERVER_FINISHED);
        };
      },
    );
    serverEvents('worker', creatWorker(function (worker) {
      worker.send(COMPILER_STATS.SERVER_START);
    }));
  });
  serverCompiler.hooks.done.tap('server', stats => {
    serverEvents('serverDone', stats);
  });

  cluster.on('disconnect', (worker) => {
    console.log(`The worker #${worker.id} has disconnected`);
  });

  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
  });
  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: 'http://localhost:3001/',
    logLevel: 'error',
  }));
  app.use(webpackDevMiddleware(serverCompiler, {
    writeToDisk: true,
    logLevel: 'error',
  }));
  app.use(webpackHotMiddleware(clientCompiler, {
    path: "/__what",
  }));

  app.listen(3001, () => {
    console.info(`The server is running at http://localhost:${3001}/`);
  });
} else {
  const app = new Koa();
  app.listen(3000, () => {
    console.info(`The server is running at http://localhost:${3000}/`);
  });
  let waitResolve;
  let waitPromise = new Promise(resolve => waitResolve = resolve);
  const state = {
    server: true,
    client: true,
  };
  const runServer = () => {
    if (Object.values(state).reduce((a, b) => a * b, 1)) {
      const server = require('../dist/server/server').default;
      server(app);
      waitResolve();
    }
  };

  process.on('message', (msg) => {
    switch (msg) {
      case COMPILER_STATS.SERVER_START: {
        state.server = false;
        break;
      };
      case COMPILER_STATS.CLIENT_START: {
        state.client = false;
        break;
      };
      case COMPILER_STATS.FAIL:
      case COMPILER_STATS.SERVER_FINISHED: {
        state.server = true;
        runServer();
        break;
      };
      case COMPILER_STATS.CLIENT_FINISHED: {
        state.client = true;
        runServer();
        break;
      };
      case COMPILER_STATS.EXIT: {
        process.exit(0);
      };
    }
  });

  app.use(async function (ctx, next) {
    ctx.set('Cache-Control', 'no-cache');
    await waitPromise;
    await next();
  });
}