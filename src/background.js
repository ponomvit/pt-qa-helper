let state = {
    tabData:{
        url:'',
        originUrl:'',
        tabId:''
    },
    headerOptions:{
        hostname:'',
        url:'',
        logo:'./assets/icon-logo-header.png',
        headerColor:'rgb(36, 80, 149)'
    }
};

let headerData =    localStorage.getItem('headerOptions')
                    ? JSON.parse(localStorage.getItem('headerOptions'))
                    : [] ;

let extensionTabId;

chrome.browserAction.onClicked.addListener(function(tab) {
    checkTab(tab);
    chrome.tabs.create({
        url: chrome.extension.getURL('popup.html'),
        active: false
    }, function (tab) {
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true,
            width: 550,
            height: 750,
            top: 80,
            left: 1500
        });
        //disable app after launch
        chrome.browserAction.disable();
    });
});

chrome.tabs.onRemoved.addListener(function (tabId) {
    (extensionTabId === tabId) && chrome.browserAction.enable();
    //enable app icon if app was closed
});

chrome.tabs.onActivated.addListener(function(activeTab) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeTab.tabId, function (tab) {
        checkTab(tab);
    });
});

let updatedURL;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.selected && (changeInfo.url !== undefined)) {
        updatedURL = changeInfo.url;
    }
    if (tab.url === updatedURL && tab.status === 'complete' && updatedURL.indexOf(state.tabData.hostname) <= 0) {
        checkTab(tab);
    }
});
function sendState() {
    chrome.runtime.sendMessage({headerOptions:state.headerOptions, tabData:state.tabData});
}

function checkTab(tab) {
        if (tab.title == 'PT QA Helper') {
            extensionTabId = tab.id;
        } else if (tab.url.indexOf("http") > -1){
            let originUrl = new URL(tab.url).origin;
             let data = headerData.find(function(data) {
                return data.url === originUrl
             })
             if (data) {
             state.headerOptions = data;
             state.tabData.tabId = tab.id;
             state.tabData.url = tab.url;
             state.tabData.originUrl = originUrl;
             state.tabData.hostname = originUrl; //TODO
                 sendState();
             }
        }
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log('all messages log');
    console.log(message);
    if (message.getData) {
        response({headerOptions:state.headerOptions, tabData:state.tabData})
    }

    if (message.contentData) {
        //getVersionJson(message.tabData.originUrl);
        state.tabData.tabId = sender.tab.id;
        state.tabData.url = sender.tab.url;
        state.tabData.isPortal = message.tabData.isPortal;
        state.tabData.hostname = message.tabData.hostname;
        state.tabData.originUrl = message.tabData.originUrl;
        //state.headerOptions = message.headerData; TODO
        saveHeaderData(message.headerOptions);
        sendState();
    }

    function saveHeaderData(headerOptions) {
            let data = headerData.find(function(data) {
                return data.url === headerOptions.url
            });
            if (!data) {
                headerData.push(headerOptions);
                state.headerOptions = headerOptions;
                localStorage.setItem('headerOptions',JSON.stringify(headerData))
            }
    }
});


function getSubTasks(result) {
    var subtasksNames = result.querySelectorAll('#issuetable tr td.stsummary a');
    var issueTypes = result.querySelectorAll('#issuetable tr td.issuetype img');
    var progress = result.querySelectorAll('#issuetable tr td.progress');
    var estimate = [];
    var subtasks = [];

    for (var i=0; i<subtasksNames.length; i++) {

        if (progress[i] && progress[i].innerHTML.trim() !== "&nbsp;") {
            if(progress[i].querySelector('table.tt_graph td img').getAttribute('alt').indexOf('Original') >= 0) {
                var estimateArr = (progress[i].querySelector('table.tt_graph td img').getAttribute('alt').substring(20).split(' '));
                var convertedEstimate;
                if (!isNaN(estimateArr[0])) {
                    convertedEstimate = estimateArr[0] + estimateArr[1][0]
                } else convertedEstimate = "";
                if (estimateArr[2]) {
                    convertedEstimate = convertedEstimate + " " + estimateArr[2] + estimateArr[3][0]
                }
                if (estimateArr[4]) {
                    convertedEstimate = convertedEstimate + " " + estimateArr[4] + estimateArr[5][0]
                }
                estimate.push(convertedEstimate)
            }

        } else {
            estimate.push("")
        }
        subtasks.push({name:subtasksNames[i].text,type:issueTypes[i].getAttribute('alt'),estimate:estimate[i]});
    }
    chrome.runtime.sendMessage({from:'Jira',subtasks:subtasks});
}

