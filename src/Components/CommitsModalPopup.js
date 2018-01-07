/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';

class CommitsModalPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <h6><b>Last Commit hash: </b>
                <a onClick={this.toggle}><u>{this.props.commits[1].split(' |')[1].trim().substring(0,8)}</u></a>
                </h6>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Commits</ModalHeader>
                    <ModalBody className="commits-modal-body">
                        <Table>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Commit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.values(this.props.commits).map((value,i) => {
                                const regExp = /\[(.*?)\]/g;
                                const splitedValue = value.split('|');
                                const [date, hash, commitName] = splitedValue;
                                const [weekday, month, day, time, year] = date.split(' ');
                                const username = commitName.match(regExp).pop();
                                const comment = commitName.replace(username,'');
                                return (
                            <tr key={i}>
                                <td>{`${day}\u00A0${month}\u00A0${year.substring(2,4)} ${time}`}</td>
                                <td>{comment}
                                    <br/>
                                    <Badge color='info' pill>@{username.replace(/\[|\]/g,'')}</Badge>
                                    <Badge color='dark' pill>{` #${hash.substring(1,9)}`}</Badge>
                                </td>
                            </tr>
                                )
                            })}
                            </tbody>
                        </Table>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Back</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default CommitsModalPopup;