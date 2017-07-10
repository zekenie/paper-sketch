import uuidv4  from 'uuid/v4';
import { EventEmitter } from 'events';
const chanSym = Symbol('channel');
const onRequest = Symbol('onRequest');

class Request {
  constructor(path, payload, channel) {
    this.path = path;
    this.payload = payload;
    this.channel = channel;
  }

  id = uuidv4()

  toJSON() {
    return {
      payload: this.payload,
      path: this.path,
      id: this.id,
      type: 'request',
      sent: Date.now()
    }
  }
}

class Response {
  constructor(req, channel) {
    this.channel = channel;
    this.request = req;
    this.reqId = req.id;
  }

  send(payload) {
    this.channel.write({
      type: 'response',
      id: this.reqId,
      payload
    });
  }
}

export class Channel extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;

    this[chanSym] = new window.BroadcastChannel(this.name)
    this.setupListeners();
  }

  openRequests = {}
  id = uuidv4()
  routes = {}

  send(path, data = {}) {
    const req = new Request(path, data, this);
    this.write(req.toJSON());
    const p = new Promise((resolve, reject) => {
      this.openRequests[req.id] = resolve;
    })
    return p;
  }

  write(body) {
    console.log('<--', body);
    this[chanSym].postMessage(body);
  }

  [onRequest](data) {
    if (data.path in this.routes) {
      const res = new Response(data, this)
      this.routes[data.path](res);
    }
  }

  route(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  setupListeners() {
    this[chanSym].addEventListener('message', ({ data }) => {
      console.log('-->', data);
      switch (data.type) {
        case 'connect':
          this.emit('connect', data.id);
          break;
        case 'disconnect':
          this.emit('disconnect', data.id);
          break;
        case 'request':
          this[onRequest](data);
          break;
        case 'response':
          this.openRequests[data.id] && this.openRequests[data.id]()
          break;
      }
    });

  }
}