/// <reference path="../global.d.ts" />

import * as Koa from 'koa';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Html from '../Html';
import App from '../components/App';
import Hello from '../components/Test';
import fs = require('fs');
import path = require('path');

interface Manifest {
  [client: string]: Array<string>,
};

async function server(devServer: Koa) {
  const scripts: Set<string> = new Set();
  const styles: Set<string> = new Set();
  const app = devServer || new Koa();
  const manifest: Manifest = await new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../chunk-manifest.json'), { encoding: 'utf8' }, function (err, data) {
      if (err) {
        reject(err);
        return;
      };
      resolve(JSON.parse(data));
    });
  });

  console.log('[manifest]', manifest);
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