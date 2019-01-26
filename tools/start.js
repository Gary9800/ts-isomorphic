const path = require('path');
const Koa = require('koa');
const webpack = require('webpack');
const clientWebpackconfig = require('./webpack.client.config');
const serverWebpackconfig = require('./webpack.server.config');
const webpackDevMiddleware = require('./middlewares/webpackDevMiddleware');
const webpackHotMiddleware = require('./middlewares/webpackHotMiddleware');

function purgeCache(moduleName) {
  searchCache(moduleName, function (mod) {
    delete require.cache[mod.id];
  });

  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};

function searchCache(moduleName, callback) {
  var mod = require.resolve(moduleName);

  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    (function traverse(mod) {
      mod.children.forEach(function (child) {
        traverse(child);
      });
      callback(mod);
    }(mod));
  }
};

function createCompilationPromise(name, compiler) {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.info(`------------------ Compiling '${name}'... ------------------`);
    });

    compiler.hooks.done.tap(name, stats => {
      if (stats.hasErrors()) {
        console.info(`[Failed to compile '${name}'`);
        reject(new Error('------------------ Compilation failed! ------------------'));
      } else {
        console.info(`------------------ Finished '${name}' compilation ------------------`);
        resolve(stats);
      }
    });
  });
};

async function devServer() {
  const app = new Koa();

  const multiCompiler = webpack([clientWebpackconfig, serverWebpackconfig]);
  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client',
  );
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server',
  );
  const clientPromise = createCompilationPromise(
    'client',
    clientCompiler,
  );
  const serverPromise = createCompilationPromise(
    'server',
    serverCompiler,
  );
  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: '/',
  }));
  app.use(webpackDevMiddleware(serverCompiler, {
    writeToDisk: true,
  }));
  app.use(webpackHotMiddleware(clientCompiler));

  let server;
  let appPromise;
  let appPromiseResolve;
  let appPromiseIsResolved = true;
  serverCompiler.hooks.compile.tap('server', () => {
    if (!appPromiseIsResolved) return;
    appPromiseIsResolved = false;
    console.log('---------------------start compile---------------------')
    appPromise = new Promise(resolve => (appPromiseResolve = resolve))
  });
  app.use(async function (ctx, next) {
    await appPromise;
    return next();
  });

  await clientPromise;
  await serverPromise;

  serverCompiler.hooks.done.tap('server', stats => {
    console.log('---------------------end compile---------------------')
    purgeCache(('../dist/server/server'));
    server = require('../dist/server/server').default;
    server(app);
    appPromiseIsResolved = true;
    appPromiseResolve();
  });

  server = require('../dist/server/server').default;
  server(app);
  appPromiseIsResolved = true;
  appPromiseResolve && appPromiseResolve();

  app.listen(3000, () => {
    console.info(`The server is running at http://localhost:${3000}/`)
  })
}

devServer()