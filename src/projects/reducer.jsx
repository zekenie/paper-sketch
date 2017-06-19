import { addOne, addMany, removeOne } from '../redux/helper.jsx';
import storage from './storage';

const ADD_PROJECT = 'ADD_PROJECT';
export const addProject = project => ({
  type: ADD_PROJECT,
  project
});

const ADD_PROJECTS = 'ADD_PROJECTS';
export const addProjects = projects => ({
  type: ADD_PROJECTS,
  projects
});

export const createProject = params =>
  dispatch => {
    const project = storage.save(params);
    dispatch(addProject(project));
  };

export const updateProject = (id, changes) => 
  dispatch => {
    const project = storage.update(id, changes);
    dispatch(addProject(project));
  };

export const loadProjects = (skip, limit) =>
  dispatch => {
    const projects = storage.list({
      skip,
      limit,
    });
    dispatch(addProjects(projects));
  };

export const loadProject = id =>
  dispatch => {
    const project = storage.get(id);
    dispatch(addProject(project));
  };

const REMOVE_PROJECT = 'REMOVE_PROJECT';
export const removeProject = id =>
  dispatch => {
    storage.remove(id);
    dispatch({
      type: REMOVE_PROJECT,
      id
    });
  };
    
export default function reducer(state = {}, action) {
  switch(action.type) {
    case ADD_PROJECT:
      return addOne(state, action.project);
    case ADD_PROJECTS:
      return addMany(state, action.projects);
    case REMOVE_PROJECT:
      return removeOne(state, action.id);
    default:
      return state;
  }
}