exports.projects = [
    {
        label:'Core',
        value:'Core',
        buildJob:'Build-Core-RPM',
        deployJob:'Deploy-Core-RPM',
        gitId:'70',
        path:'git@gitlab.ee.playtech.corp:wpl-core/platform-liferay-plugins-mobile.git',
        deployOptions: [
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
    },
    {
        label:'Ice',
        value:'PTHorizonProjects',
        buildJob:'Build-RPM-Ice-Projcet',
        gitId:'375',
        path:'git@gitlab.ee.playtech.corp:wpl-licensees/ICE.git'
    },
    {
        label:'Holland',
        value:'Holland',
        buildJob:'Build-RPM-Holland',
        gitId:'188',
        path:'git@gitlab.ee.playtech.corp:wpl-licensees/holland-3.0.git'
    }
]