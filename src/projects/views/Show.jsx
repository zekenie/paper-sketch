import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
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
      // const paperFrameWindow = window.open('about:blank', 'run', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
      // paperFrameWindow.opener = null;
      // paperFrameWindow.location = '/paperFrame.html';
      // const anchor = new HTMLAnchorElement();
      const anchor = document.createElement('a');
      anchor.rel = 'noopener noreferrer';
      anchor.target = '_blank';
      anchor.href = '/paperFrame.html';
      anchor.click();
    }

    compile() {

      // if (this.lastPaperFrame) {
      //   this.lastPaperFrame.close();
      // }

      // paperFrameWindow.onload = function() {
      //   paperFrameWindow.runScript(code);
      // }

      // this.lastPaperFrame = paperFrameWindow;

      // const iWin = this.iframe.contentWindow || this.iframe;
      // const iDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      // iDoc.open()

      // iDoc.close();
      // const scope = new paper.PaperScope();
      // scope.setup(this.canvas);
      // try {
      //   scope.execute(code);
      // } catch(e) {
      //   console.warn(e);
      // }
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
          <ul>
            {
              this.props.files.map(file => 
                <li key={file.id}>
                  <Link to={`${this.props.match.url}/files/${file.id}`}>{file.name}</Link>
                </li>
              )
            }
            <li><button onClick={this.toggleNewFile.bind(this)}>+</button></li>        
          </ul>
          <button onClick={this.openWindow.bind(this)}>Open Window</button>
          <Route
            path={`${this.props.match.url}/files/:fileId`}
            component={(props) => <FileView project={this.props.project} {...props} />}
          />
          
        </div>
      )
    }
  }
)