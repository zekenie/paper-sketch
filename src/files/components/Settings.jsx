import React from 'react';
import { connect } from 'react-redux';
import { updateFile, removeFile } from '../reducer';
import { Dialog } from "@blueprintjs/core";

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
        <Dialog
          onClose={this.props.toggle}
          isOpen
          title="File Settings"
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
              <button className="pt-button pt-intent-primary" onClick={this.save.bind(this)}>Save</button>
              <button className="pt-button pt-intent-danger" onClick={this.delete.bind(this)}>Delete File</button>
            </div>
          </div>
        </Dialog>
        )
    }
  }
)
