/// <reference path="../global.d.ts" />

import * as Koa from 'koa';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Html from '../Html';
import App from '../components/App';
import Hello from '../components/Test';
import manifest = require('../chunk-manifest.json');

function server(devServer: Koa): void {
  const scripts: Set<string> = new Set();
  const styles: Set<string> = new Set();
  const app = devServer || new Koa();
  console.log(manifest);
  const addChunk = (chunk: string) => {
    if (manifest[chunk]) {
      manifest[chunk]
        .filter((asset: string) => asset.endsWith('.js'))
        .forEach((asset: string) => scripts.add(asset));
      manifest[chunk]
        .filter((asset: string) => asset.endsWith('.css'))
          .forEach((asset: string) => styles.add(asset));
    } else if (__DEV__) {
      throw new Error(`Chunk with name '${chunk}' cannot be found`);
    }
  };

  app.use(async (ctx: Koa.Context) => {
    addChunk('client');
    const _styles: Array<string> = Array.from(styles);
    const _scripts: Array<string> = Array.from(scripts);
    const children: string = ReactDOMServer.renderToString(<App>
      <Hello />
    </App>);
    
    ctx.body = ReactDOMServer.renderToStaticMarkup(<Html
      children={children}
      styles={_styles}
      scripts={_scripts}
    />);
  });

  if (!devServer) {
    app.listen(3000, () => {
      console.info(`The server is running at http://localhost:${3000}/`)
    })
  }
}

export default server