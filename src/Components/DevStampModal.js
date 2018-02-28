/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import copy from 'copy-to-clipboard';

class DevStampModal extends React.Component {

    state = {
        modal: false,
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };
    clearForm = () => {
        document.querySelector('.dev-form').reset();
        this.props.handleAlert('Form is cleared','dark');
    }

    copyToClipboard = () => {
        let form = document.querySelector('.dev-form');
        let [whatWasDoneValue,affectedAreasValue,levelOfImplementationValue,gitUrlValue,commentValue] = Array.from(form.elements).map((field)=> field.value);

        let whatWasDoneRow = whatWasDoneValue ? `| *What was done:* | ${whatWasDoneValue} | \n` : '';
        let affectedAreasRow = affectedAreasValue ? `| *Affected areas:* | ${affectedAreasValue} | \n` : '';
        let levelOfImplementationRow =  levelOfImplementationValue ? `| *Level of implementation:* | ${levelOfImplementationValue} | \n` : '';
        let gitCommitUrlRow = gitUrlValue ? `| *GitLab commit URL:* | [Commit|${gitUrlValue}] | \n` : '';
        let commentRow = commentValue ? `| *Comment:* | ${commentValue} | \n` : '';

        let devComment = `{panel:title=Fix stamp|borderColor=#828282|titleBGColor=#86BBD6|bgColor=#D7E8F0} \n${whatWasDoneRow}${affectedAreasRow}${levelOfImplementationRow}${gitCommitUrlRow}${commentRow}{panel}`;
        copy(devComment);
        this.props.handleAlert('Copied','dark');
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