import React from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh'
import Select from 'react-select';
import { Col, Container, Table, Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Toast from '../Toast'

class JenkinsBuildModal extends React.Component {
    state = {
        visible: false,
        building:false,
        selectedOption: {
            value:'master',
            label:'master'
        },
        selectedRefType: 'branches',
        buildOptions:[]
    };
    buildOptions = [];

    toggle = () => {
        this.setState({
            lastBuild:this.props.getLastBuild('Build-Core-RPM')
        })
        this.setState({
            modal: !this.state.modal
        })
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption:selectedOption });
        console.log(`Selected build option:`,selectedOption);
    }

    handleBuild = () => {
        const
            jobName='Build-Core-RPM',
            project='Core',
            nodeVersion='v8.9.3',
            seoCrawler='phantom2';

        const {selectedRefType, selectedOption} = this.state;
        const params = {
            branches: 'branch',
            tags: 'tag'
        }
        let coreParams = {
            PRJ_NAME:project,
            VCS_PATH:'git@gitlab.ee.playtech.corp:wpl-core/platform-liferay-plugins-mobile.git',
            VCS_REF_TYPE:params[selectedRefType],
            VCS_REF:`refs/${selectedRefType === 'tags' ? 'tags' : 'heads'}/${selectedOption.value}`,
            SEO_CRAWLER:seoCrawler,
            generate_version_json:true,
            NODE_VERSION:nodeVersion
        }

        this.props.buildWIthParams('Build-RPM-PlaytechB2C',coreParams);
        this.toggle();
    }


    parseOptions = () => {
        if (this.buildOptions.length) return;

        this.props.gitData[this.state.selectedRefType].map(branch => {
                if (branch.commit.committed_date.indexOf('2018') !== -1) {
                    let buildFrom = {
                        value:branch.name,
                        label:branch.name
                    };
                    this.buildOptions.push(buildFrom)
                }
        })
    }
    componentWillReceiveProps(nextProps){
        !nextProps.fetching && nextProps.gitData[this.state.selectedRefType] && this.parseOptions()
    }

    render() {
        const {id, building, result, from, description, started} = this.props.lastBuild;
        const {selectedOption} = this.state;
        let buildFrom = from && from.replace('refs/heads/','')
        //console.log(this.state.buildOptions)
        let buildInprogressToast = building
            ? <Toast color="warning">{`Build ${id} from ${buildFrom} ${started} is in progress..`}</Toast>
            : <Toast color={result === 'SUCCESS' ? 'success' : 'warning'}>{`Build ${id} from ${buildFrom} ${started} ${result}`}</Toast>
        return (
            <Container>
                <Button color='info' onClick={this.toggle}>Core Build</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Build Core RPM</ModalHeader>
                    <ModalBody>
                        {buildInprogressToast}
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
                        <Label>Build From</Label>
                        {!this.props.fetching
                            ? <div>
                                <Select
                                    name="form-field-name"
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={this.buildOptions}
                                    clearable={false}
                                />
                                <br/>
                                {/*<h5><RefreshIcon onClick={this.refreshOptions}/></h5>*/}
                            </div>
                            : <div>Loading.....</div>}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handleBuild}>Build</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }

/*    refreshOptions = () => {
        let {selectedRefType} = this.state;
        this.buildOptions = [];
        this.props.getBranchesPerPage(selectedRefType);
    };*/

/*    switchRefType = (e) => {
        let  refType = e.target.value;
        this.setState({
            selectedRefType: refType,
            selectedOption: null
        });
        this.props.getBranchesPerPage(refType);
    }*/
}

export default JenkinsBuildModal;




