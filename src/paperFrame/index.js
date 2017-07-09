import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '../registerServiceWorker';
import paper from 'paper';

class App extends React.Component {
  constructor(props) {
    paper.agent.chrome = false;
    super(props);
    this.paperScope = new paper.PaperScope();
  }

  componentDidMount() {
    this.paperScope.setup(this.canvas);
    try {
      this.paperScope.execute(this.props.code);
    } catch(e) {
      console.warn(e);
    }
  }

  render() {
    return (
      <canvas ref={el => this.canvas = el} style={{width: '100%', height: '100vh'}} />
    );
  }
}

const scriptChannel = new window.BroadcastChannel('script');

scriptChannel.addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'SCRIPT':
      const el = document.getElementById('root');
      ReactDOM.unmountComponentAtNode(el);
      ReactDOM.render(<App code={data.code} />, el);
      // send reply?
      break;
    case 'PING':
      scriptChannel.postMessage(data);
      break;
  }
});

scriptChannel.postMessage({ type: 'LOADED' });


registerServiceWorker();
