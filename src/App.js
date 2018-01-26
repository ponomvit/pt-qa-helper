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

import Jenkins from './Components/Jenkins/Jenkins'

class App extends Component {

    state = {
        headerOptions:'',
        version:''
    }

    onMessageListener = () => {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log(message)
            if (message.tabData || message.headerOptions) {
                const {tabData, headerOptions} = message;
                this.setState({
                    headerOptions,
                    tabData
                })
                this.fetchVersionJson(tabData.originUrl)
            }
        })
    }

    getData = () => {
        chrome.runtime.sendMessage({getData: true},(response)=> {
            //console.log(response.data)
            console.log(response)
            let {tabData,headerOptions} = response;
            this.setState({
                tabData,
                headerOptions
            })
            this.fetchVersionJson(tabData.originUrl)
        });
    };

    fetchVersionJson = (url) => {
            let urlToFetch = url + "/html/version.json?" + Date.now();
            let handleErrors = (response) => {
                if (!response.ok) {
                    this.setState({version:'error'});
                    throw Error(response.status + " " + response.statusText);
                }
                return response;
            }

            fetch(urlToFetch)
                .then(handleErrors)
                .then(response => response.json())
                .then(response => {
                    if ('WPL_Version' in response) {
                        this.setState({version:response});
                    }
                })
                .catch(error => {
                    console.log(error);
                    fetch(urlToFetch.replace("/html/","/"))
                        .then(handleErrors)
                        .then(data => data.json())
                        .then(response => {
                            if ('WPL_Version' in response) {
                                this.setState({version:response});
                            }
                        })
                        .catch(console.log)
                });
    };

    componentDidMount() {
        this.onMessageListener();
        this.getData();
    }



    render() {
        let { logo , hostname , url , headerColor} = this.state.headerOptions;
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
                                    <EnvButtons tab={this.state.tabData}/>
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
            <hr className="my-2" />
            <Jenkins/>
        </div>
    );
    }
}

export default App;
