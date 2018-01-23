import React, {Component} from 'react'
import { Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const jenkinsapi = require('jenkins-api');
const jenkins = jenkinsapi.init('http://ua-portal-automation-1.ukraine.ptec/jenkins');
import RefreshIcon from 'react-icons/lib/md/refresh'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

let gitData = {
    tags: [],
    branches: []
};

/*jenkins.all_jobs(function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});*/


/*jenkins.build_info('Build-Core-RPM', '2750', function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});*/
/*jenkins.build_info('Build-Core-RPM', 2754, (err, data) => {
    if (err){ return console.log(err); }
    console.log(data)
});*/

class Jenkins extends React.Component {
    state = {
        selectedOption: 'master',
        selectedRefType: 'branches',
        modal: false,
        fetching: true,
        filteredRefs: [],
        inProgressBuildId:'',
        buildStatus: {
            id:'',
            name:'',
            result:''
        }
    };

    handleChange = (selectedOption) => {
        this.setState({ selectedOption:selectedOption.value });
        console.log(`Selected: ${selectedOption.value}`);
    }

    getBranchesPerPage = (type) => {
        if (gitData[type].length) {
            return;
        }
        let fetchPage = (type, i = 1) => {
            fetch(`https://gitlab.ee.playtech.corp/api/v4/projects/70/repository/${type}?private_token=nqAnHkzxr-QDSjJsrUH9&page=${i}&per_page=100`)
                .then(response => response.json())
                .then(response => {
                    response.map(branch => {
                        branch.commit.committed_date.split('-')[0] >= 2017 && gitData[type].push({value:branch.name, label:branch.name})
                    })
                    response.length === 100
                        ? fetchPage(type, ++i) && this.setState({fetching: true})
                        : this.setState({fetching: false})

                });
        }

        fetchPage(type);
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

/*    getLastBuild = (jobName='Build-Core-RPM') => {

    jenkins.last_build_info(jobName, function(err, data) {
        if (err){ return console.log(err); }
        //console.log(data)

/!*          //get branches from last build
            data.actions && data.actions.map(action => {
            if (action.buildsByBranchName) {
                for (let ref in action.buildsByBranchName) console.log(ref)
            }
        });
*!/

        return data.id
    });
}*/
    buildWIthParams = () => {

        const   jobName='Build-Core-RPM',
                project='Core',
                nodeVersion='v8.9.3',
                seoCrawler='phantom2';

        const {selectedRefType, selectedOption} = this.state;
        const params = {
            branches: 'branch',
            tags: 'tag'
        }

        jenkins.build_with_params(
            jobName,
            {
                PRJ_NAME:project,
                VCS_PATH:'git@gitlab.ee.playtech.corp:wpl-core/platform-liferay-plugins-mobile.git',
                VCS_REF_TYPE:params[selectedRefType],
                VCS_REF:`refs/${selectedRefType === 'tags' ? 'tags' : 'heads'}/${selectedOption}`,
                SEO_CRAWLER:seoCrawler,
                generate_version_json:true,
                NODE_VERSION:nodeVersion
            }, (err) => err && console.log(err)
        );
        this.toggle();
    };


    refreshOptions = () => {
        let {selectedRefType} = this.state;
        gitData[selectedRefType] = [];
        this.getBranchesPerPage(selectedRefType);
        this.setState({
            fetching: true
        })
    };

    filterOptions = ({target}) => {
        this.setState({
            filteredRefs: gitData[this.state.selectedRefType].filter((item)=>{
                return item.search(target.value) !== -1;
            })
            }
        );
    };


    switchRefType = (e) => {
        let  refType = e.target.value;
        this.setState({
            selectedRefType: refType,
            selectedOption: null
        });
        this.getBranchesPerPage(refType);
    }

    getInProgressBuildID = () => {
        if (this.state.inProgressBuildId) return;

        setTimeout(()=> {
            jenkins.all_builds('Build-Core-RPM', (err, data) => {
                if (err){ return console.log(err); }
                data.map(build => {
                    if (build.result === null) {
                        console.log('in progress build ID' ,build.id)
                        this.setState({inProgressBuildId:build.id});
                        this.checkBuildStatus(build.id)
                    }
                })
            })
        },2000)
    }

    checkBuildStatus = (buildId) => {
        const interval = setInterval(()=>{
            jenkins.build_info('Build-Core-RPM', buildId, (err, data) => {
                if (err){ return console.log(err); }
                if (data.result) {
                    clearInterval(interval)
                    this.setState({
                        buildStatus:{
                            id:data.id,
                            name:data.fullDisplayName,
                            result:data.result
                        },
                        inProgressBuildId:''

                    })
                } else
                this.setState({
                    buildStatus:{
                        name:data.fullDisplayName,
                        status:data.result}
                })
                console.log(data)
            });
        },5000)

        interval();
    }


    render() {
        const { selectedOption, selectedRefType,inProgressBuildId, buildStatus } = this.state;
        let buildResult = buildStatus.result ? buildStatus.result : 'in progress';
        let buildState = buildStatus.id && `Build ${buildStatus.id} ${buildResult}`;
        let inProgress = inProgressBuildId && `Build ${inProgressBuildId} ${buildResult}`;

        return (
            <div>
                <Button onClick={this.toggle}>Core Build</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Build Core RPM</ModalHeader>
                    <ModalBody>
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
                        </div>
                        <Label for="jankins-ref-type-select">Build From</Label>
                        {!this.state.fetching
                            ? <div>
                                <Select
                                    name="form-field-name"
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={gitData[selectedRefType]}
                                   />
                                <h5><RefreshIcon onClick={this.refreshOptions}/></h5>
                                <Button onClick={this.buildWIthParams}>Build</Button>
                             </div>
                            : <div>Loading.....</div>}
                            <div>{inProgressBuildId ? inProgress : buildState}</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    componentDidMount(){
        this.getBranchesPerPage('branches')
        this.setState({
            filteredRefs: gitData[this.state.selectedRefType]
        })
    }
    componentWillUpdate() {
        //console.log('---','will be updated')
        this.getInProgressBuildID();
    }
}


export default Jenkins;


