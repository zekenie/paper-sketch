import React from 'react';
import { connect } from 'react-redux';
import { createProject } from '../reducer';
import { Dialog } from "@blueprintjs/core";

export default connect(function() {
  return {};
}, { createProject })(
  class New extends React.Component {
    state = {
      name: '',
    }

    get payload() {
      return { name: this.state.name };
    }

    save(e) {
      e.preventDefault();
      this.props.createProject(this.payload);
      this.props.toggle();
    }

    makeKeyHandler(field) {
      return e => this.setState({
        [field]: e.target.value
      });
    }

    render() {
      return (
        <Dialog isOpen={true} title="New Project" onClose={this.props.toggle}>
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
