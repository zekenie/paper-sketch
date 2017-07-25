import React, { Component } from 'react';
import { Provider } from 'react-redux'
import './App.css';
import "@blueprintjs/core/dist/blueprint.css";

import store from './redux/store';
import Projects from './projects/views/List';
import Project from './projects/views/Show';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <div id="app-view">
              <Switch>
                <Route path="/projects/:id" component={Project} />
                <Route path="/projects" component={Projects} />
                <Route component={() => <Redirect to='/projects' />} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
