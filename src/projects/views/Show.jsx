import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link, Route, Switch, Redirect } from 'react-router-dom';
import { loadFiles } from '../../files/reducer';
import { loadProject } from '../reducer';
import FileView from '../../files/components/Show';
import NewFile from '../../files/components/New';
import FileSettingsModal from '../../files/components/Settings';
import ProjectSettings from '../components/Settings';
import compile from '../../build';
import { Channel } from '../../inter-tab';

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  return {
    id,
    project: state.projects[id] || {},
    files: Object.values(state.files[id] || {}).filter(f => !!f)
  };
}

export default connect(mapStateToProps, { loadProject, loadFiles })(
  class ProjectShow extends React.Component {

    state = {
      showNewFile: !!this.props.files.length,
      externalWindowLoaded: false,
      externalTestsLoaded: false,
      showSettingsModal: false,
      fileSettings: null,
    }

    constructor(props) {
      super(props);
      this.channel = new Channel('foo');
    }

    toggleNewFile() {
      this.setState({
        showNewFile: !this.state.showNewFile,
      });
    }

    toggleSettingsModal() {
      this.setState({
        showSettingsModal: !this.state.showSettingsModal,
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.state !== nextState || this.props.files.length !== nextProps.files.length || this.props.location.pathname !== nextProps.location.pathname;
    }

    componentDidMount() {
      this.props.loadProject(this.props.id);
      this.props.loadFiles(this.props.id)
      this.channel
        .route('loaded', (res) => {
          this.sendCode();
          this.setState({ externalWindowLoaded: true });
          res.send({
            status: 'ok',
          });
        })
        .route('tests-loaded', (res) => {
          this.sendCode();
          this.setState({ externalTestsLoaded: true });
          res.send({
            status: 'ok',
          });
        })
        .route('unloaded', (res) => {
          this.setState({ externalWindowLoaded: false });
          res.send({ status: 'ok' });
        })
    }

    sendCode() {
      const code = compile(this.props.files);
      this.channel.send('code', {
        code
      })
      .catch(console.error.bind(console));
    }

    openWindow(type) {
      if (type === 'program' && this.state.externalWindowLoaded) {
        return this.sendCode();
      }
      if (type === 'test' && this.state.externalTestsLoaded) {
        return this.sendCode();        
      }

      const url = {
        program: 'paperFrame',
        test: 'testRunner'
      }[type];
      const anchor = document.createElement('a');
      anchor.rel = 'noopener noreferrer';
      anchor.target = '_blank';
      anchor.href = `/${url}.html`;
      anchor.click();
    }

    render() {
      console.log(this.props.match);
      return (
        <div>
          { this.state.showNewFile &&
            <NewFile
              toggle={this.toggleNewFile.bind(this)}
              projectId={this.props.id} 
            />
          }

          { this.state.showSettingsModal &&
            <ProjectSettings project={this.props.project} toggle={this.toggleSettingsModal.bind(this)} />
          }

          { this.state.fileSettings &&
            <FileSettingsModal file={this.state.fileSettings} toggle={() => this.setState({ fileSettings: null })} />
          }
          
          <div className="heading">
            <Link className="back" to="/projects">⬅️</Link>
            {' '}
            <div className="title">{this.props.project.name}</div>
            <div className="grow"></div>
            <div className="control">
              <button onClick={this.openWindow.bind(this, 'program')}>⚡️ Run</button>
              <button onClick={this.openWindow.bind(this, 'test')}>✅ Run Tests</button>
              <button onClick={this.toggleSettingsModal.bind(this)}>️⚙️</button>
            </div>
          </div>
          <div className="file-tabs">
            {
              this.props.files.map(file => 
                <NavLink
                  onDoubleClick={() => this.setState({fileSettings: file})}
                  key={file.id}
                  className="file-tab"
                  activeClassName="selected"
                  to={`${this.props.match.url}/files/${file.id}`}
                >
                  {file.name}
                </NavLink>
              )
            }
            <div className="control new-file"><a onClick={this.toggleNewFile.bind(this)}>🐣</a></div>        
          </div>
          <Switch>
            <Route
              path={`${this.props.match.url}/files/:fileId`}
              component={(props) => <FileView project={this.props.project} {...props} />}
            />
            <Route
              component={() => 
                this.props.files.length ? <Redirect to={`${this.props.match.url}/files/${this.props.files[0].id}`} />
                : null
              }
            />
          </Switch>
          
        </div>
      )
    }
  }
)