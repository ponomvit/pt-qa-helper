/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import Toast from './Toast'
import { Form, FormGroup, Label, Input, FormText, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import copy from 'copy-to-clipboard';

class DevStampModal extends React.Component {

    state = {
        modal: false,
        isAlertVisible: false,
        alertColor:'dark',
        alertMessage:''
    };

    removeToast = (t=2000) => {
        setTimeout(() => this.setState({
            isAlertVisible:false
        }),t)
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            isAlertVisible: false
        });
    };
    clearForm = () => {
        document.querySelector('.dev-form').reset();
        this.setState({
            alertMessage:'Form is cleared',
            isAlertVisible:true
        });
        this.removeToast()
    }

    copyToClipboard = () => {
        let form = document.querySelector('.dev-form');
        let [whatWasDoneValue,affectedAreasValue,levelOfImplementationValue,gitUrlValue,commentValue] = Array.from(form.elements).map((field)=> field.value);

        let whatWasDoneRow = whatWasDoneValue ? `| *What was done: * | ${whatWasDoneValue} |` : '';
        let affectedAreasRow = affectedAreasValue ? `| *Affected areas: * | ${affectedAreasValue} |` : '';
        let levelOfImplementationRow =  levelOfImplementationValue ? `| *Level of implementation: * | ${levelOfImplementationValue} |` : '';
        let gitCommitUrlRow = gitUrlValue ? `| *GitLab commit URL: * | [Commit|${gitUrlValue}] |` : '';
        let commentRow = commentValue ? `| *Comment: * | ${commentValue} |` : '';

        let devComment =
                        `{panel:title=Fix stamp|borderColor=#828282|titleBGColor=#86BBD6|bgColor=#D7E8F0}
                        ${whatWasDoneRow}
                        ${affectedAreasRow}
                        ${levelOfImplementationRow}
                        ${gitCommitUrlRow}
                        ${commentRow}
                        {panel}`;
        copy(devComment);
        this.setState({
            isAlertVisible:true,
            alertMessage:'Copied.'
        });
        this.removeToast()
    };

    render() {
        return (
            <div>
                <Button color="info" onClick={this.toggle}>Dev Fix Stamp</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Fix stamp</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.submit} className="dev-form">
                            <FormGroup>
                                <Label for="what-was-done">What was done: </Label>
                                <Input type="textarea" name="text" id="dev-what-was-done" placeholder="What was done (optional)"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="affected-areast">Affected areas: </Label>
                                <Input type="textarea" name="text" id="dev-affected-areas" placeholder="Affected areas (optional)"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="dev-impl-level">Level of implementation: </Label>
                                <Input type="select" name="select" id="dev-impl-level">
                                    <option>Code</option>
                                    <option>CMS</option>
                                    <option>Custom JS</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="dev-git-url">GitLab branch name/commit URL: </Label>
                                <Input type="url" name="url" id="dev-git-url" placeholder="https://..." />
                            </FormGroup>
                            <FormGroup>
                                <Label for="dev-comment">Comment: </Label>
                                <Input type="textarea" name="text" id="dev-comment" placeholder="Comment (optional)"/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Toast visible={this.state.isAlertVisible} color={this.state.alertColor}>{this.state.alertMessage}</Toast>
                        <Button color="info" onClick={this.clearForm}>Clear</Button>{' '}
                        <Button color="info" type="submit" onClick={this.copyToClipboard}>Copy</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Back</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default DevStampModal;