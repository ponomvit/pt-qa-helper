let currentTab;
let extensionTabId;
let jiraResponse;

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('opened');
    console.log(tab);
    currentTab = tab;
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
    (extensionTabId === tabId) ? chrome.browserAction.enable() : null;
    //enable app icon if app was closed
});

chrome.tabs.onActivated.addListener(function(activeTab) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeTab.tabId, function(tab){
        changeTab(tab);
        //jiraRequest(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.selected && changeInfo.url) {
        changeTab(tab);
        //jiraRequest(tab);
    }
});

function changeTab(updatedTab) {
    if (updatedTab.url.indexOf('chrome-extension://') >= 0) {
        extensionTabId = updatedTab.id;
    } else {
        currentTab = updatedTab;
        getData(updatedTab);
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log(message);
    if (message.isOpened) {
        getData(currentTab);
    }

    if (message.fastLoad) {
        chrome.tabs.update(currentTab.id,{url:currentTab.url + "?js_fast_load"});
    }

    if (message.showKeys) {
        chrome.tabs.update(currentTab.id,{url:currentTab.url + "?showTranslationKeys=1"});
    }
});

function getData(tab) {
    let url = new URL(tab.url);
    let urlToFetch = url.origin + "/html/version.json?" + Date.now();

//
    getPortalLogoAndBackground(tab);
//
    function handleErrors(response) {
        if (!response.ok) {
            chrome.runtime.sendMessage({isPortal:false,url:url.origin,version:null});
            throw Error(response.status + " " + response.statusText);
        }
        return response;
    }

    fetch(urlToFetch)
        .then(handleErrors)
        .then(response => response.json())
        .then(response => response.WPL_Version ? chrome.runtime.sendMessage({isPortal:true,url:url.origin,version:response}) : chrome.runtime.sendMessage({isPortal:false}))
        .catch(error => {
            console.log(error);
            fetch(urlToFetch.replace("/html/","/"))
                .then(handleErrors)
                .then(data => data.json())
                .then(data => data.WPL_Version ? chrome.runtime.sendMessage({isPortal:true,url:url.origin,version:data}) : chrome.runtime.sendMessage({isPortal:false}))
                .catch(console.log)
        });

    //jiraRequest(currentTab)
}


/*function jiraRequest(tab) {
    if (tab.url.indexOf("portal-jira.playtech") >= 0) {
        let jiraUrl = tab.url;
        console.log("JIRA woo");

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                jiraResponse = this.responseXML;
                if (jiraResponse.querySelector('#issuetable')) {
                    getSubTasks(jiraResponse);
                }
                if (jiraResponse.querySelector('.issueaction-create-subtask')) {
                    chrome.runtime.sendMessage({createSubTaskButton:true});
                } else {
                    chrome.runtime.sendMessage({createSubTaskButton:false});
                }
            }
        };
        xhr.responseType = "document";
        xhr.open("GET",jiraUrl + "?" + Date.now(), true);
        xhr.send();
    }
}*/

function getPortalLogoAndBackground(tab) {
    chrome.tabs.executeScript(tab.id, {code:` 
    console.log('executing script')
    HTMLDocument.prototype.ready = function () {
	return new Promise(function(resolve, reject) {
		if (document.readyState === 'complete') {
			resolve(document);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
			resolve(document);
		});
					}
	});
}
    document.ready().then(() => {console.log('dom loaded');
    logoElem = document.querySelector('.main-header__logo');
     function getLogo() {
     let logoElem = document.querySelector('.main-header__logo');
     if (logoElem) {
     return logoElem.getAttribute('src');
     } else {
     return null}  
     } 
     
     function getHeaderColor () { 
    let mainHeader = document.querySelector('.main-header__common');

    if (mainHeader) {
    return window.getComputedStyle(mainHeader, null).getPropertyValue("background-color")
    } else {
     return "#222"
    }
}
      logo = getLogo()
      headerColor = getHeaderColor()
      
      chrome.runtime.sendMessage({ url:window.location.origin,portalLogo: logo,headerColor:headerColor });
      });
`})
}

function getDOM (url) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseXML
        }
    };
    xhr.responseType = "document";
    xhr.open("GET",url + "?" + Date.now(), true);
    xhr.send();
}

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