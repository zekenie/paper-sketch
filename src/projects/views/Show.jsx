import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link, Route } from 'react-router-dom';
import { loadFiles } from '../../files/reducer';
import { loadProject } from '../reducer';
import FileView from '../../files/components/Show';
import NewFile from '../../files/components/New';
import compile from '../../build';

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
      this.scriptChannel = new window.BroadcastChannel('script');
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
      this.scriptChannel.addEventListener('message', ({ data }) => {
        switch(data.type) {
          case 'LOADED':
            this.sendCode();
            this.setState({ externalWindowLoaded: true });
            break;
        }
      })
    }

    sendCode() {
      const code = compile(this.props.files);
      this.scriptChannel.postMessage({
        type: 'SCRIPT',
        code
      });
    }

    openWindow() {
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
          <Link to="/projects">Back</Link>
          <h2>{this.props.project.name}</h2>
          <div className="file-tabs">
            {
              this.props.files.map(file => 
                <NavLink key={file.id} className="file-tab" activeClassName="selected" to={`${this.props.match.url}/files/${file.id}`}>{file.name}</NavLink>
              )
            }
            <div className="grow"></div>
            <div className="control"><button onClick={this.openWindow.bind(this)}>Open Window</button></div>
            <div className="control"><button onClick={this.toggleNewFile.bind(this)}>+</button></div>        
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