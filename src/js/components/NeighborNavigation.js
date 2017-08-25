'use strict';

var React = require('react');

class NeighborNavigation extends React.Component {

  static defaultProps = {
    neighbors: []
  };

  constructor(props) {
    super(props);
  }


  render() {
    let {neighbors} = this.props
    if (neighbors.length == 0) return <div></div>
    return (
      <div className="NeighborNavigation">
        <h3>Keyboard Navigation in Neighborhood</h3>
        <ul>
        { neighbors.slice(0, 7).map((n, i) => {
          let prefix = `[ ${i+1} ]`
          return <li key={i}>{ prefix } { n.data('id') }</li>
        })}
        </ul>
      </div>
    )
  }
}

NeighborNavigation.propTypes = {
  neighbors: React.PropTypes.array
}

export default NeighborNavigation