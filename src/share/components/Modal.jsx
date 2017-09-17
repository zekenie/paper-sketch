import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dialog, Switch, Tooltip, Intent } from "@blueprintjs/core";
import { toaster } from '../../toaster';
import { encode } from '../../files/githubEncoder';

export default connect(function() {
  return {};
}, {})(
  class Share extends React.Component {
    state = {
      userLoaded: false,
      userLoggedIn: false,
      public: false,
      shareButtonDisabled: false,
    }

    async componentDidMount() {
      const afterLoadState = {
        userLoaded: true,
      };

      const res = await axios.get('/api/whoami');
      afterLoadState.userLoggedIn = res.data.userLoggedIn;
      if (res.data.userLoggedIn) {
        try {
          const projectRes = await axios.get(`/api/projects/${this.props.project.id}`);
          afterLoadState.public = projectRes.data.public;
        } catch(e) {}
      }
      this.setState(afterLoadState);
    }

    get payload() {
      return {
        public: this.state.public,
        id: this.props.project.id,
        project: {
          name: this.props.project.name,
          id: this.props.project.id,
        },
        files: encode(this.props.files),
      };
    }

    async save(e) {
      e.preventDefault();
      this.setState({
        shareButtonDisabled: true,
      });
      await axios.post('/api/projects', this.payload);
      toaster.show({
        message: 'Gist saved. URLs on your clipboard!',
        intent: Intent.SUCCESS,
      });
      this.setState({
        shareButtonDisabled: false,
      });
      this.props.toggle();
    }

    get needsAuthorization() {
      return this.state.userLoaded && !this.state.userLoggedIn;
    }

    renderLoading() {
      return (
        <div>
          <p className="pt-skeleton">loading</p>
          <p className="pt-skeleton">loading</p>
          <p className="pt-skeleton">loading</p>
          <p className="pt-skeleton">loading</p>
        </div>
      );
    }

    renderDescription() {
      return (
        <div>
          <p>Nooodle uses Github Gists as its underlying publishing engine.
            When you share, you can choose if you want your project to be public or not. 
            In other words, you can share with a friend and not the whole internet, if you want.</p>

          <p>But, in order to do either, you have to give us authorization to publish Gists on your github account.</p>
        </div>
      );
    }

    renderAuthorizeButton() {
      return (
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <a className="pt-button" href={`/api/auth/github?afterLogin=/projects/${this.props.project.id}`}>Authorize Github</a>
          </div>
        </div>
      );
    }

    renderShare() {
      return (
        <form>
          <Switch
            checked={this.state.public}
            label={
              <span>
                Public
                {' '}
                <Tooltip content="If its public, people will see it on Github and Nooodle. If its private, only people with the URL will see it.">
                  <span className="pt-icon-standard pt-icon-help"></span>
                </Tooltip>
              </span>
            }
            onChange={() => this.setState({ public: !this.state.public })} />
        </form>
      )
    }

    renderShareButtons() {
      return (
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <button disabled={this.state.shareButtonDisabled} onClick={this.save.bind(this)} className="pt-button">Share</button>
          </div>
        </div>
      );
    }
    
    render() {
      return (
        <Dialog isOpen={true} title={`Share ${this.props.project.name}`} onClose={this.props.toggle}>
          <div className="pt-dialog-body">
            { this.state.userLoaded ? 
              <div>
                {!this.state.userLoggedIn && this.renderDescription()}
                {this.state.userLoggedIn && this.renderShare() }
              </div>
            :
              this.renderLoading()
            }
          </div>
          { this.needsAuthorization && this.renderAuthorizeButton() }
          { this.state.userLoggedIn && this.renderShareButtons() }
        </Dialog>
        )
    }
  }
)
