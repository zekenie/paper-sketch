import Modal from 'react-modal';
import React from 'react';
import { connect } from 'react-redux';
import { updateProject, removeProject } from '../reducer';

export default connect(function() {
  return {};
}, { updateProject, removeProject })(
  class New extends React.Component {
    state = {
      name: this.props.project.name,
    }

    get payload() {
      return {
        name: this.state.name,
      };
    }

    save() {
      this.props.updateProject(this.props.project.id, this.payload);
      this.props.toggle();
    }

    delete() {
      if (!window.confirm('are you sure you want to delete ' + this.props.project.name + '?')) {
        return;
      }
      this.props.removeProject(this.props.project.id);
      this.props.toggle();
    }

    makeKeyHandler(field) {
      return e => this.setState({
        [field]: e.target.value,
      });
    }

    render() {
      return (
        <Modal isOpen contentLabel="File Settings">
          <h1>Project settings</h1>
          <input
            value={this.state.name}
            onChange={this.makeKeyHandler('name').bind(this)}
          />
          <button onClick={this.props.toggle}>Cancel</button>
          <button onClick={this.save.bind(this)}>Save</button>
          <button onClick={this.delete.bind(this)}>Delete Project</button>
        </Modal>
        )
    }
  }
)
