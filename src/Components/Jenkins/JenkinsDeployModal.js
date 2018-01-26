import React from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh'
import Select from 'react-select';
import { Col, Container, Table, Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Toast from '../Toast'


class JenkinsDeployModal extends React.Component {
    state = {
        visible: false,
        selectedDeployOption:'',
        selectedRpmOption:'',
        building:false
    };

    deployOptions = [
        { value:'wpl-alpha-admin.ukraine.ptec',   label:'Alpha', env:'wpldev1-alpha2'},
        { value:'wpl-admin-beta-src.ukraine.ptec',   label:'Beta', env:'wpldev1-beta'},
        { value:'wpl-delta-admin.ukraine.ptec',   label:'Delta', env:'wpldev1-delta'},
        { value:'wpl-core3-wpl-pub-por-01.ukraine.ptec',   label:'Core-QA1', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-02.ukraine.ptec',   label:'Core-QA2', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-03.ukraine.ptec',   label:'Core-QA3', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-04.ukraine.ptec',   label:'Core-QA4', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-05.ukraine.ptec',   label:'Core-QA5', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-06.ukraine.ptec',   label:'Core-QA6', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-07.ukraine.ptec',   label:'Core-QA7', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-08.ukraine.ptec',   label:'Core-QA8', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-09.ukraine.ptec',   label:'Core-QA9', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-10.ukraine.ptec',   label:'Core-QA10', env:'wpl-core3'},
        { value:'wpl-core3-wpl-pub-por-11.ukraine.ptec',   label:'Core-QA11', env:'wpl-core3'},
        { value:'wpl-hub2-01.EE.playtech.corp',   label:'Core-1', env:'wpl-core3'},
        { value:'wpl-hub2-02.EE.playtech.corp',   label:'Core-2', env:'wpl-core3'},
        { value:'wpl-hub2-03.EE.playtech.corp',   label:'Core-3', env:'wpl-core3'},
        { value:'wpl-hub2-04.EE.playtech.corp',   label:'Core-4', env:'wpl-core3'},
        { value:'wpl-hub2-05.EE.playtech.corp',   label:'Core-5', env:'wpl-core3'},
        { value:'wpl-hub2-06.EE.playtech.corp',   label:'Core-6', env:'wpl-core3'},
        { value:'wpl-hub2-07.EE.playtech.corp',   label:'Core-7', env:'wpl-core3'},
        { value:'wpl-hub2-08.EE.playtech.corp',   label:'Core-8', env:'wpl-core3'},
        { value:'wpl-hub2-09.EE.playtech.corp',   label:'Core-9', env:'wpl-core3'},
        { value:'wpl-hub2-10.EE.playtech.corp',   label:'Core-10', env:'wpl-core3'}
    ]


    toggle = () => {
        this.props.getLastBuild('Deploy-Core-RPM');
        this.setState({
            modal: !this.state.modal
        })
    }

    handleDeploy = () => {
        let jobName = 'Deploy-Core-RPM';
        let {env,value} = this.state.selectedDeployOption;
        let rpm = this.state.selectedRpmOption.value;
        let deployParams = {
            PRJ_NAME: 'Core',
            ENV_NW: 'infra',
            TARGET_ENV: env,
            RPM_TO_INSTALL:rpm,
            TARGET_NODE:value,
            CDN_PURGE: false,
            CDN_PURGE_CPCODE:'',
            RECEPIENTS:''
        }
        this.props.deployWithParams(jobName,deployParams)
        this.toggle()
    }

    render() {
        let {selectedRpmOption, selectedDeployOption} = this.state;

        const {id, building, result, from, description, started} = this.props.lastBuild;
        let buildFrom = from && from.replace('refs/heads/','')
        let buildInprogressToast = building
            ? <Toast color="warning">{`Deploy ${id} with Package ${buildFrom} ${started} is in progress..`}</Toast>
            : <Toast color={result === 'SUCCESS' ? 'success' : 'warning'}>{`Deploy ${id} from ${buildFrom} ${started} ${result}`}</Toast>
        return (
            <Container>
                <Button color='info' onClick={this.toggle}>Deploy</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Deploy Core RPM</ModalHeader>
                    <ModalBody>
                        {buildInprogressToast}
                        <Label>RPM</Label>
                        <Select
                            name="rpm-to-deploy"
                            value={selectedRpmOption}
                            onChange={this.handleRpmChange}
                            options={this.props.rpms}
                            clearable={false}
                        />
                        <Label>Environment</Label>
                        <Select
                            name="target-environment"
                            value={selectedDeployOption}
                            onChange={this.handleDeployChange}
                            options={this.deployOptions}
                            clearable={false}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handleDeploy}>Deploy</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }

    handleDeployChange = (selectedOption) => {
        this.setState({ selectedDeployOption:selectedOption },() => console.log(this.state.selectedDeployOption));
        console.log(`Selected deploy option: `,selectedOption);
    }
    handleRpmChange = (selectedOption) => {
        this.setState({ selectedRpmOption:selectedOption },() => console.log(this.state.selectedRpmOption));
        console.log(`Selected rpm option: `,selectedOption);
    }

}

export default JenkinsDeployModal;