import { addOne, addMany, removeOne } from '../redux/helper.jsx';
import storage from './storage';


const ADD_FILE = 'ADD_FILE';
export const addFile = (projectId, file) => ({
  type: ADD_FILE,
  file
});

const ADD_FILES = 'ADD_FILES';
export const addFiles = (projectId, files) => ({
  type: ADD_FILES,
  projectId,
  files
});

export const createFile = params =>
  dispatch => {
    params = {
      ...params,
      testContent: '',
    }
    const file = storage.save(params);
    dispatch(addFile(params.projectId, file));
  };

export const updateFile = (id, changes) => 
  dispatch => {
    const file = storage.update(id, changes);
    dispatch(addFile(id, file));
  };

export const loadFiles = projectId =>
  dispatch => {
    const files = storage.list({
      index: `projectId`,
      value: projectId,
    });
    dispatch(addFiles(projectId, files));
  };

export const loadFile = id =>
  dispatch => {
    const file = storage.get(id);
    dispatch(addFile(id, file));
  };

const REMOVE_FILE = 'REMOVE_FILE';
export const removeFile = (projectId, id) =>
  dispatch => {
    storage.remove(id);
    dispatch({
      type: REMOVE_FILE,
      id
    });
  };
    
export default function reducer(state = {}, action) {
  switch(action.type) {
    case ADD_FILE:
      return {
        ...state,
        [action.file.projectId]: {
          ...(state[action.file.projectId] || {}),
          [action.file.id]: action.file,
        }
      }
    case ADD_FILES:
      return action.files.reduce(
        (prevState, file) => ({
          ...prevState,
          [file.projectId]: {
            ...(prevState[file.projectId] || {}),
            [file.id]: file,
          }
        }),
        state
      )
    case REMOVE_FILE:
      return {
        ...state,
        [action.projectId]: {
          ...(state[action.projectId] || {}),
          [action.fileId]: undefined,
        }
      }
    default:
      return state;
  }
}