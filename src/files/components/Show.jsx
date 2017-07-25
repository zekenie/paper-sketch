import React from 'react';
import { connect } from 'react-redux';
import { loadFile, updateFile } from '../reducer';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import { Grid } from 'grid-styled';

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
      testContent: this.props.file.testContent,
    }

    componentDidMount() {
      loadFile(this.props.project.id, this.props.fileId);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.file.content !== this.state.fileContent) {
        this.setState({
          fileContent: nextProps.file.content,
          testContent: nextProps.file.testContent || ''
        });
      }
    }

    changeFile() {
      const { fileContent, testContent } = this.state
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.props.updateFile(this.props.file.id, {
          content: fileContent,
          testContent,
        });
      }, SAVE_INTERVAL);
    }
    
    onContentChange(value) {
      this.setState({
        fileContent: value,
      }, () => this.changeFile());
    }

    onTestChange(value) {
      this.setState({
        testContent: value,
      }, () => this.changeFile());
      
    }

    render() {
      return (
        <div>
          <Grid width={1/2}>
            <AceEditor 
              mode="javascript"
              theme="github"
              style={{
                width: '100%',
                height: '85vh',
                border: '1px solid #eee'
              }}
              value={this.state.fileContent}
              onChange={this.onContentChange.bind(this)}
              name="UNIQUE_ID_OF_DIV"
            />
          </Grid>

          {/* Tests */}
          <Grid width={1/2}>
            <AceEditor 
              mode="javascript"
              theme="github"
              style={{
                width: '100%',
                height: '85vh',                
                border: '1px solid #eee'
              }}
              value={this.state.testContent}
              onChange={this.onTestChange.bind(this)}
              name="UNIQUE_ID_OF_DIV2"
            />
          </Grid>
        </div>
      );
    }
  }
);