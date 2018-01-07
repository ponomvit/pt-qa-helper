let state = {
    from:'ptqa-background',
    isPortal: null,
    version:''
};
let headerData = [];
let portalTab;
let extensionTabId;
let jiraResponse;


chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('opened');
    console.log(tab);
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
    (extensionTabId === tabId) ? chrome.browserAction.enable() : null;
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
    if (tab.url === updatedURL && tab.status === 'complete') {
        checkTab(tab);
    }
});

function checkTab(tab) {
        if (tab.url.indexOf('chrome-extension://') > -1) {
            extensionTabId = tab.id;
        } else if (tab.url.indexOf("http") > -1){
            detectPortal(tab);
        }
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log('all messages log');
    console.log(message);

    message.getHeaderData ? getHeaderData(portalTab) : null;
    message.getVersion ? getVersionJson(portalTab) : null;

    if (message.status === "loaded") {
        console.log('received msg from client logo , bg , url etc...');

        console.log(message);
        headerData.push(message);
        chrome.runtime.sendMessage({header:message, tabId:portalTab.id})
    }

    message.fastLoad
        ? chrome.tabs.update(portalTab.id,{url:portalTab.url + "?js_fast_load"})
        : null;

    message.showKeys
        ? chrome.tabs.update(portalTab.id,{url:portalTab.url + "?showTranslationKeys=1"})
        : null;
});

function getVersionJson(tab) {
    let url = new URL(tab.url);
    let urlToFetch = url.origin + "/html/version.json?" + Date.now();

    function handleErrors(response) {
        if (!response.ok) {
            chrome.runtime.sendMessage({version:'error'});
            throw Error(response.status + " " + response.statusText);
        }
        return response;
    }

    fetch(urlToFetch)
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
            if (response.WPL_Version) {
                state.version = response;
                chrome.runtime.sendMessage({version:state.version})
            }
        })
        .catch(error => {
            console.log(error);
            fetch(urlToFetch.replace("/html/","/"))
                .then(handleErrors)
                .then(data => data.json())
                .then(response => {
                    if (response.WPL_Version) {
                        state.version = response;
                        chrome.runtime.sendMessage({version:state.version})
                    }
                })
                .catch(console.log)
        });
}

function getPortalLogoAndBackground(tab) {
    chrome.tabs.executeScript(tab.id, {code:` var callback = function(){
  // Handler when the DOM is fully loaded
     console.log('dom loaded');
     function getLogo() {
        let logoElem = document.querySelector('.main-header__logo') || document.querySelector('.main-logo__img')
        if (logoElem && logoElem.getAttribute('src')) {
        return logoElem.getAttribute('src');
        } else if (logoElem) {
        return logoElem.style.backgroundImage.slice(4, -1).replace(/"/g, "");;
        } 
        else {
        console.log(logoElem)
        return null
        }  
        } 
     
     function getHeaderColor () { 
    let mainHeader = document.querySelector('.navigation-container');

    if (mainHeader) {
    return window.getComputedStyle(mainHeader, null).getPropertyValue("background-color")
    } else {
     return null
    }
}
      logo = getLogo()
      headerColor = getHeaderColor()
      if (headerColor || logo) {
      chrome.runtime.sendMessage({ status:"loaded",url:window.location.origin,logo: logo,headerColor:headerColor });
      }
}
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}   
`})
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

function detectPortal(tab) {
    chrome.tabs.executeScript(tab.id, {code:`
    function checkIfPortal () {
        var scripts = document.querySelectorAll('head script');
        var isPortal = false;
        for (script of scripts) {
            if (script.innerHTML.indexOf('Playtech') > -1) {
                isPortal = true;
                break;
            }
        }
        return isPortal;
    }
    checkIfPortal();                                        
`},function (isPortal) {
        if (isPortal && isPortal[0]) {
            chrome.runtime.sendMessage({tabId:tab.id});
            portalTab = tab;
            getHeaderData(tab);
            getVersionJson(tab);
        }
    });
}


function getHeaderData(tab) {
    let tabOriginUrl = new URL(tab.url).origin;
    let data = headerData.find(function (data) {
        return data.url === tabOriginUrl
    });

    data
        ? chrome.runtime.sendMessage({header:data, tabId: tab.id})
        : getPortalLogoAndBackground(tab)
}