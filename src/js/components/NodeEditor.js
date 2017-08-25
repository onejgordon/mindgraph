'use strict';

var React = require('react');
import { RaisedButton, FlatButton, Drawer} from 'material-ui';
import {clone} from 'lodash'
var _NodeInput = require('components/shared/_NodeInput')
var NeighborNavigation = require('components/NeighborNavigation')

class NodeEditor extends React.Component {

  static defaultProps = {
    node: null
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {}
    };
    this.handleNodeUpdate = this.handleNodeUpdate.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.formChange = this.formChange.bind(this)

    this.standardFields = {
      'id': {
        label: 'id',
        type: 'text',
        editable: false
      },
      'size': {
        label: 'Size',
        type: 'number',
        editable: true
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
    let prev_node_id = prevProps.node ? prevProps.node.data('id') : null
    let new_node_id = this.props.node ? this.props.node.data('id') : null
    let node_change = prev_node_id != new_node_id
    if (node_change && this.props.node) {
      this.setState({form: clone(this.props.node.data())})
    }
  }

  handleNodeUpdate() {
    let {form} = this.state
    if (form) this.props.onNodeUpdate(form)
  }

  handleClose() {
    this.props.onClose()
  }

  formChange(prop, value) {
    let {form} = this.state
    form[prop] = value
    this.setState({form})
  }

  render() {
    let {node} = this.props
    let {form} = this.state
    let _inputs = []
    let neighbors = []
    if (node != null) {
      neighbors = node.neighborhood('node').toArray()
      let fields = clone(this.standardFields)
      Object.keys(node.data()).forEach((key) => {
        if (!fields[key]) fields[key] = {type: 'text', editable: true}
      })
      Object.keys(fields).forEach((name) => {
        let f = fields[name]
        let val = form[name]
        if (typeof val !== 'object') {
          _inputs.push(<_NodeInput key={name} prop={name} value={val||''} onChange={this.formChange} editable={f.editable} />)
        }
      })
    } else return null
    return (
      <div className="NodeEditor">

        { _inputs }

        <RaisedButton label="Update" onClick={this.handleNodeUpdate} primary />
        <FlatButton label="Close" onClick={this.handleClose} />

        <NeighborNavigation neighbors={neighbors} />

      </div>
    )
  }
}

NodeEditor.propTypes = {
  node: React.PropTypes.object,
  onNodeUpdate: React.PropTypes.func,
  onClose: React.PropTypes.func
}

export default NodeEditor