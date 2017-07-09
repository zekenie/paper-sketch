import uuidv4  from 'uuid/v4';
import EventEmitter from 'event-emitter';
const chanSym = Symbol('channel');
const onRequest = Symbol('onRequest');

class Request {
  constructor(path, payload, channel) {
    this.path = path;
    this.payload = payload;
    this.channel = channel;
  }

  id = uuidv4()

  get promise() {
    return new Promise((resolve, reject) => {
      onResp = (payload) => {
        if (payload.id === this.id) {
          this.channel.off('incoming', onResp);
          resolve(payload);
        }
      };
      this.channel.on('response', onResp);
    });
  }

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
  constructor(reqData, channel) {
    this.channel = channel;
    this.reqId = reqData.id;
  }

  send(payload) {
    this.channel.write({
      type: 'response',
      id: this.reqId,
      payload
    });
  }
}

class Channel extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;

    this.setupListeners();
  }

  id = uuidv4()
  routes = {}
  [chanSym] = new window.BroadcastChannel(this.name)

  send(path, data = {}) {
    const req = new Request(path, data, this);
    this.write(req.toJSON());
    return req.promise;    
  }

  write(body) {
    this[chanSym].postMessage(body);
  }

  [onRequest](data) {
    if (data.path in this.routes) {
      const res = new Response(data, this)
      this.routes[data.path](data, res);
    }
  }

  route(path, handler) {
    this.routes[path] = handler;
  }

  setupListeners() {
    this[chanSym].addEventListener('message', ({ data }) => {
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
          this.emit('response', data);
          break;
      }
    });

  }
}