import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link, Route } from 'react-router-dom';
import { loadFiles } from '../../files/reducer';
import { loadProject } from '../reducer';
import FileView from '../../files/components/Show';
import NewFile from '../../files/components/New';
import compile from '../../build';
import { Channel } from '../../inter-tab';

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  return {
    id,
    project: state.projects[id] || {},
    files: Object.values(state.files[id] || {})
  };
}

export default connect(mapStateToProps, { loadProject, loadFiles })(
  class ProjectShow extends React.Component {

    state = {
      showNewFile: false,
      externalWindowLoaded: false,
    }

    constructor(props) {
      super(props);
      this.channel = new Channel('foo');
      // this.scriptChannel = new window.BroadcastChannel('script');
    }

    toggleNewFile() {
      this.setState({
        showNewFile: !this.state.showNewFile,
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

    openWindow() {
      if (this.state.externalWindowLoaded) {
        return this.sendCode();
      }
      const anchor = document.createElement('a');
      anchor.rel = 'noopener noreferrer';
      anchor.target = '_blank';
      anchor.href = '/paperFrame.html';
      anchor.click();
    }

    render() {
      return (
        <div>
          { this.state.showNewFile &&
            <NewFile
              toggle={this.toggleNewFile.bind(this)}
              projectId={this.props.id} 
            />
          }
          
          <div className="heading">
            <Link className="back" to="/projects">⬅️</Link>
            {' '}
            <div className="title">{this.props.project.name}</div>
            <div className="grow"></div>
            <div className="control"><button onClick={this.openWindow.bind(this)}>⚡️ Run</button></div>
          </div>
          <div className="file-tabs">
            {
              this.props.files.map(file => 
                <NavLink key={file.id} className="file-tab" activeClassName="selected" to={`${this.props.match.url}/files/${file.id}`}>{file.name}</NavLink>
              )
            }
            <div className="control new-file"><a onClick={this.toggleNewFile.bind(this)}>🐣</a></div>        
          </div>
          <Route
            path={`${this.props.match.url}/files/:fileId`}
            component={(props) => <FileView project={this.props.project} {...props} />}
          />
          
        </div>
      )
    }
  }
)