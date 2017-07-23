import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '../registerServiceWorker';
import paper from 'paper';
import { Channel } from '../inter-tab';

window.paper = paper;

window.__test__ = true;

let mounted = false;

function runTests(code) {
  if (mounted) {
    return window.location.reload();
  }
  mounted = true;
  const canvas = document.createElement('canvas');
  const paperScope = new paper.PaperScope();
  paper.agent.chrome = false;
  paperScope.setup(canvas);
  try {
    const foo = paper.PaperScript.execute(code, paperScope, {
      url: 'file.js',
      source: code,
      sourceMaps: 'inline'
    });
    window.__runTests__();
  } catch(e) {
    console.warn(e);
  }
}


const channel = new Channel('foo')
  .route('code', (res) => {
    try {
      runTests(res.request.payload.code);
      res.send({
        status: 'ok'
      })
    } catch(e) {
      res.send({
        status: 'error',
        err: e.message
      });
      throw e;
    }
  })
  .route('ping', console.log.bind(console, 'ping'));

channel.send('tests-loaded', {});

window.addEventListener('beforeunload', () => channel.send('unloaded', {}));

registerServiceWorker();
