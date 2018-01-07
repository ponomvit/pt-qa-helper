import React, {Component} from 'react'
import QRCode from 'qrcode.react'

import { Button, Row, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class QRcodeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            qrUrl: 'https://www.playtechone.com'
        };
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange(e) {
        this.setState({
            qrUrl:e.target.value
        })
    }

    render() {
        return (
            <div>
                <Button color="info" onClick={this.toggle}>QR code</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>QR Generator</ModalHeader>
                    <ModalBody>
                        <div align="center">
                            <QRCode size={+'256'} value={this.state.qrUrl}/>
                        </div>

                        <hr className="my-2" />
                        <Input placeholder='https://...' maxLength='2000' onChange={this.onChange} value={this.state.qrUrl}></Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default QRcodeModal;


