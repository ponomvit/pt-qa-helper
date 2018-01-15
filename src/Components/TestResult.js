import React, { Component } from 'react';
import Toast from './Toast'
import {Container, ButtonGroup, Button} from 'reactstrap';
import copy from 'copy-to-clipboard';
const platform = require('platform');



class TestResult extends React.Component {
    state = {
        isAlertVisible: false,
        alertMessage: null,
        alertColor: null
    };

    removeToast = (t=2000) => {
            setTimeout(() => this.setState({
                isAlertVisible:false
            }),t)
    };
    copyPassedResult = () => {
    let passComment = `{panel:title=PT QA Test Results|borderColor=#828282|titleBGColor=#7EC45C|bgColor=#E1FADE}
                            | *Test Status:* | (/) Test is OK |
                            | *Test scope/Notes:* | No issues were found |
                            | *Device/OS/Browser:* | ${platform.os} ${platform.name} ${platform.version} |
                            | *Env URL:* | ${this.props.url} |
                            | *WPL Version:* | ${this.props.version.WPL_Version} |
                            | *Licensee version:* | ${this.props.version.Licensee_Version} |
                            | *Build number:* | ${this.props.version.Build_Number} |
                            | *Build created:* | ${this.props.version.Build_Created} | 
                            | *Build from branch:* | ${this.props.version.Built_From.replace('refs/heads/', '')} | 
                            | *Package name:* | ${this.props.version.Package_Name} | 
                            | *Last Commit hash:* | ${this.props.version.WPL_Git_Log[1].split(' |')[1].trim()} | 
                            {panel}`;
    copy(passComment);
        this.setState({
            isAlertVisible:true,
            alertMessage: 'Copied.',
            alertColor: 'success'
        });
        this.removeToast()
};
    copyFailedResult = () => {
    let failComment = `{panel:title=PT QA Test Results|borderColor=#828282|titleBGColor=#ff7f7f|bgColor=#FFF4F0}
                             | *Test Status:* | (x) Ticket Reopened |
                             | *Test scope/Notes:* | Issue is reproduced again |
                             | *Device/OS/Browser:* | ${platform.os} ${platform.name} ${platform.version} |
                             | *Env URL:* | ${this.props.url} |
                             | *WPL Version:* | ${this.props.version.WPL_Version} |
                             | *Licensee version:* | ${this.props.version.Licensee_Version} |
                             | *Build number:* | ${this.props.version.Build_Number} |
                             | *Build created:* | ${this.props.version.Build_Created} | 
                             | *Build from branch:* | ${this.props.version.Built_From.replace('refs/heads/', '')} | 
                             | *Package name:* | ${this.props.version.Package_Name} | 
                             | *Last Commit hash:* | ${this.props.version.WPL_Git_Log[1].split(' |')[1].trim()} | 
                             {panel}`;
    copy(failComment);
        this.setState({
            isAlertVisible:true,
            alertMessage: 'Copied.',
            alertColor: 'danger'
        });
        this.removeToast();
}

    render() {
        return (
            <div>
                <h5>
                    Test Result
                </h5>
                <ButtonGroup>
                    <Button color="success" onClick={this.copyPassedResult}>Passed</Button>
                    <Button color="danger" onClick={this.copyFailedResult}>Failed</Button>
                </ButtonGroup>
                <Toast visible={this.state.isAlertVisible} color={this.state.alertColor}>{this.state.alertMessage}</Toast>
            </div>
        );
    }
}

export default TestResult;


