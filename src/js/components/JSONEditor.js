'use strict';

var React = require('react');
import { MenuItem, IconMenu, RaisedButton,
  FontIcon, IconButton, TextField} from 'material-ui';
import {pick, set, get} from 'lodash'


class JSONEditor extends React.Component {

  static defaultProps = {
    filename: 'mindgraph'
  };

  constructor(props) {
    super(props);
    let j;
    this.state = {
      json: '',
      open: true
    };
    this.handleJsonChange = this.handleJsonChange.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
    this.loadTest = this.loadDummyData.bind(this, 'test.json')
    this.loadBrain = this.loadDummyData.bind(this, 'brain.json')

    this.downloadFormatCytoscape = this.download.bind(this, 'cytoscape')
    this.downloadFormatStatelessCytoscape = this.download.bind(this, 'stateless_cytoscape')
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  toggleVisible() {
    this.setState({open: !this.state.open})
  }

  hide() {
    this.setState({open: false})
  }

  handleJsonChange(e) {
    this.setState({json: e.currentTarget.value})
  }

  handleUpdateClick() {
    try {
      let parsed = JSON.parse(this.state.json)
      this.props.onUpdateClick(parsed)
    } catch (e) {
    }
  }

  loadDummyData(filename) {
    fetch(`/static/data/${filename}`).then((res) => {
      // TODO: Perf
      res.json().then((json) => {
        this.setState({json: JSON.stringify(json)}, () => {
          this.props.onUpdateClick(json)
        })
      })
    })
  }

  updateJSON(json)  {
    this.setState({json: JSON.stringify(json)})
  }

  download(format) {
    let {filename} = this.props
    let {json} = this.state
    let dataStr = ''
    if (format == 'cytoscape') {
      dataStr = json
    } else if (format == 'stateless_cytoscape') {
      const KEEP = {
        'nodes': ['data.id', 'data.name', 'data.size'],
        'edges': ['data.id', 'data.source', 'data.target']
      }
      let _json = JSON.parse(json)
      let _json_out = {}
      Object.keys(KEEP).forEach((key) => {
        _json.elements[key].forEach((n, i) => {
          let stripped = {}
          KEEP[key].forEach((path) => {
            set(stripped, path, get(n, path))
          })
          set(_json_out, ['elements', key, i], stripped)
        })        
      })
      dataStr = JSON.stringify(_json_out)
    }
    if (dataStr.length > 0) {
      var dlAnchorElem = document.getElementById('downloadAnchorElem');
      dlAnchorElem.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(dataStr));
      dlAnchorElem.setAttribute("download", `${filename}.json`);
      dlAnchorElem.click();
    }
  }

  render() {
    let {json, open} = this.state
    let cls = "JSONEditor"
    if (open) cls += " open"
    const SHOW_TEST_LOADER_MENU = false
    let any_json = json && json.length > 0
    return (
      <div className={cls}>
        <br/><br/><br/>
        <TextField floatingLabelText="Raw JSON" value={json}
          onChange={this.handleJsonChange} multiLine fullWidth rowsMax={15} />

        <RaisedButton label="Update" onClick={this.handleUpdateClick} primary disabled={!any_json} />

        <div hidden={!SHOW_TEST_LOADER_MENU}>
          <IconMenu iconButtonElement={<IconButton><FontIcon className="material-icons">more_vert</FontIcon> /></IconButton>}>
            <MenuItem primaryText="Load Test" onClick={this.loadTest} />
            <MenuItem primaryText="Load Brain" onClick={this.loadBrain} />
          </IconMenu>
        </div>

        <IconMenu iconButtonElement={<IconButton disabled={!any_json}><FontIcon className="material-icons">file_download</FontIcon> /></IconButton>}>
          <MenuItem primaryText="Download Cytoscape JSON" onClick={this.downloadFormatCytoscape} />
          <MenuItem primaryText="Download Stateless Cytoscape JSON" onClick={this.downloadFormatStatelessCytoscape} />
          <MenuItem primaryText="Download Graph JSON (TODO)" />
          <MenuItem primaryText="Download Graph Markdown (TODO)" />
        </IconMenu>

        <div hidden><a id="downloadAnchorElem"></a></div>

      </div>
    )
  }
}

JSONEditor.propTypes = {
  filename: React.PropTypes.string,
  onUpdateClick: React.PropTypes.func
}

export default JSONEditor