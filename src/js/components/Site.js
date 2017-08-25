'use strict';

var React = require('react');
var Router = require('react-router');
var mui = require('material-ui');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
var AppConstants = require('constants/AppConstants');
var toastr = require('toastr');
var RouteHandler = Router.RouteHandler;
const RawTheme = require('config/RawTheme');

import {fade} from 'material-ui/utils/colorManipulator';
import {
  amber500, cyan700, amber400, amber700,
  grey600, fullWhite, white
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: "#45D8FF",
    primary2Color: cyan700,
    primary3Color: grey600,
    accent1Color: amber700,
    accent2Color: amber500,
    accent3Color: amber400,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12),
  },
  appBar: {
    color: '#303030',
    textColor: white
  },
  raisedButton: {
    textColor: white,
    primaryTextColor: white,
    secondaryTextColor: white
  }
});

class Site extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-bottom-left";
  }

  render() {
    var YEAR = new Date().getFullYear();
    var year_text;
    if (AppConstants.YEAR != YEAR) year_text = <span>&copy; { AppConstants.YEAR } - { YEAR } { AppConstants.SITENAME }</span>
    else year_text = <span>&copy; { YEAR } { AppConstants.SITENAME }</span>
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div>{this.props.children}</div>
          </div>
        </MuiThemeProvider>
    )
  }
};

var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

module.exports = Site;
