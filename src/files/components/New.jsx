import Modal from 'react-modal';
import React from 'react';
import { connect } from 'react-redux';
import { createFile } from '../reducer';

export default connect(function() {
  return {};
}, { createFile })(
  class New extends React.Component {
    state = {
      name: '',
    }

    get payload() {
      return {
        name: this.state.name,
        content: '',
        projectId: this.props.projectId,
      };
    }

    save() {
      this.props.createFile(this.payload);
      this.props.toggle();
    }

    makeKeyHandler(field) {
      return e => this.setState({
        [field]: e.target.value.replace(' ', '-'),
      });
    }

    render() {
      return (
        <Modal isOpen contentLabel="New Project">
          <h1>New File</h1>
          <input
            value={this.state.name}
            onChange={this.makeKeyHandler('name').bind(this)}
          />
          <button onClick={this.props.toggle}>Cancel</button>
          <button onClick={this.save.bind(this)}>Create</button>
        </Modal>
        )
    }
  }
)
