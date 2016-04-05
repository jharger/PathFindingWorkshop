import React from 'react';
import Canvas from './Canvas.jsx';

import classes from './App.scss';

class App extends React.Component {
  render() {
    return (<div className={classes.appBase}>
      <Canvas />
    </div>);
  }
}

export default App;