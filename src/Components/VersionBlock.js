/*global chrome*/
import React, { Component } from 'react';

class VersionBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: null
        };
        this.changeVersion = this.changeVersion.bind(this)
    }

    changeVersion(version){
        this.setState({
            version:version
        });
    }
    componentWillMount() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log('message - ');
            console.log(message);
            this.changeVersion(message.version)
        });
    }


    render() {
        return (
            <div>
                {this.state.version ? JSON.stringify(this.state.version) : null}
            </div>
        );
    }
}

export default VersionBlock;
