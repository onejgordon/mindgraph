'use strict';

var React = require('react');
import AppConstants from 'constants/AppConstants'
import { FontIcon, MenuItem, RaisedButton,
  IconButton, AppBar, Drawer} from 'material-ui';
var JSONEditor = require('components/JSONEditor');
var GraphToolbar = require('components/GraphToolbar')
var NodeEditor = require('components/NodeEditor')

var cytoscape = require('cytoscape');
import {findItemById} from 'utils/store-utils'
import {find, merge} from 'lodash'
import Dropzone from 'react-dropzone'

var util = require('utils/util')


class MindGraph extends React.Component {

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dropzoneActive: false,
      cy: null,
      label_prop: 'id',
      focus_node_id: null,
      selected_tool: {
        id: 'select',
        name: "Select",
        form: {}
      },
      filename: 'graph'
    };
    this.handleLoadFromJSON = this.handleLoadFromJSON.bind(this)
    this.handleAddNode = this.handleAddNode.bind(this)
    this.handleAddEdge = this.handleAddEdge.bind(this)
    this.handleEditNode = this.handleEditNode.bind(this)
    this.handleNodeEditorClose = this.handleNodeEditorClose.bind(this)
    this.handleRefreshLayout = this.handleRefreshLayout.bind(this)
    this.handleTap = this.handleTap.bind(this)
    this.nodeTapped = this.nodeTapped.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.selectTool = this.selectTool.bind(this)
    this.handleToolFormChange = this.handleToolFormChange.bind(this)
    this.handleLayoutConfigChange = this.handleLayoutConfigChange.bind(this)
    this.handleAutosizeNodeClick = this.handleAutosizeNodeClick.bind(this)
    this.handleNodeSelected = this.handleNodeSelected.bind(this)
    this.toggleJSONEditor = this.toggleJSONEditor.bind(this)

    this.defaultLayoutOpts = {
      name: 'cose',
      nodeDimensionsIncludeLabels: true
    }

    this.DEF_SIZE = 25
  }

  componentDidMount() {
    this.initCytoscape()
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  initCytoscape() {
    this.setState({cy: cytoscape({
        container: document.getElementById('cy'), // container to render in
        style: [ // the stylesheet for the graph
          {
            selector: 'node',
            style: {
              'background-color': '#0cf',
              'color': '#fff',
              'text-outline-color': '#fff',
              'text-outline-opacity': 0.5,
              'label': 'data(id)',
              'width': 'data(size)',
              'height': 'data(size)'
            }
          },
          {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'width': 3,
              'line-color': '#aaa'
            }
          },
          {
            selector: '.hidden',
            style: {
              'background-opacity': 0.2,
              "line-color": "#F4F4F4",
              "text-opacity": 0.2
            }
          },
          {
            selector: '.highlighted',
            style: {
              'background-color': '#F9D519'
            }
          },
          {
            selector: '.highlighted_nbr',
            style: {
              'background-color': '#38DBAF'
            }
          }          
        ]
      })
    }, () => {
      let {cy} = this.state
      cy.on('tap', this.handleTap)
    })
  }

  _get_node_by_id(node_id) {
    let {cy} = this.state
    return cy.$(`#${node_id}`)
  }

  selectTool(tool) {
    if (tool.action) {
      if (tool.id == "show_json") this.toggleJSONEditor()
      else if (tool.id == "refresh") this.handleRefreshLayout()
    } else {
      let {selected_tool} = this.state
      // id of selected tool
      merge(selected_tool, tool)
      this.setState({selected_tool})      
    }
  }

  handleToolFormChange(form) {
    let {selected_tool} = this.state
    selected_tool.form = form
    this.setState({selected_tool})
  }

  dismissTool() {
    this.setState({selected_tool: {id: 'select', name: "Select"}})
  }

  onDrop(accepted, rejected) {
    if (accepted.length == 1) {
      var fr = new FileReader();
      fr.onload = (e) => {
        let raw = e.target.result
        let filename = e.name
        let json
        if (raw) {
          json = JSON.parse(raw)
          if (json != null) this.handleLoadFromJSON(json)
          this.setState({dropzoneActive: false, filename: filename})
        }
      };
      fr.readAsText(accepted[0]);
    }
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  handleGraphChange() {
    let {cy} = this.state
    // Update JSON
    this.refs.editor.updateJSON(cy.json())
  }

  update() {
    let {cy} = this.state
    let prop = 'name' //mindgraph_util._get_label_prop(graph_json)
    cy.nodes().forEach((n) => {
      if (!n.data('size')) n.data('size', this.DEF_SIZE)
    })
    cy.nodes().removeClass('highlighted highlighted_nbr hidden')
    let opts = {
      stop: (e) => {
        e.cy.center()
      }
    }
    let l = cy.layout(merge(opts, this.defaultLayoutOpts))
    l.run()
    this.setState({label_prop: prop}, () => {
      cy.style().selector('node').style('label', `data(${prop})`)
    })
  }

  handleTap(event) {
    let {cy} = this.state
    let tgt = event.target
    if (tgt === cy) {
      // Background tap
      this.backgroundTapped(event)
    } else {
      // Edge tapped?
      this.nodeTapped(event)
    }
  }

  backgroundTapped(event) {
    let {selected_tool} = this.state
    let form = selected_tool.form
    if (selected_tool.id == 'node') {
      // Add node click
      let label_prop = 'name' //mindgraph_util._get_label_prop(graph_json)
      let label = form[label_prop]
      if (label && label.length > 0) {
        let data = {size: this.DEF_SIZE}
        data[label_prop] = label
        data.id = util.randomId(10)
        let el = {
          position: event.position,
          group: 'nodes',
          data: data
        }
        this.handleAddNode(el)
      }
    }
  }

  selectNode(node) {
    let {cy} = this.state
    node.select()
    // let nhood = node.closedNeighborhood()
    // let others = cy.elements().not(node);
    cy.nodes().removeClass('highlighted highlighted_nbr')
    node.addClass('highlighted')
    let neighborhood = node.neighborhood('node')
    neighborhood.addClass('highlighted_nbr')
    cy.animate({
      center: neighborhood,
      duration: 300,
      easing: 'ease-out'
    })
    this.setState({focused_node_id: node.data('id')})
  }

  nodeTapped(event) {
    let {selected_tool, cy} = this.state
    let node = event.target
    if (selected_tool.id == 'select') {
      // Select tool click
      this.selectNode(node)
    } else if (selected_tool.id == 'edge') {

      // Handle edge tool click
      let node_id = event.target.data('id')
      if (!selected_tool.form.source) {
        // Set source
        selected_tool.form.source = node_id
        this.setState({selected_tool})
        return true
      } else if (!selected_tool.form.target) {
        // Set target and add edge
        if (node_id != selected_tool.form.source) {
          let data = {
            id: util.randomId(10),
            source: selected_tool.form.source,
            target: node_id
          }
          let el = {
            group: 'edges',
            data: data
          }
          this.handleAddEdge(el)
          return true
        } else console.warn("Same source/target")
      }
    }
    return false
  }

  handleRefreshLayout() {
    this.update()
  }

  handleLayoutConfigChange(opts) {
    let {cy} = this.state
    merge(opts, this.defaultLayoutOpts)
    cy.layout(opts).run()
  }

  focusedNode() {
    let {focused_node_id, cy} = this.state
    if (focused_node_id) {
      return this._get_node_by_id(focused_node_id)
    }
  }

  handleKeyDown(e) {
    // let keyCode = e.keyCode || e.which;
    let handled = false
    let {selected_tool} = this.state
    if (!handled && !isNaN(e.key)) {
      let n = this.focusedNode()
      let node_selected = n != null
      if (node_selected) {
        // Check if we are selecting a neibhor node
        let num = parseInt(e.key) - 1
        let nbrs = n.neighborhood('node')
        if (num <= nbrs.length) {
          this.selectNode(nbrs[num])
          handled = true
        }
      }
    }
    if (!handled) {
      if (e.key == "Escape") {
        // TODO: Can we detect inputs into text box in another way?
      } else if (selected_tool.id == 'select') {
        // See if we're selecting a tool
        AppConstants.TOOLS.forEach((tool) => {
          if (tool.shortcut.indexOf(e.key.toLowerCase()) > -1) {
            this.selectTool(tool)
            handled = true
          }
        })        
      }
    }
    if (handled) e.preventDefault()
    return !handled
  }

  toggleJSONEditor() {
    this.refs.editor.toggleVisible()
  }

  handleLoadFromJSON(graph_json) {
    let {cy} = this.state
    // Standardize
    graph_json.elements.nodes.forEach((n) => {
      if (!n.data.size) n.data.size = this.DEF_SIZE
    })
    cy.json(graph_json)
    this.setState({focus_node_id: null}, () => {
      this.handleGraphChange()
      this.update(graph_json)
      this.refs.editor.hide()
    })
  }

  handleAddNode(el) {
    let {cy} = this.state
    cy.add(el)
    this.handleGraphChange()
    this.handleToolFormChange({})
  }

  handleAddEdge(el) {
    let {cy, selected_tool} = this.state
    cy.add(el)
    selected_tool.form = {}
    this.setState({selected_tool})
    this.handleGraphChange()
  }

  handleEditNode(data, _update_graph) {
    let update_graph = _update_graph == null ? true : _update_graph
    let {cy} = this.state
    cy.$(`#${data.id}`).data(data)
    if (update_graph) this.handleGraphChange()
  }

  handleAutosizeNodeClick(type) {
    let {cy} = this.state
    if (type == 'connections') {
      //
      const mult = 15
      const min = 10
      cy.nodes().forEach((n) => {
        let n_conn = n.connectedEdges().length
        let size = mult * n_conn + min
        console.log(size)
        this.handleEditNode({id: n.data('id'), size: size}, false)
      })
      this.handleGraphChange()
    }
  }

  handleNodeSelected(node_id) {
    // todo: get node
    let n = this._get_node_by_id(node_id)
    this.selectNode(n)
  }

  handleNodeEditorClose() {
    this.setState({focused_node_id: null})
  }

  render() {
    let {dropzoneActive, selected_tool, cy, filename} = this.state
    return (
      <div className="MindGraph">
        <Dropzone
          accept="application/json"
          disableClick
          style={{}}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}>
          { dropzoneActive && <div className="mgDropzone"><br/><br/>Drop files here to upload...</div> }

          <GraphToolbar ref="toolbar"
                        cy={cy}
                        onAddNode={this.handleAddNode}
                        onAddEdge={this.handleAddEdge}
                        selected_tool={selected_tool}
                        onToolChange={this.selectTool}
                        onToolFormChange={this.handleToolFormChange}
                        onAutosizeNodes={this.handleAutosizeNodeClick}
                        onLayoutConfigChange={this.handleLayoutConfigChange}
                        onRefreshLayout={this.handleRefreshLayout}
                        onShowJSON={this.toggleJSONEditor}                        
                        onSelectNode={this.handleNodeSelected} />

          <NodeEditor node={this.focusedNode()}
                      onNodeUpdate={this.handleEditNode}
                      onClose={this.handleNodeEditorClose} />

          <JSONEditor
            ref="editor"
            filename={filename}
            onUpdateClick={this.handleLoadFromJSON} />


          <div id="cy" className="cytoscapeDiv"></div>

        </Dropzone>
      </div>
    )
  }
}

export default MindGraph