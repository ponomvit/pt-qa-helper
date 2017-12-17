/*global chrome*/
import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap';

class EnvButtons extends Component {
    constructor(props) {
        super(props);
        this.showTranslationKeys = this.showTranslationKeys.bind(this);
        this.enableJsFastLoad = this.enableJsFastLoad.bind(this);
    }

    showTranslationKeys() {
        chrome.runtime.sendMessage({showKeys: true});
    }

    enableJsFastLoad() {
        chrome.runtime.sendMessage({fastLoad: true});
    }


    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button outline color="secondary" onClick={this.showTranslationKeys}>Translation Keys</Button>{' '}
                    <Button outline color="success" onClick={this.enableJsFastLoad}>Fast Load</Button>{' '}
                </ButtonGroup>
            </div>
        );
    }
}

export default EnvButtons;