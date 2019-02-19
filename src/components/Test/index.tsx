import * as React from 'react';
import { hot } from 'react-hot-loader/root';

function Hello () {
  return <div>hello ts!</div>;
};

let HotApp = Hello

if (__isClient__) {
  HotApp = hot(Hello)
}

export default HotApp;