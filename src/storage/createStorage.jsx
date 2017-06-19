import store from 'store';
import uuidv4  from 'uuid/v4';
import { mapValues } from 'lodash/object';

const makeId = () => uuidv4();

function log(...messages) {
  for (const message of messages) {
    console.log(`%c ${JSON.stringify(message, null, 2)}`, 'background: #222; color: #bada55');
  }
}

class IdSet {
  constructor(path, name, matches = () => '*') {
    this.path = path;
    this.name = name;
    this.matches = matches;
  }

  get key() {
    return `${this.path}/${this.name}`
  }

  add(doc) {
    const match = this.matches(doc);
    if (!match) { return; }
    const index = this.list();
    if (index[match] && index[match].includes(doc.id)) { return; }
    if (!index[match]) {
      index[match] = [];
    }
    index[match].push(doc.id);
    store.set(this.key, index);
  }

  remove(idToRemove) {
    const index = this.list();
    const newIndex = mapValues(index, ids => ids.filter(idx => idx !== idToRemove));
    store.set(this.key, newIndex);
  }

  list() {
    return store.get(this.key) || {};
  }

  query(value = '*') {
    return this.list()[value];
  }
}

export default function createStore(path, { indexes = {} } = {}) {

  const makeKey = key => `${path}/${key};`

  const idSets = Object
    .keys(indexes)
    .reduce(
      (idSets, indexName) => idSets.set(indexName, new IdSet(path, indexName, indexes[indexName])),
      new Map().set('id', new IdSet(path, 'id'))
    );

  function save(props) {
    log('save', props);
    const id = makeId();
    return update(id, props);
  }

  function remove(id) {
    store.remove(makeKey(id));
    for (const [idSetName, idSet] of idSets) {
      idSet.remove(id);
    }
  }

  function get(id) {
    return store.get(makeKey(id));
  }

  function update(id, props) {
    const existing = get(id) || {};
    const key = makeKey(id);
    const toSave = {
      ...existing,
      ...props,
      id
    };

    for (const [idSetName, idSet] of idSets) {
      idSet.add(toSave);
    }

    store.set(key, toSave);
    return toSave;
  }

  function list({ index = 'id', value = '*', skip = 0, limit = 25 }) {
    const idSet = idSets
      .get(index);
    return (idSet && idSet.query(value) || [])
      .slice(skip, limit)
      .map(get);
  }

  return {
    save,
    update,
    remove,
    list,
    get,
  }

}