/*global chrome*/
import React, { Component } from 'react';
import { Jumbotron, Container, ButtonGroup, Button, Alert , Badge } from 'reactstrap';
import ModalPopup from "./ModalPopup"
import DropdownButton from "./DropdownButton"
import copy from 'copy-to-clipboard';
const platform = require('platform');

class VersionBlock extends Component {
    constructor(props) {
        super(props);
        this.copyPassedResult = this.copyPassedResult.bind(this);
        this.copyFailedResult = this.copyFailedResult.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    copyPassedResult(){
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
        copy(passComment)
    }
    copyFailedResult(){
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
        copy(failComment)
    }


    render() {
        const version = this.props.version;
        return (
            <div>
                {version ? (
                    <Jumbotron fluid>
                        <Container fluid>
                            <div>
                                {/*<span>{this.state.url}</span><DropdownButton/>*/}
                                <h6> <b>WPL Version: </b>{version.WPL_Version}</h6>
                                <h6> <b>Licensee Version: </b>{version.Licensee_Version}</h6>
                                <h6> <b>Build number: </b>{version.Build_Number}</h6>
                                <h6> <b>Build created: </b>{version.Build_Created}</h6>
                                <h6> <b>Build from branch: </b>{version.Built_From.replace('refs/heads/', '')}</h6>
                                <h6> <b>Package name: </b>{version.Package_Name}</h6>
                                <h6><b>Node: </b>{version.Node_FQDN}</h6>
                                    <ModalPopup buttoncolor="link" buttonLabel={version.WPL_Git_Log[1].split(' |')[1].trim()}>
                                        {Object.values(version.WPL_Git_Log).map((value,i) =>
                                            <p key={i}>{value}</p>
                                        )}
                                    </ModalPopup>
                                <p className="lead">
                                </p>
                                <hr className="my-2" />
                                <div>
                                    <h5>
                                        Test Result
                                    </h5>
                                    <ButtonGroup>
                                        <Button color="success" onClick={this.copyPassedResult}>Passed</Button>
                                        <Button color="danger" onClick={this.copyFailedResult}>Failed</Button>
                                        <ModalPopup buttoncolor="link" buttonLabel="Edit">
                                            123
                                        </ModalPopup>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </Container>
                    </Jumbotron>
                        ) : null
                    }
            </div>
        );
    }
}

export default VersionBlock;