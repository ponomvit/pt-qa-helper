/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import QRCodeModal from './Components/QRcode'
import CreditCardGenerator from './Components/CreditCardGenerator'
import EnvButtons from './Components/EnvButtons'
import TestResult from './Components/TestResult'
import VersionBlock from './Components/VersionBlock'
import DevStamp from './Components/DevStamp'
import { Jumbotron, Container, Row, Col } from 'reactstrap';

class App extends Component {

    state = {
        tabData:{},
        headerOptions:{
            headerColor:"rgb(36, 80, 149)",
            logo : './assets/icon-logo-header.png',
            status : "",
            url : ""
        },
        version:""
    };

    onMessageListener = () => {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log(message);
/*            message.tabData ? this.setState({
                tabData:message.tabData
                }) : null;
            if (message.header) {
                this.setState({
                    headerOptions:message.header
                })
            }*/
            if (message.data && message.data) {
                this.setState({
                    tabData:message.data.tabData,
                    headerOptions:message.data.headerOptions,
                    version:message.data.version
                })
            }

            message.version && message.version !== this.state.version
                ? this.setState({
                    version:message.version
                })
                : null;
        });
    };


    getData = () => {
        chrome.runtime.sendMessage({getData: true},(response)=> {
            //console.log(response.data)
            let state = response.data;
            this.setState({
                tabData:state.tabData,
                headerOptions:state.headerOptions,
                version:state.version
            })
        });
    };

    componentDidMount() {
        this.onMessageListener();
        this.getData();
    }
    render() {
        let { logo , hostname , url , headerColor, buttonColor, buttonTextColor} = this.state.headerOptions;
        let version = this.state.version;
    return (
        <div className="App">
                <Row>
                    <Col>
                        {logo ?
                        <header className="App-header" style={{backgroundColor:headerColor}}>
                            {logo
                                ? <img height={36} src={logo}/>
                                : null
                            }
                            <QRCodeModal tab={this.state.tabData}/>
                            <div>
                                <h5 className="App-title">{hostname}</h5>
                            </div>
                                <div>
                                    <EnvButtons tab={this.state.tabData} buttonColor={buttonColor} buttonTextColor={buttonTextColor}/>
                                </div>
                        </header>
                            : <div>No data</div>}
                    </Col>
                </Row>
            <Jumbotron fluid>
                <Row>
                    <Col xs="8">
                        <VersionBlock url={url} version={version}/>
                    </Col>
                    <Col>
                        <TestResult version={version} url={url}/>
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
