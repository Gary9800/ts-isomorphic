import * as Koa from 'koa';
import * as React from 'react';
// import ReactDOMServer from 'react-dom/server';
// import Html from '../Html';
// import App from './components/App';
// import manifest from './chunk-manifest.json';

function server(devServer: Koa): void {
  const app = devServer || new Koa()

  app.use(async (ctx: Koa.Context) => {
    // console.log(23)
    ctx.body = 'hello'
  })

  if (!devServer) {
    app.listen(3000, () => {
      console.info(`The server is running at http://localhost:${3000}/`)
    })
  }
}

export default server