'use strict';

var React = require('react');
import { TextField } from 'material-ui';


class _NodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this)

  }

  changeHandler(e) {
    let {prop} = this.props
    this.props.onChange(prop, e.currentTarget.value)
  }

  render() {
    let {value, prop, editable} = this.props
    let number = !isNaN(value)
    let type = number ? 'number' : 'text'
    return <TextField name={prop}
                      key={prop}
                      type={type}
                      placeholder={prop}
                      value={value||''}
                      onChange={this.changeHandler} fullWidth disabled={!editable} />
  }
}

_NodeInput.defaultProps = {
  editable: true
}

_NodeInput.propTypes = {
  prop: React.PropTypes.string,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object]),
  editable: React.PropTypes.bool,
  onChange: React.PropTypes.func
}


export default _NodeInput