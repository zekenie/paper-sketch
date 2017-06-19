import { combineReducers } from 'redux';

export default combineReducers({
    projects: require('../projects/reducer').default,
    files: require('../files/reducer').default,
});