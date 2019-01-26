const webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function (compiler, option) {
  const doIt = webpackHotMiddleware(compiler, option)

  return function (ctx, next) {
    const { req } = ctx
    return new Promise((resolve, reject) => {
      doIt(req, ctx.res, resolve)
    }).then(next)
  }
}