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
            isOpened:false,
            isPortal:false,
            url:"",
            portalLogo:"",
            headerColor:"#222"
        };
        this.onMessageListener = this.onMessageListener.bind(this);
        this.sendOpenState = this.sendOpenState.bind(this)
    }

    onMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log('message - ');
            console.log(message);

            message.headerColor ? this.setState({
                    headerColor:message.headerColor,
                    portalLogo:message.portalLogo
                }) : null;

            this.setState({
                isPortal:message.isPortal,
                url:message.url,
                version:message.version
            })
        });
    }

    sendOpenState() {
        chrome.runtime.sendMessage({isOpened: true});
    }

    componentWillMount() {
        this.onMessageListener();
        this.sendOpenState();
    }
    render() {

        let portalLogo = `${this.state.url}${this.state.portalLogo}`;
    return (
        <Container fluid>
            <Row>
                <Col>
                    <div className="App">
                        <header className="App-header" style={{backgroundColor:this.state.headerColor}}>
                            {this.state.portalLogo
                                ? <img height={36} src={portalLogo}/>
                                : null
                            }
                            <h5 className="App-title">{this.state.url}</h5>
                            <EnvButtons/>
                        </header>
                        <div>
                            <VersionBlock isPortal={this.state.isPortal} url={this.state.url} version={this.state.version}/>
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
