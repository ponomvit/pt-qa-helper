/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 56);
/******/ })
/************************************************************************/
/******/ ({

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var state = {
    from: 'ptqa-background',
    isPortal: null,
    version: ''
};
var headerData = [];
var portalTab = void 0;
var extensionTabId = void 0;
var jiraResponse = void 0;

chrome.browserAction.onClicked.addListener(function (tab) {
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
    extensionTabId === tabId ? chrome.browserAction.enable() : null;
    //enable app icon if app was closed
});

chrome.tabs.onActivated.addListener(function (activeTab) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeTab.tabId, function (tab) {
        checkTab(tab);
    });
});

var updatedURL = void 0;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.selected && changeInfo.url !== undefined) {
        updatedURL = changeInfo.url;
    }
    if (tab.url === updatedURL && tab.status === 'complete') {
        checkTab(tab);
    }
});

function checkTab(tab) {
    if (tab.url.indexOf('chrome-extension://') > -1) {
        extensionTabId = tab.id;
    } else if (tab.url.indexOf("http") > -1) {
        detectPortal(tab);
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log('all messages log');
    console.log(message);

    message.getHeaderData ? checkTab(portalTab) : null;
    message.getVersion ? response({ version: state.version }) : null;

    if (message.status === "loaded") {
        console.log('received msg from client logo , bg , url etc...');
        console.log(message);
        headerData.push(message);
        chrome.runtime.sendMessage({ header: message });
    }

    message.fastLoad ? chrome.tabs.update(portalTab.id, { url: portalTab.url + "?js_fast_load" }) : null;

    message.showKeys ? chrome.tabs.update(portalTab.id, { url: portalTab.url + "?showTranslationKeys=1" }) : null;
});

function getVersionJson(tab) {
    var url = new URL(tab.url);
    var urlToFetch = url.origin + "/html/version.json?" + Date.now();

    function handleErrors(response) {
        if (!response.ok) {
            chrome.runtime.sendMessage({ version: null });
            throw Error(response.status + " " + response.statusText);
        }
        return response;
    }

    fetch(urlToFetch).then(handleErrors).then(function (response) {
        return response.json();
    }).then(function (response) {
        if (response.WPL_Version) {
            state.version = response;
            chrome.runtime.sendMessage({ version: state.version });
        }
    }).catch(function (error) {
        console.log(error);
        fetch(urlToFetch.replace("/html/", "/")).then(handleErrors).then(function (data) {
            return data.json();
        }).then(function (response) {
            if (response.WPL_Version) {
                state.version = response;
                chrome.runtime.sendMessage({ version: state.version });
            }
        }).catch(console.log);
    });
}

function getPortalLogoAndBackground(tab) {
    chrome.tabs.executeScript(tab.id, { code: ' var callback = function(){\n  // Handler when the DOM is fully loaded\n     console.log(\'dom loaded\');\n     function getLogo() {\n        let logoElem = document.querySelector(\'.main-header__logo\') || document.querySelector(\'.main-logo__img\')\n        if (logoElem && logoElem.getAttribute(\'src\')) {\n        return logoElem.getAttribute(\'src\');\n        } else if (logoElem) {\n        return logoElem.style.backgroundImage.slice(4, -1).replace(/"/g, "");;\n        } \n        else {\n        console.log(logoElem)\n        return null\n        }  \n        } \n     \n     function getHeaderColor () { \n    let mainHeader = document.querySelector(\'.navigation-container\');\n\n    if (mainHeader) {\n    return window.getComputedStyle(mainHeader, null).getPropertyValue("background-color")\n    } else {\n     return null\n    }\n}\n      logo = getLogo()\n      headerColor = getHeaderColor()\n      if (headerColor || logo) {\n      chrome.runtime.sendMessage({ status:"loaded",url:window.location.origin,logo: logo,headerColor:headerColor });\n      }\n}\nif (\n    document.readyState === "complete" ||\n    (document.readyState !== "loading" && !document.documentElement.doScroll)\n) {\n  callback();\n} else {\n  document.addEventListener("DOMContentLoaded", callback);\n}   \n' });
}

function getSubTasks(result) {
    var subtasksNames = result.querySelectorAll('#issuetable tr td.stsummary a');
    var issueTypes = result.querySelectorAll('#issuetable tr td.issuetype img');
    var progress = result.querySelectorAll('#issuetable tr td.progress');
    var estimate = [];
    var subtasks = [];

    for (var i = 0; i < subtasksNames.length; i++) {

        if (progress[i] && progress[i].innerHTML.trim() !== "&nbsp;") {
            if (progress[i].querySelector('table.tt_graph td img').getAttribute('alt').indexOf('Original') >= 0) {
                var estimateArr = progress[i].querySelector('table.tt_graph td img').getAttribute('alt').substring(20).split(' ');
                var convertedEstimate;
                if (!isNaN(estimateArr[0])) {
                    convertedEstimate = estimateArr[0] + estimateArr[1][0];
                } else convertedEstimate = "";
                if (estimateArr[2]) {
                    convertedEstimate = convertedEstimate + " " + estimateArr[2] + estimateArr[3][0];
                }
                if (estimateArr[4]) {
                    convertedEstimate = convertedEstimate + " " + estimateArr[4] + estimateArr[5][0];
                }
                estimate.push(convertedEstimate);
            }
        } else {
            estimate.push("");
        }
        subtasks.push({ name: subtasksNames[i].text, type: issueTypes[i].getAttribute('alt'), estimate: estimate[i] });
    }
    chrome.runtime.sendMessage({ from: 'Jira', subtasks: subtasks });
}

function detectPortal(tab) {
    chrome.tabs.executeScript(tab.id, { code: '\n    function checkIfPortal () {\n        var scripts = document.querySelectorAll(\'head script\');\n        var isPortal = false;\n        for (script of scripts) {\n            if (script.innerHTML.indexOf(\'Playtech\') > -1) {\n                isPortal = true;\n                break;\n            }\n        }\n        return isPortal;\n    }\n    checkIfPortal();                                        \n' }, function (isPortal) {
        if (isPortal && isPortal[0]) {
            portalTab = tab;
            getHeaderData(tab);
            getVersionJson(tab);
        }
    });
}

function getHeaderData(tab) {
    var tabOriginUrl = new URL(tab.url).origin;
    var data = headerData.find(function (data) {
        return data.url === tabOriginUrl;
    });

    data ? chrome.runtime.sendMessage({ header: data }) : getPortalLogoAndBackground(tab);
}

/***/ })

/******/ });