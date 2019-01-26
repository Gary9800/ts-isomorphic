import * as Koa from 'koa';
import * as React from 'react';
import http = require('http');



function server(devServer: Koa): void {
  const app = devServer || new Koa()

  app.use(async (ctx: Koa.Context) => {
    // console.log(34)
    ctx.body = 'hello'
  })

  if (!devServer) {
    app.listen(3000, () => {
      console.info(`The server is running at http://localhost:${3000}/`)
    })
  }
}

export default server