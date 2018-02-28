import React from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PROJECTS from './data/projects'
const jenkinsapi = require('jenkins-api')
const jenkins = jenkinsapi.init('http://ua-portal-automation-1.ukraine.ptec/jenkins');

import { Col, Container, Table, Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Toast from '../Toast'

class JenkinsBuildModal extends React.Component {
    state = {
        gitData:{
            tags: [],
            branches: []
        },
        fetching:true,
        visible: false,
        building:false,
        selectedBuild: {},
        selectedProject:{},
        selectedRefType: 'branches',
        buildOptions:[],
        lastBuild:{}
    };
    buildOptions = [];

    toggle = () => {
        !this.state.modal && this.getLastBuildInfo(this.state.selectedProject.buildJob)
        this.setState({
            modal: !this.state.modal
        })
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedBuild:selectedOption });
        console.log(`Selected build option:`,selectedOption);
    }

    handleProjectChange = (selectedOption) => {
        this.buildOptions = [];

        this.setState({
            selectedProject:selectedOption,
            selectedBuild:{}
        });
        this.getBranchesPerPage('branches',selectedOption.gitId)
        this.getLastBuildInfo(selectedOption.buildJob)
        localStorage.setItem('selectedProject',JSON.stringify(selectedOption))
        console.log(`Selected project option:`,selectedOption);
    }

    handleBuild = () => {
        const {selectedRefType, selectedBuild, selectedProject } = this.state;
        const params = {
            branches: 'branch',
            tags: 'tag'
            },
            nodeVersion='v8.9.3',
            seoCrawler='phantom2';

        let buildParams = {
            PRJ_NAME:selectedProject.value,
            VCS_PATH:selectedProject.path,
            VCS_REF_TYPE:params[selectedRefType],
            VCS_REF:`refs/${selectedRefType === 'tags' ? 'tags' : 'heads'}/${selectedBuild.value}`,
            SEO_CRAWLER:seoCrawler,
            generate_version_json:true,
            NODE_VERSION:nodeVersion
        }

        this.buildWIthParams(selectedProject.buildJob,buildParams);
        this.toggle();
    }
    getLastBuildInfo = (jobName='Build-Core-RPM') => {
        jenkins.last_build_info(jobName, (err, data) => {
            if (err){ return console.log(err); }
            console.log('get last build info', data)
            this.setState({
                lastBuild: data
            })
        });
    }

    parseOptions = (options) => {
        console.log("parse options...",options);

        options.map(branch => {
                if (branch.commit.committed_date.indexOf('2018') !== -1) {
                    let buildFrom = {
                        value:branch.name,
                        label:branch.name
                    };
                    this.buildOptions.push(buildFrom)
                }
        })
    }

    /*componentWillReceiveProps(nextProps){
        !nextProps.fetching && nextProps.gitData[this.state.selectedRefType] && this.parseOptions()
    }*/

    componentDidMount () {
        this.setState({
            selectedProject:JSON.parse(localStorage.getItem('selectedProject'))
        },() => {
            this.getBranchesPerPage('branches',this.state.selectedProject.gitId)
        })

    }

    render() {
        //const {id, building, result, from, description, started} = this.props.lastBuild;
        const {selectedBuild,selectedProject,lastBuild} = this.state;
        const {id, building, description, duration, estimatedDuration, result, url} = lastBuild

        let buildToast = building
            ? <Toast color="warning">{`Build ${id} is in progress.. estimate: ${this.millisToMinutesAndSeconds(estimatedDuration)}`}<br/> <a href={url} target='_blank'>Link to build</a></Toast>
            : <Toast color={result === 'SUCCESS' ? 'success' : 'warning'}>{`Build ${id} from ${description && description.split('<br />')[0].replace('refs/heads/','')} ${result} duration: ${this.millisToMinutesAndSeconds(duration)}`}<br/> <a href={url} target='_blank'>Link to build</a></Toast>

       // let buildFrom = from && from.replace('refs/heads/','')
        //console.log(this.state.buildOptions)

/*        let buildInprogressToast = building && buildFrom
            ? <Toast color="warning">{`Build ${id} from ${buildFrom} ${started} is in progress..`}</Toast>
            : <Toast color={result === 'SUCCESS' ? 'success' : 'warning'}>{`Build ${id} from ${buildFrom} ${started} ${result}`}</Toast>*/
        return (
            <div>
                <Button color='info' onClick={this.toggle}>Build</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Build Core RPM</ModalHeader>
                    <ModalBody>
                        {/*{buildInprogressToast}*/}
                        {/*<hr className="my-2" />
                        <div className="checkbox-list">
                            <label className="checkbox">
                                <input type="radio" className="checkbox-control" checked={this.state.selectedRefType === 'branches'} value="branches" onChange={this.switchRefType}/>
                                <span className="checkbox-label">Branches</span>
                            </label>
                            <br/>
                            <label className="checkbox">
                                <input type="radio" className="checkbox-control" checked={this.state.selectedRefType === 'tags'} value="tags" onChange={this.switchRefType}/>
                                <span className="checkbox-label">Tags</span>
                            </label>
                        </div>*/}
                        <label>Project</label>
                        <Select
                            name="projectSelect"
                            value={selectedProject}
                            onChange={this.handleProjectChange}
                            options={PROJECTS.projects}
                            clearable={false}
                        />
                        <Label>Build From</Label>
                        {!this.state.fetching
                            ? <div>


                                <Select
                                    name="buildSelect"
                                    value={selectedBuild}
                                    onChange={this.handleChange}
                                    options={this.buildOptions}
                                    clearable={false}
                                />
                                <br/>
                                <h5><RefreshIcon onClick={this.refreshOptions}/></h5>
                            </div>
                            : <div>Loading.....</div>}
                        {buildToast}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handleBuild}>Build</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    refreshOptions = () => {
        this.buildOptions = [];
        this.getBranchesPerPage('branches', this.state.selectedProject.gitId);
    };

/*    switchRefType = (e) => {
        let  refType = e.target.value;
        this.setState({
            selectedRefType: refType,
            selectedOption: null
        });
        this.props.getBranchesPerPage(refType);
    }*/

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

    getBranchesPerPage = (type,projectId='70') => {

        console.log('fetching', type , projectId)

        let fetchPage = (type='branches', i = 1) => {
            fetch(`https://gitlab.ee.playtech.corp/api/v4/projects/${projectId}/repository/${type}?private_token=nqAnHkzxr-QDSjJsrUH9&page=${i}&per_page=100`)
                .then(response => response.json())
                .then(response => {this.parseOptions(response);
                    if (response.length === 100) {
                        this.setState({fetching: true})
                        fetchPage(type, ++i)
                    } else this.setState({fetching: false})
                });
        }
        fetchPage(type);
    };

    millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
}

export default JenkinsBuildModal;


