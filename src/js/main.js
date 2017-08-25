var React = require('react');
var ReactDOM = require('react-dom');
// Browser ES6 Polyfill
require('babel/polyfill');
var routes = require('config/Routes');
import { Router, browserHistory } from 'react-router';
ReactDOM.render(<Router routes={routes} history={browserHistory} />, document.getElementById('app'));
