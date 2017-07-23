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

    save(e) {
      e.preventDefault();
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
        <Modal
          isOpen
          contentLabel="New Project"
          styles={{
            overlay : {
              position          : 'fixed',
              top               : 0,
              left              : 0,
              right             : 0,
              bottom            : 0,
              backgroundColor   : 'rgba(255, 255, 255, 0.75)'
            },

          }}
        >
          <h1>New File</h1>
          <form onSubmit={this.save.bind(this)}>
            <input
              autoFocus
              value={this.state.name}
              onChange={this.makeKeyHandler('name').bind(this)}
            />
            <button onClick={this.save.bind(this)}>Create</button>
          </form>
          <button onClick={this.props.toggle}>Cancel</button>
        </Modal>
        )
    }
  }
)
