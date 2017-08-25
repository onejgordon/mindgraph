
var util = require('utils/util');
import { clone } from 'lodash';

export default {
  changeHandler: function(target) {
    target.prototype.changeHandler = function(key, attr, event) {
      var state = {};
      state[key] = this.state[key] || {};
      state[key][attr] = event.currentTarget.value;
      this.setState(state);
    };
    target.prototype.changeHandlerVal = function(key, attr, value) {
      var state = {};
      state[key] = clone(this.state[key]) || {};
      state[key][attr] = value;
      state.lastChange = util.nowTimestamp(); // ms
      this.setState(state);
    };
    return target;
  },
  authDecorator: function(target) {
    target.willTransitionTo = function(transition) {
      if (!localStorage.echosenseUser) {
        transition.redirect('login');
      }
    };
    return target;
  }
};