/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import QRCodeModal from './Components/QRcode'
import CreditCardGenerator from './Components/CreditCardGenerator'
import EnvButtons from './Components/EnvButtons'
import TestResult from './Components/TestResult'
import VersionBlock from './Components/VersionBlock'
import DevStamp from './Components/DevStamp'
import { Alert, Jumbotron, Row, Col } from 'reactstrap';
/*import JenkinsBuildModal from './Components/Jenkins/JenkinsBuildModal'
import JenkinsDeployModal from './Components/Jenkins/JenkinsDeployModal'*/

class App extends Component {

    state = {
        isAlertVisible:false,
        alertText:'Alert',
        alertColor:'success',
        headerOptions:'',
        backEndVersion:'',
        frontEndVersion:''
    };

    onMessageListener = () => {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            console.log(message)
            if (message.tabData || message.headerOptions) {
                const {tabData, headerOptions} = message;
                this.setState({
                    headerOptions,
                    tabData
                });
                this.fetchVersionJson(tabData.originUrl)
                this.fetchVersionJson(tabData.originUrl, headerOptions.theme)
            }
        })
    };

    getData = () => {
        chrome.runtime.sendMessage({getData: true},(response)=> {
            //console.log(response.data)
            console.log(response)
            let {tabData,headerOptions} = response;
            this.setState({
                tabData,
                headerOptions
            });
            this.fetchVersionJson(tabData.originUrl);
            this.fetchVersionJson(tabData.originUrl, headerOptions.theme);
        });
    };

    fetchVersionJson = (url,theme='html') => {
            let urlToFetch = url + `/${theme}/version.json?"${Date.now()}`;
            let handleErrors = (response) => {
                if (!response.ok) {
                    this.setState({
                        backEndVersion:'error',
                        frontEndVersion:'error'
                    });
                    throw Error(response.status + " " + response.statusText);
                }
                return response;
            }

            fetch(urlToFetch)
                .then(handleErrors)
                .then(response => response.json())
                .then(response => {
                    if ('WPL_Version' in response && theme === 'html') {
                        this.setState({backEndVersion:response});
                    }

                    if ('WPL_Version' in response && theme !== 'html') {
                        this.setState({frontEndVersion:response});
                        console.log(response)
                    }

                })
                .catch(error => {
                    if (theme !== 'html') {
                        this.setState({frontEndVersion:'error'})
                    }
                    console.log(error);
                    fetch(urlToFetch.replace("/html/","/"))
                        .then(handleErrors)
                        .then(data => data.json())
                        .then(response => {
                            if ('WPL_Version' in response) {
                                this.setState({backEndVersion:response});
                            }
                        })
                        .catch(console.log)
                });
    };

    handleAlert = (alertText='Alert',alertColor,t=2000) => {
        this.setState({
            isAlertVisible:true,
            alertColor:alertColor,
            alertText:alertText
        })
        this.removeToast(t)
    }

    removeToast = (t=2000) => {
        setTimeout(() => this.setState({
            isAlertVisible:false
        }),t)
    };

    componentDidMount() {
        this.onMessageListener();
        this.getData();
    }

    render() {
        let { logo , hostname , url , headerColor, theme} = this.state.headerOptions;
        let {backEndVersion , frontEndVersion, isAlertVisible, alertText, alertColor} = this.state;
        let alert = isAlertVisible && <Alert color = {alertColor} style={{marginTop:'20px',textAlign: 'center', position: 'absolute', bottom: '77px', right: '30px', zIndex:'9000'}}>{alertText}</Alert>;
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
                <Row>
                    <Col>
                        <VersionBlock url={url} frontEndVersion={frontEndVersion} backEndVersion={backEndVersion} theme={theme}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {backEndVersion && backEndVersion !== 'error' && <TestResult backEndVersion={backEndVersion} frontEndVersion={frontEndVersion} url={url} handleAlert={this.handleAlert} theme={theme}/>}
                        {/*                        <h5>Jenkins</h5>
                        <JenkinsBuildModal />
                        <JenkinsDeployModal />*/}
                    </Col>
                </Row>
            <br />
                <Row>
                    <Col xs="4">
                        <DevStamp handleAlert={this.handleAlert}/>
                    </Col>
                    <Col>
                        <CreditCardGenerator handleAlert={this.handleAlert}/>
                    </Col>
                </Row>
            <Row>
                <Col>
                    {alert}
                </Col>
            </Row>
        </div>
    );
    }
}

export default App;
