import React, { Component } from 'react';
import { Provider } from 'react-redux'
import './App.css';

import store from './redux/store';
import Projects from './projects/views/List';
import Project from './projects/views/Show';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <div id="app-header">
              Paper
            </div>
            <div id="app-view">
              <Switch>
                <Route path="/projects/:id" component={Project} />
                <Route path="/projects" component={Projects} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
