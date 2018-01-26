import React, {Component} from 'react'
import { Col, Row, Button, Label , Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const jenkinsapi = require('jenkins-api');
const jenkins = jenkinsapi.init('http://ua-portal-automation-1.ukraine.ptec/jenkins');

import 'react-select/dist/react-select.css';
import JenkinsBuildModal from "./JenkinsBuildModal"
import JenkinsDeployModal from "./JenkinsDeployModal";
import Toast from "../Toast";


let gitData = {
    tags: [],
    branches: []
};


jenkins.all_jobs(function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});


class Jenkins extends React.Component {
    state = {
        rpmOptions:[],
        lastBuild:{},
        builds:[],
        detailedBuilds:[],
        fetching:true
    };

    getBranchesPerPage = (type) => {
        let fetchPage = (type='branches', i = 1) => {
            fetch(`https://gitlab.ee.playtech.corp/api/v4/projects/70/repository/${type}?private_token=nqAnHkzxr-QDSjJsrUH9&page=${i}&per_page=100`)
                .then(response => response.json())
                .then(response => {
                    gitData[type].push(...response);
                    response.length === 100
                        ? fetchPage(type, ++i) && this.setState({fetching: true})
                        : this.setState({fetching: false})
                });
        }
        fetchPage(type);
    };


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


    getInProgressBuildID = () => {
        if (this.state.inProgressBuildId) return;
        else {
            setTimeout(()=> {
                jenkins.all_builds('Build-Core-RPM', (err, data) => {
                    if (err){ return console.log(err); }
                    data.map(build => {
                        if (build.result === null) {
                            console.log('in progress build ID' ,build.id)
                            this.setState({inProgressBuildId:build.id});
                            //this.checkBuildStatus(build.id)
                        }
                    })
                })
            },2000)
        }
    }


/*    checkBuildStatus = (buildId) => {
        let interval = () => setInterval(()=> {
            jenkins.build_info('Build-Core-RPM', buildId, (err, data) => {
                if (err){ return console.log(err); }
                if (data.result) {
                    clearInterval(interval)
                    this.setState({
                        buildStatus:{
                            id:data.id,
                            name:data.fullDisplayName,
                            result:data.result
                        }

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
    }*/






    render() {
/*        let {id, building, from , description ,result, started} = this.state.lastBuild;
        */
        return (
            <Row>
                <Col xs="4">
                    <JenkinsBuildModal lastBuild={this.state.lastBuild} getLastBuild={this.getLastBuildInfo} buildWIthParams={this.buildWIthParams} fetching={this.state.fetching} getBranchesPerPage={this.getBranchesPerPage} gitData={gitData}/>
                </Col>
                <Col>
                    <JenkinsDeployModal lastBuild={this.state.lastBuild} getLastBuild={this.getLastBuildInfo} deployWithParams={this.buildWIthParams} rpms={this.state.rpmOptions}/>
                </Col>
            </Row>
        );
    }

    componentDidMount(){
        this.getAllBuilds();
        this.getBranchesPerPage('branches')
    }

    getAllBuilds = (jobName='Build-Core-RPM') => {
        jenkins.all_builds(jobName, (err, data) => {
            if (err){ return console.log(err); }
            console.log(data)
            this.setState({
                builds: data
            },() => {
                this.getBuildsDetailedInfo();
            })

        })
    }


    getDetailedBuildInfo = (buildId) => {
        jenkins.build_info('Build-Core-RPM', buildId, (err, data) => {
            if (err){ return console.log(err); }
                if (data.result === "SUCCESS") {
                let rpm = {
                    value : data.description && data.description.split('RPM: ').pop(),
                    label: data.description && `ID: ${data.id} ` + data.description.split('<br />')[0].replace('refs/heads/','')
                };
                this.setState({
                    detailedBuilds: [...this.state.detailedBuilds, data],
                    rpmOptions: [...this.state.rpmOptions, rpm]
                })
            }
        });
    }

    getBuildsDetailedInfo = () => {
        this.state.builds.map(build => {
            this.getDetailedBuildInfo(build.id)
        })
    }

    millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    getLastBuildInfo = (jobName='Build-Core-RPM') => {
        jenkins.last_build_info(jobName, (err, data) => {
            if (err){ return console.log(err); }
            console.log('get last build info', data)
                this.setState({
                    lastBuild: {
                        id: data.number,
                        building: data.building,
                        from: data.actions[0].parameters[3].value,
                        description: data.description,
                        result: data.result,
                        started: data.actions[1].causes[0].shortDescription
                    }
                })
        });
    }
}


export default Jenkins;


