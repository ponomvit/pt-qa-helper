import React from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Col, Container, Table, Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Toast from '../Toast'
const jenkinsapi = require('jenkins-api')
const jenkins = jenkinsapi.init('http://ua-portal-automation-1.ukraine.ptec/jenkins');
import PROJECTS from './data/projects'



class JenkinsDeployModal extends React.Component {
    state = {
        visible: false,
        selectedDeployOption:'',
        selectedRpmOption:'',
        building:false,
        detailedBuilds:[],
        rpmOptions:[]
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleDeploy = () => {
        let jobName = PROJECTS.projects[0].deployJob;
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
        this.buildWIthParams(jobName,deployParams)
        this.toggle()
    }

    render() {
        let {selectedRpmOption, selectedDeployOption} = this.state;

/*        let buildInprogressToast = building
            ? <Toast color="warning">{`Deploy ${id} with Package ${buildFrom} ${started} is in progress..`}</Toast>
            : <Toast color={result === 'SUCCESS' ? 'success' : 'warning'}>{`Deploy ${id} from ${buildFrom} ${started} ${result}`}</Toast>*/
        return (
            <div>
                <Button color='info' onClick={this.toggle}>Deploy</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Deploy Core RPM</ModalHeader>
                    <ModalBody>
                        {/*{buildInprogressToast}*/}
                        <Label>RPM</Label>
                        <Select
                            name="rpm-to-deploy"
                            value={selectedRpmOption}
                            onChange={this.handleRpmChange}
                            options={this.state.rpmOptions}
                            clearable={false}
                        />
                        <Label>Environment</Label>
                        <Select
                            name="target-environment"
                            value={selectedDeployOption}
                            onChange={this.handleDeployChange}
                            options={PROJECTS.projects[0].deployOptions}
                            clearable={false}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handleDeploy}>Deploy</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    componentDidMount () {
        this.getAllSuccessBuilds();
    }
    handleDeployChange = (selectedOption) => {
        this.setState({ selectedDeployOption:selectedOption },() => console.log(this.state.selectedDeployOption));
        console.log(`Selected deploy option: `,selectedOption);
    }
    handleRpmChange = (selectedOption) => {
        this.setState({ selectedRpmOption:selectedOption },() => console.log(this.state.selectedRpmOption));
        console.log(`Selected rpm option: `,selectedOption);
    }

    buildWIthParams = (job,params) => {
        jenkins.build_with_params(
            job,
            params,
            (err,data) => {
                err && console.log(err)
                console.log(data)
            }
        );
    };
    getAllSuccessBuilds = (jobName='Build-Core-RPM') => {
        jenkins.all_builds(jobName, (err, data) => {
            if (err){ return console.log(err); }
            data.map(build => {
                if (build.result === 'SUCCESS') {
                    this.getDetailedBuildInfo(build.id)
                }
            })

        })
    }
    getDetailedBuildInfo = (buildId,jobName='Build-Core-RPM') => {

        jenkins.build_info(jobName, buildId, (err, data) => {
            err && console.log(err)
            if (this.state.detailedBuilds && this.state.detailedBuilds.some((build)=> data.id === build.id)) return;
            let rpm = {
                value : data.description && data.description.split('RPM: ').pop(),
                label: data.description && `ID: ${data.id} ` + data.description.split('<br />')[0].replace('refs/heads/','')
            };
            this.setState({
                detailedBuilds: [...this.state.detailedBuilds, data],
                rpmOptions: [...this.state.rpmOptions, rpm]
            })
        });
    }
}

export default JenkinsDeployModal;