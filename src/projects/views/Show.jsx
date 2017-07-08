import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import { loadFiles } from '../../files/reducer';
import { loadProject } from '../reducer';
import FileView from '../../files/components/Show';
import NewFile from '../../files/components/New';
import compile from '../../build';
import paper from 'paper';

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
    }

    compile() {
      paper.agent.chrome = false;
      const code = compile(this.props.files);
      console.log(code);
      const scope = new paper.PaperScope();
      scope.setup(this.canvas);
      try {
        scope.execute(code);
      } catch(e) {
        console.warn(e);
      }
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
          <Route
            path={`${this.props.match.url}/files/:fileId`}
            component={(props) => <FileView compile={this.compile.bind(this)} project={this.props.project} {...props} />}
          />
          <canvas ref={el => this.canvas = el} width="500" height="500"/>
        </div>
      )
    }
  }
)