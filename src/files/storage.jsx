import createStorage from '../storage/createStorage';

export default createStorage('files', {
  indexes: {
    projectId(doc) { return doc.projectId; },
  }
});