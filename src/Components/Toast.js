import React from 'react';
import { Alert } from 'reactstrap';

class Toast extends React.Component {
        state = {
            visible: false
        };

    componentWillReceiveProps(nextProps) {
            this.setState({
                visible:nextProps.visible
            });
    }

    render() {
        return (
            <div>
            <Alert color={this.props.color} isOpen={this.state.visible}>
                {this.props.children}
            </Alert>
            </div>
        );
    }
}

export default Toast;