import React, {Component} from 'react'
import QRCode from 'qrcode.react'

import { Button, Row, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class QRcodeModal extends React.Component {

    state = {
        modal: false,
        qrUrl: ''
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = event => {
        this.setState({
            qrUrl:event.target.value
        })
    };
    componentWillReceiveProps(nextProps){
        this.setState({
            qrUrl:nextProps.tab.url
        })
    }
    render() {
        return (
            <div>
                <Button className='float-right' color={this.props.tab.url && this.props.tab.url.indexOf('fortuna') > 1 ? 'secondary' : 'warning'} onClick={this.toggle}>QR code</Button>
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


