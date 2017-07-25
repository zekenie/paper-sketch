import React from 'react';
import { connect } from 'react-redux';
import { createFile } from '../reducer';
import { Dialog } from "@blueprintjs/core";

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
        <Dialog
          onClose={this.props.toggle}
          isOpen
          title="New File"
        >
          <div className="pt-dialog-body">
            <form onSubmit={this.save.bind(this)}>
              <label className="pt-label">
                Name
                <input
                  className="pt-input"
                  value={this.state.name}
                  autoFocus
                  onChange={this.makeKeyHandler('name').bind(this)}
                />
              </label>
              
            </form>
          </div>
          <div className="pt-dialog-footer">
              <div className="pt-dialog-footer-actions">
                  <button className="pt-button" onClick={this.save.bind(this)}>Create</button>
              </div>
          </div>
        </Dialog>
        )
    }
  }
)
