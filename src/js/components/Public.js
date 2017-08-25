var React = require('react');
var AppConstants = require('constants/AppConstants');
import {Link} from 'react-router';
import {RaisedButton, Snackbar} from 'material-ui';

export default class Public extends React.Component {
    static defaultProps = {
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let SITENAME = AppConstants.SITENAME;
        return (
            <div>

                <div className="text-center">

                </div>

            </div>
        );
    }
}
