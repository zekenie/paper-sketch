import Modal from 'react-modal';
import React from 'react';
import { connect } from 'react-redux';
import { updateFile, removeFile } from '../reducer';

export default connect(function() {
  return {};
}, { updateFile, removeFile })(
  class New extends React.Component {
    state = {
      name: this.props.file.name,
    }

    get payload() {
      return {
        name: this.state.name,
      };
    }

    save() {
      this.props.updateFile(this.props.file.id, this.payload);
      this.props.toggle();
    }

    delete() {
      if (!window.confirm('are you sure you want to delete ' + this.props.file.name + '?')) {
        return;
      }
      this.props.removeFile(this.props.file.projectId, this.props.file.id);
      this.props.toggle();
    }

    makeKeyHandler(field) {
      return e => this.setState({
        [field]: e.target.value.replace(' ', '-'),
      });
    }

    render() {
      return (
        <Modal isOpen contentLabel="File Settings">
          <h1>File settings</h1>
          <input
            value={this.state.name}
            onChange={this.makeKeyHandler('name').bind(this)}
          />
          <button onClick={this.props.toggle}>Cancel</button>
          <button onClick={this.save.bind(this)}>Save</button>
          <button onClick={this.delete.bind(this)}>Delete File</button>
        </Modal>
        )
    }
  }
)
