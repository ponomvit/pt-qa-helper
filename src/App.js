/*global chrome*/
import React, { Component } from 'react';
import logo from './assets/icon-logo.svg';
import './App.css';
import VersionBlock from './Components/VersionBlock'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpened:false
        }
    }

    componentWillMount() {
        console.log('did mount');
        this.setState({
            isOpened:true
        });
    }
    componentDidMount(){
        chrome.runtime.sendMessage({isOpened: this.state.isOpened});
    }
    render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
            <VersionBlock/>
        </div>
      </div>
    );
    }
}

export default App;
