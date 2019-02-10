import * as React from 'react';

class Html extends React.Component {
  render(): React.ReactNode {
    const { title, styles, scripts, app, children } = this.props
    return <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {scripts.map(script => (
          <link key={script} rel="preload" href={script} as="script" />
        ))}
        {styles.map(style => (
          <link key={style} rel="stylesheet" href={style} />
        ))}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {scripts.map(script => <script key={script} src={script} />)}
      </body>
    </html>
  }
}

export default Html