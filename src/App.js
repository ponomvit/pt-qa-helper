/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import logo from './assets/icon-logo.svg';
import CreditCardGenerator from './Components/CreditCardGenerator'
import EnvButtons from './Components/EnvButtons'
import TestResult from './Components/TestResult'
import VersionBlock from './Components/VersionBlock'
import DevStamp from './Components/DevStamp'
import { Jumbotron, Container, Row, Col } from 'reactstrap';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabId:'',
            headerOptions:{},
            version:""
        };
        this.onMessageListener = this.onMessageListener.bind(this);
        this.getHeaderOptionOnStart = this.getHeaderOptionOnStart.bind(this);
        this.getVersionOnStart = this.getVersionOnStart.bind(this);
        this.onMessageListener();
    }

    onMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log(message);
            message.tabId ? this.setState({
                tabId:message.tabId
                }) : null;
            if (message.header && message.header.status === "loaded") {
                this.setState({
                    headerOptions:message.header
                })
            }
            message.version && message.version !== this.state.version
                ? this.setState({
                    version:message.version
                })
                : null;
        });
    }

    getHeaderOptionOnStart() {
        chrome.runtime.sendMessage({getHeaderData:true});
    }
    getVersionOnStart() {
        chrome.runtime.sendMessage({getVersion: true});
    }

    componentWillMount() {
        this.getHeaderOptionOnStart();
        this.getVersionOnStart();
    }
    render() {
        let url = this.state.headerOptions.url ? this.state.headerOptions.url.replace(/^https?\:\/\//i, "") : "nety :(("
        let portalLogo = `${this.state.headerOptions.url}${this.state.headerOptions.logo}`;
    return (
        <div className="App">
                <Row>
                    <Col>
                        {this.state.headerOptions.logo ?
                        <header className="App-header" style={{backgroundColor:this.state.headerOptions.headerColor}}>
                            {this.state.headerOptions.logo
                                ? <img height={36} src={portalLogo}/>
                                : null
                            }
                            <div>
                                <h5 className="App-title">{url}</h5>
                                <EnvButtons tabId={this.state.tabId}/>
                            </div>
                        </header>
                            : <div>No data</div>}
                    </Col>
                </Row>
            <Jumbotron fluid>
                <Row>
                    <Col xs="8">
                        <VersionBlock url={this.state.headerOptions.url} version={this.state.version}/>
                    </Col>
                    <Col>
                        <TestResult version={this.state.version} url={this.state.headerOptions.url}/>
                    </Col>
                </Row>
            </Jumbotron>
            <hr className="my-2" />
                <Row>
                    <Col xs="4">
                        <DevStamp/>
                    </Col>
                    <Col>
                        <CreditCardGenerator/>
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
        </div>
    );
    }
}

export default App;
