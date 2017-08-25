var React = require('react');

var Site = require('components/Site');
var Public = require('components/Public');
var App = require('components/App');

var NotFound = require('components/NotFound');

var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var IndexRedirect = Router.IndexRedirect;

module.exports = (
  <Route component={Site} path="/">
    <Route path="public" component={Public} />
    <Route path="app" component={App} />
    <IndexRedirect to="/app" />
  </Route>
);