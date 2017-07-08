import React from 'react';
import { connect } from 'react-redux';
import { loadFile, updateFile } from '../reducer';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';


const SAVE_INTERVAL = 500;

function mapStateToProps(state, props) {
  const project = props.project || {};
  const fileId = props.match.params.fileId;
  return {
    project,
    fileId,
    file: (state.files[project.id] || {})[fileId] || {},
  }
}

export default connect(mapStateToProps, { loadFile, updateFile })(
  class FileView extends React.Component {
    state = {
      fileContent: this.props.file.content,
    }

    componentDidMount() {
      loadFile(this.props.project.id, this.props.fileId);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.file.content !== this.state.fileContent) {
        this.setState({
          fileContent: nextProps.file.content,
        });
      }
    }

    changeFile(content) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.props.updateFile(this.props.file.id, {
          content: content,
        });
        console.log(this.props.compile());
      }, SAVE_INTERVAL);
    }
    
    onTextAreaChange(value) {
      this.setState({
        fileContent: value,
      });
      this.changeFile(value);
    }

    render() {
      return (
        <div>
          <AceEditor 
            mode="javascript"
            theme="github"
            value={this.state.fileContent}
            onChange={this.onTextAreaChange.bind(this)}
            name="UNIQUE_ID_OF_DIV"
          />
          {/*<textarea value={this.state.fileContent} onChange={this.onTextAreaChange.bind(this)}></textarea>*/}
        </div>
      );
    }
  }
);