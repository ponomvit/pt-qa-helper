import React from 'react';
import { Alert } from 'reactstrap';

class Toast extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
            this.setState({
                visible:nextProps.visible
            });
    }

    render() {
        return (
            <div style={{position:'absolute', bottom:'7%', left:'50%',transform: 'translate(-50%, -50%)'}}>
            <Alert color={this.props.color} isOpen={this.state.visible}>
                {this.props.children}
            </Alert>
            </div>
        );
    }
}

export default Toast;