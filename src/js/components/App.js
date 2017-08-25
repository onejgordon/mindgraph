'use strict';

var React = require('react');
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import { FontIcon, MenuItem, RaisedButton,
  IconButton, AppBar, Drawer} from 'material-ui';
var AppConstants = require('constants/AppConstants');
var MindGraph = require('components/MindGraph');
var api = require('utils/api');
var toastr = require('toastr');

class App extends React.Component {

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      ln_open: false,
      signing_in: false
    };
  }

  goto_page(page) {
    this.setState({ln_open: false}, () => {
      browserHistory.push(page);
    })
  }

  go_home() {
    this.goto_page('/app');
  }

  render() {
    let {SITENAME} = AppConstants;
    return (
      <div>
        <AppBar
          title={SITENAME}
          zDepth={0}
          iconElementLeft={<span></span>}
          onTitleTouchTap={this.go_home.bind(this)} />

        <div id="container" className="container">

          <div className="app-content row">
            <MindGraph />
          </div>
        </div>

      </div>
    )
  }
}

export default App