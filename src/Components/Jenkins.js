import React, {Component} from 'react'
import { Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const jenkinsapi = require('jenkins-api');
const jenkins = jenkinsapi.init('http://ua-portal-automation-1.ukraine.ptec/jenkins');
import RefreshIcon from 'react-icons/lib/md/refresh'

let gitData = {
    tags: [],
    branches: []
};

/*jenkins.all_jobs(function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});*/


/*
jenkins.all_builds('Build-Core-RPM', function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});
jenkins.all_jobs_in_view('Core RPM', function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});
*/



class Jenkins extends React.Component {
    state = {
        modal: false,
        fetching: true,
        selectedRefType: 'branches',
        selectedRef:'master',
        filteredRefs: []
    };

    getBranchesPerPage = (type) => {
        const _this = this;
        if (gitData[type].length) {
            return;
        }
        function fetchPage(type, i = 1) {
            fetch(`https://gitlab.ee.playtech.corp/api/v4/projects/70/repository/${type}?private_token=nqAnHkzxr-QDSjJsrUH9&page=${i}&per_page=100`)
                .then(response => response.json())
                .then(response => {
                    response.map(branch => {
                        gitData[type].push(branch.name)
                    })
                    response.length === 100
                        ? fetchPage(type, ++i) && _this.setState({fetching: true})
                        : _this.setState({fetching: false})

                });
        };

        fetchPage(type);
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    getLastBuildId = (jobName='Build-Core-RPM') => {

    jenkins.last_build_info(jobName, function(err, data) {
        if (err){ return console.log(err); }
        //console.log(data)

/*          //get branches from last build
            data.actions && data.actions.map(action => {
            if (action.buildsByBranchName) {
                for (let ref in action.buildsByBranchName) console.log(ref)
            }
        });
*/

        return data.id
    });
}
    buildWIthParams = () => {

        const   jobName='Build-Core-RPM',
                project='Core',
                nodeVersion='v8.9.3',
                seoCrawler='phantom2';

        const {selectedRefType, selectedRef} = this.state;
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
                VCS_REF:`refs/${selectedRefType === 'tags' ? 'tags' : 'heads'}/${selectedRef}`,
                SEO_CRAWLER:seoCrawler,
                generate_version_json:true,
                NODE_VERSION:nodeVersion
            }, (err) => err && console.log(err)
        );
    };

    handleChangeRefType = ({target}) => {
        const option = target.options[target.selectedIndex].value;

        // if (target.id === 'jankins-ref-type-select')
            this.setState({selectedRefType: option}, ()=> {console.log(option)});
            this.getBranchesPerPage(option);
            // e.target.value == 'tag' && this.getBranchesPerPage('tags');
        // }
        // if (target.id === 'jankins-ref-select') {
        //     this.setState({selectedRef: e.target.value}, ()=> {console.log(this.state.selectedRef)});
        // }
    }

    handleChangeRef = ({target}) => {
        this.setState({selectedRef: target.value}, ()=> {console.log(this.state.selectedRef)});
    }

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

    componentDidMount(){
        this.getBranchesPerPage('branches')
        this.setState({
            filteredRefs: gitData[this.state.selectedRefType]
        })
    }

    render() {

        this.getLastBuildId();
        const { filteredRefs } = this.state;
        let branchesOptions = filteredRefs.length > 0 && filteredRefs.map(branch => <option key={branch}>{branch}</option>)
        return (
            <div>
                <Button onClick={this.toggle}>Core Build</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Build Core RPM</ModalHeader>
                    <ModalBody>
                        <Label for="jankins-ref-type-select">Build From</Label>
                        <Input onChange={this.handleChangeRefType} type="select" name="select" id="jankins-ref-type-select">
                            <option value="branches">branch</option>
                            <option value="tags">tag</option>
                        </Input>
                        <Input onChange={this.filterOptions}  name="search" type="search" />
                        <Label for="jankins-ref-select">Select branch </Label>
                        <Input onChange={this.handleChangeRef} type="select" name="select" id="jankins-ref-select">
                            {!this.state.fetching ? branchesOptions : <option>Loading...</option>}
                        </Input>
                        <h5><RefreshIcon onClick={this.refreshOptions}/></h5>
{/*                        <Label for="exampleSelect">Select</Label>
                        <Input type="select" name="select" id="exampleSelect">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Input>
                        <Label for="exampleSelectMulti">Select Multiple</Label>
                        <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Input>*/}
                        <Button onClick={this.buildWIthParams}>Build</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Jenkins;


