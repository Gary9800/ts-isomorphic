/// <reference path="../../global.d.ts" />

import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import * as styles from './App.scss';

export interface Props {
  children: React.ReactChild,
}

class App extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props)

  }

  render() {
    return <div className={styles.root}>
    <div>hh</div>
    {this.props.children}
    </div>;
  }
}

let HotApp = App

if (__isClient__) {
  HotApp = hot(App)
}

export default HotApp