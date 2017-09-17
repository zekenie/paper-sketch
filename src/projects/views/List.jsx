import React from 'react';
import { connect } from 'react-redux';
import { loadProjects } from '../reducer';
import { Link } from 'react-router-dom';
import New from '../components/New';
import { Flex, Box } from 'grid-styled';

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
          <nav className="pt-navbar .modifier">
            <div className="pt-navbar-group pt-align-left">
              <div className="pt-navbar-heading">🍝 Nooodle</div>
            </div>
            <div className="pt-navbar-group pt-align-right">
              <button className='pt-button pt-minimal pt-icon-document' onClick={this.toggleModal.bind(this)}></button>
            </div>
          </nav>
          { this.state.newModalOpen && <New toggle={this.toggleModal.bind(this)} />}
          <Flex wrap width={960} m="auto" pt="25px" className="projects-container">
            <Box onClick={this.toggleModal.bind(this)} width={1/3} className="project">
              <div className="pt-non-ideal-state">
                <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                  <span className="pt-icon pt-icon-document"></span>
                </div>
              </div>
              <div className="overlay">New</div>
            </Box>
            {this.props.projects.map(p => <ProjectTile project={p} key={p.id} />)}
          </Flex>
        </div>
      )
    }
  }
)

class ProjectTile extends React.Component {

  componentDidMount() {
    this.resizeSvg();
  }
  
  componentWillRecieveProps() {}

  resizeSvg() {
    if (this.svg) {
      const width = 960/3;
      const height = width * this.ratio;
      this.svg.setAttribute('width', width);
      this.svg.setAttribute('height', height);
      this.g.setAttribute('transform', 'scale(0.25)');
    }
  }

  render() {
    const p = this.props.project
    return (
      <Box width={1/3} p="1em" ref={el => this.box = el} className="project">
        <Link to={`/projects/${p.id}`}>
          { p.svg &&
            <div ref={el => {
              if (!el) { return; }
              this.svg = el.querySelector('svg');
              this.ratio = this.svg.clientHeight /this.svg.clientWidth;
              console.log(this.ratio)
              this.g = el.querySelector('g');
            }}
            dangerouslySetInnerHTML={{
              __html: p.svg
            }} 
            /> 
          }
          { p.svg && 
            <div className="overlay">{p.name}</div>
          }
          { !p.svg &&
            <div className="no-overlay">{p.name}</div>
          }
        </Link>
      </Box>
    );
  }
}