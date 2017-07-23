import Modal from 'react-modal';
import React from 'react';
import { connect } from 'react-redux';
import { createProject } from '../reducer';
import {
    Dialog
} from "@blueprintjs/core";

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
        <Dialog isOpen={true} title="New Project">
          <div className="pt-dialog-body">
            <form onSubmit={this.save.bind(this)}>
              <input
                value={this.state.name}
                autoFocus
                onChange={this.makeKeyHandler('name').bind(this)}
              />
              <button onClick={this.save.bind(this)}>Create</button>
            </form>
            <button onClick={this.props.toggle}>Cancel</button>
          </div>
        </Dialog>
        )
    }
  }
)
