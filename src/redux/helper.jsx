export function addOne(state, record) {
  if (!record || !record.id) { return state; }
  const previous = state[record.id] || {};
  return {
    ...state,
    [record.id]: { ...previous, ...record },
  };
}

export function removeOne(state, record) {
  if (!record || !record.id) { return state; }
  const newState = { ...state };
  delete newState[record.id];
  return newState;
}

export function addMany(state, records) {
  if (!records || !records.length) { return state; }
  return records.reduce(addOne, state);
}
