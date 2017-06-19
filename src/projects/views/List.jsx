import React from 'react';
import { connect } from 'react-redux';
import { loadProjects } from '../reducer';
import { Link } from 'react-router-dom';
import New from '../components/New';

function mapStateToProps(state) {
  return {
    projects: Object.values(state.projects),
  }
}

export default connect(mapStateToProps, { loadProjects })(
  class ProjectList extends React.Component {

    state = {
      newModalOpen: false
    }

    static defaultProps = {
      page: 0,
      perPage: 25,
    }

    toggleModal() {
      this.setState({
        newModalOpen: !this.state.newModalOpen,
      });
    }

    componentDidMount() {
      const skip = Math.floor(this.props.page * this.props.perPage);
      const limit = this.props.perPage;
      this.props.loadProjects(skip, limit);
    }

    render() {
      return (
        <div>
          <button onClick={this.toggleModal.bind(this)}>New</button>
          { this.state.newModalOpen && <New toggle={this.toggleModal.bind(this)} />}
          <ul>
            {this.props.projects.map(p => 
              <li key={p.id}>
                <Link to={`/projects/${p.id}`}>
                  {p.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )
    }
  }
)
