/*global chrome*/
import React, { Component } from 'react';
import logo from './assets/icon-logo.svg';
import EnvButtons from './Components/EnvButtons'
import './App.css';
import VersionBlock from './Components/VersionBlock'
import { Container, Row, Col } from 'reactstrap';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        chrome.runtime.sendMessage({getVersion: true},(response) =>
            this.setState({
                version: response.version
            })
        );
    }

    componentWillMount() {
        this.getHeaderOptionOnStart();
        this.getVersionOnStart();
    }
    render() {
        let url = this.state.headerOptions.url ? this.state.headerOptions.url.replace(/^https?\:\/\//i, "") : "nety :(("
        let portalLogo = `${this.state.headerOptions.url}${this.state.headerOptions.logo}`;
    return (
        <Container fluid>
            <Row>
                <Col>
                    <div className="App">
                        <header className="App-header" style={{backgroundColor:this.state.headerOptions.headerColor}}>
                            {this.state.headerOptions.logo
                                ? <img height={36} src={portalLogo}/>
                                : null
                            }
                            <h5 className="App-title">{url}</h5>
                            <EnvButtons/>
                        </header>
                        <div>
                            <VersionBlock url={this.state.headerOptions.url} version={this.state.version}/>
                        </div>
                        <div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
    }
}

export default App;
