'use strict';

var React = require('react');
import { AutoComplete } from 'material-ui';
var mindgraph_util = require('utils/mindgraph_util')

class _NodeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.updateInput = this.updateInput.bind(this)
  }

  componentDidMount() {
    let {nodes} = this.props
    let node_array = nodes.map((n) => {
      return {id: n.data('id'), label: n.data('name')}
    })
    this.setState({nodes: node_array})
  }

  changeHandler(chosenRequest, index) {
    let {nodes} = this.state
    this.props.onChange(nodes[index].id)
    this.updateInput('')
  }

  updateInput(val) {
    this.setState({value: val})
  }

  render() {
    let {hint} = this.props
    let {nodes, value} = this.state
    return (
      <AutoComplete
            hintText={hint}
            dataSource={nodes}
            value={value}
            onUpdateInput={this.updateInput}
            onNewRequest={this.changeHandler}
            filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 }
            dataSourceConfig={{text: 'label', value: 'id'}}
            floatingLabelText={hint}
            fullWidth={true}
          />
    )
  }
}

_NodeSelector.defaultProps = {

}

_NodeSelector.propTypes = {
  hint: React.PropTypes.string,
  nodes: React.PropTypes.object,
  onChange: React.PropTypes.func
}


export default _NodeSelector