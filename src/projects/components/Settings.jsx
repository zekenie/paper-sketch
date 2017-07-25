import React from 'react';
import { connect } from 'react-redux';
import { updateProject, removeProject } from '../reducer';
import { Dialog } from "@blueprintjs/core";

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
       <Dialog
          onClose={this.props.toggle}
          isOpen
          title="Project Settings"
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
            </div>
          </div>
        </Dialog>
        )
    }
  }
)
