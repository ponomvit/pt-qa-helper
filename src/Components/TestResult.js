import React, { Component } from 'react';
import {ButtonGroup, Button, Container} from 'reactstrap';
import copy from 'copy-to-clipboard';
const platform = require('platform');



class TestResult extends Component {
    copyPassedResult = () => {
    let passComment = `{panel:title=PT QA Test Results|borderColor=#828282|titleBGColor=#7EC45C|bgColor=#E1FADE}
                            | *Test Status:* | (/) Test is OK | |
                            | *Test scope/Notes:* | No issues were found |  |
                            | *Device/OS/Browser:* | Desktop / ${platform.os} | ${platform.name} ${platform.version} |
                            | *Env URL/Theme:* | ${this.props.url} | ${this.props.theme}|
                            || Item || Back End || Front End ||
                            | *WPL Version:* | ${this.props.backEndVersion.WPL_Version && this.props.backEndVersion.WPL_Version} | ${this.props.frontEndVersion.WPL_Version ? this.props.frontEndVersion.WPL_Version : ''} |  
                            | *Build number:* | ${this.props.backEndVersion.Build_Number && this.props.backEndVersion.Build_Number} | ${this.props.frontEndVersion.Build_Number ? this.props.frontEndVersion.Build_Number: ''} |
                            | *Build from branch:* | ${this.props.backEndVersion.Built_From && this.props.backEndVersion.Built_From.replace('refs/heads/', '')} | ${this.props.frontEndVersion.Built_From ? this.props.frontEndVersion.Built_From.replace('refs/heads/', '') : ''} |
                            | *Build created:* | ${this.props.backEndVersion.Build_Created && this.props.backEndVersion.Build_Created} | ${this.props.frontEndVersion.Build_Created ? this.props.frontEndVersion.Build_Created : ''} |  
                            | *Package name:* | ${this.props.backEndVersion.Package_Name && this.props.backEndVersion.Package_Name} | ${this.props.frontEndVersion.Package_Name ? this.props.frontEndVersion.Package_Name : ''} |
                            | *Last Commit hash:* | ${this.props.backEndVersion.WPL_Git_Log && this.props.backEndVersion.WPL_Git_Log[1].split(' |')[1].trim().substring(0,8)} | ${this.props.frontEndVersion.WPL_Git_Log ? this.props.frontEndVersion.WPL_Git_Log[1].split(' |')[1].trim().substring(0,8) : ''} | 
                            {panel}`;
    copy(passComment);
        this.props.handleAlert('Passed result is copied.','success')
};
    copyFailedResult = () => {
    let failComment = `{panel:title=PT QA Test Results|borderColor=#828282|titleBGColor=#ff7f7f|bgColor=#FFF4F0}
                             | *Test Status:* | (x) Ticket Reopened |  |
                             | *Test scope/Notes:* | Issue is reproduced again | |
                             | *Device/OS/Browser:* | Desktop / ${platform.os} | ${platform.name} ${platform.version} |
                             | *Env URL/Theme:* | ${this.props.url} | ${this.props.theme} |
                             || Item || Back End || Front End ||
                             | *WPL Version:* | ${this.props.backEndVersion.WPL_Version && this.props.backEndVersion.WPL_Version} | ${this.props.frontEndVersion.WPL_Version ? this.props.frontEndVersion.WPL_Version : ''} |
                             | *Build number:* | ${this.props.backEndVersion.Build_Number} | ${this.props.frontEndVersion.Build_Number ? this.props.frontEndVersion.Build_Number : '' } |
                             | *Build created:* | ${this.props.backEndVersion.Build_Created} | ${this.props.frontEndVersion.Build_Created ? this.props.frontEndVersion.Build_Created : ''} | 
                             | *Build from branch:* | ${this.props.backEndVersion.Built_From.replace('refs/heads/', '')} |${this.props.frontEndVersion.Built_From ? this.props.frontEndVersion.Built_From.replace('refs/heads/', '') : ''} | 
                             | *Package name:* | ${this.props.backEndVersion.Package_Name} | ${this.props.frontEndVersion.Package_Name ? this.props.frontEndVersion.Package_Name : ''} |
                             | *Last Commit hash:* | ${this.props.backEndVersion.WPL_Git_Log[1].split(' |')[1].trim().substring(0,8)} | ${this.props.frontEndVersion.WPL_Git_Log ? this.props.frontEndVersion.WPL_Git_Log[1].split(' |')[1].trim().substring(0,8) : ''} |
                             {panel}`;
    copy(failComment);
        this.props.handleAlert('Failed result is copied.','danger')
};

    render() {
        return (
            <Container>
                <h5>
                    Test Result
                </h5>
                <ButtonGroup>
                    <Button color="success" onClick={this.copyPassedResult}>Passed</Button>
                    <Button color="danger" onClick={this.copyFailedResult}>Failed</Button>
                </ButtonGroup>
            </Container>
        );
    }
}

export default TestResult;


