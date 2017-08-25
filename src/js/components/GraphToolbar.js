'use strict';

var React = require('react');
import AppConstants from 'constants/AppConstants'
import { IconButton, FlatButton,
  Slider, IconMenu, MenuItem, FontIcon} from 'material-ui';
var _NodeInput = require('components/shared/_NodeInput')
var _NodeSelector = require('components/shared/_NodeSelector')
var util = require('utils/util')
var mindgraph_util = require('utils/mindgraph_util')
import {pick} from 'lodash'

class GraphToolbar extends React.Component {

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
    this.setTool = this.setTool.bind(this)
    this.dismissTool = this.setTool.bind(this, 'select')
    this.addEdge = this.addEdge.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleEdgeNodeSelected = this.handleEdgeNodeSelected.bind(this)
    this.handleNodeSelected = this.handleNodeSelected.bind(this)

    // Search
    this.handleQueryChange = this.handleQueryChange.bind(this)

    // Layout Sliders
    this.handleNodeRepulsionSlide = this.handleSlide.bind(this, 'nodeRepulsion')
    this.handleNodeOverlapSlide = this.handleSlide.bind(this, 'nodeOverlap')
    this.handleIdealEdgeLengthSlide = this.handleSlide.bind(this, 'idealEdgeLength')

    this.autosizeNodesConnections = this.autosizeNodes.bind(this, 'connections')

    this.layoutConfigs = ['nodeRepulsion', 'nodeOverlap', 'idealEdgeLength']
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  setTool(t) {
    this.props.onToolChange(t)
  }

  addEdge(el) {
    this.setState({form: {}})
    this.props.onAddEdge(el)
  }

  autosizeNodes(type) {
    this.props.onAutosizeNodes(type)
  }

  handleEdgeNodeSelected(node_id) {
    let {selected_tool} = this.props
    let form = selected_tool.form
    if (!form.source) form.source = node_id
    else if (!form.target) {
      this.addEdge({
        group: 'edges',
        data: {
          id: util.randomId(10),
          source: form.source,
          target: node_id
        }
      })
      form = {}
    }
    this.props.onToolFormChange(form)
  }

  handleNodeSelected(node_id) {
    this.props.onSelectNode(node_id)
  }

  handleInputChange(key, val) {
    let {selected_tool} = this.props
    let form = selected_tool.form || {}
    form[key] = val
    this.setState({form})
  }

  handleQueryChange(e) {
    let {selected_tool} = this.props
    let form = selected_tool.form || {}
    form.query = e.currentTarget.value
    this.props.onToolFormChange(form)
    // Do Search? cy[name *= value] (substring)
  }

  handleSlide(key, event, val) {
    let {selected_tool} = this.props
    let form = selected_tool.form || {}
    form[key] = val
    this.props.onToolFormChange(form)
    this.props.onLayoutConfigChange(pick(form, this.layoutConfigs))
  }

  getToolForm() {
    let {selected_tool, cy} = this.props
    let form = selected_tool.form || {}
    let actions = []
    let content, cta, name
    name = selected_tool.name
    let id = selected_tool.id
    if (selected_tool.id == 'node') {
      let label_prop = 'name' //mindgraph_util._get_label_prop(graph_json)
      let _input = <_NodeInput key={label_prop} prop={label_prop} value={form[label_prop]} onChange={this.handleInputChange} />
      content = (
        <div>
          { _input }
        </div>
      )
      let entered_label = form[label_prop] || ''
      let valid_label = entered_label.length > 0
      cta = valid_label ? "Add Node" : "Enter label"
    } else if (selected_tool.id == 'edge') {
      if (!form.source) cta = "Choose source (search or click node)"
      else if (!form.target) cta = "Choose target (search or click node)"
      content = <_NodeSelector nodes={cy.nodes()} onChange={this.handleEdgeNodeSelected} hint={cta} />
    } else if (selected_tool.id == 'layout_config') {
      content = (
        <div>
          <label>Ideal Edge Length</label>
          <Slider name="idealEdgeLength" min={0} max={30} value={form.idealEdgeLength} onChange={this.handleIdealEdgeLengthSlide} />
          <label>Node Repulsion</label>
          <Slider name="nodeRepulsion" min={0} max={800000} step={10000} value={form.nodeRepulsion} onChange={this.handleNodeRepulsionSlide} />
          <label>Node Overlap</label>
          <Slider name="nodeOverlap"  min={0} max={30} value={form.nodeOverlap} onChange={this.handleNodeOverlapSlide} />
        </div>
        )
    } else if (selected_tool.id == 'search') {
      // Autocomplete? Or select on enter in text box (center on query results)
      content = (
        <div>
          <_NodeSelector nodes={cy.nodes()} onChange={this.handleNodeSelected} hint="Search for node..." />
        </div>
        )
    }
    return { id, content, actions, cta, name }
  }

  render() {
    let {selected_tool} = this.props
    let tool_form = this.getToolForm()
    // TODO: Only show edge if node selected
    let _tools = AppConstants.TOOLS.map((tool) => {
      let sel = tool.id == selected_tool.id
      return <_Tool key={tool.id} tool={tool} selected={sel} onToolSelected={this.setTool} />
    })
    return (
      <div>
        <div className="GraphToolbar">
          <h3>Tool: { selected_tool.name }</h3>
          <div className="inputs">
            <p>{ tool_form.cta }</p>
            { tool_form.content }
            { tool_form.actions }
          </div>
          <div className="tools">
            { _tools }
            <IconMenu iconButtonElement={<IconButton><FontIcon className="material-icons">more_vert</FontIcon> /></IconButton>}>
              <MenuItem primaryText="Autosize Nodes - Connections" onClick={this.autosizeNodesConnections} />
            </IconMenu>
          </div>
        </div>
      </div>
    )
  }
}

GraphToolbar.propTypes = {
  cy: React.PropTypes.object,
  onAddNode: React.PropTypes.func,
  onAddEdge: React.PropTypes.func,
  onRefreshLayout: React.PropTypes.func,
  onLayoutConfigChange: React.PropTypes.func,
  onToolChange: React.PropTypes.func,
  onToolFormChange: React.PropTypes.func,
  onSelectNode: React.PropTypes.func,
  onAutosizeNodes: React.PropTypes.func,
  onShowJSON: React.PropTypes.func,
  selected_tool: React.PropTypes.object
}

class _Tool extends React.Component {

  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {};
    this.selectTool = this.selectTool.bind(this)
  }

  selectTool() {
    let {tool} = this.props
    this.props.onToolSelected(tool)
  }

  render() {
    let {tool, selected} = this.props
    let color = selected ? "#0CF" : "#FFF"
    let is = {
      color: color
    }
    let tool_name = (tool.shortcut.length > 0) ? util.withKeyboardShortcut(tool.name, tool.shortcut[0]) : tool.name
    return  <IconButton iconClassName="material-icons" onClick={this.selectTool} iconStyle={is} tooltip={tool_name} tooltipPosition="top-center">{tool.icon}</IconButton>
  }
}

_Tool.propTypes = {
  tool: React.PropTypes.object,
  selected: React.PropTypes.bool,
  onToolSelected: React.PropTypes.func
}


export default GraphToolbar