import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../components/App';
import Hello from '../components/Test';

async function clientRender() {
  const context = {
    path: window.location.pathname,
  };

  ReactDOM.hydrate(
    <App>
      <Hello />
    </App>,
    window.document.querySelector('#app'),
  );
}

clientRender();