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
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ({

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var currentTab;
var extensionTabId;
var jiraResponse;

chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('opened');
    currentTab = tab;
    getData();
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
        changeTab(tab);
        jiraRequest(tab);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.selected && changeInfo.url) {
        changeTab(tab);
        jiraRequest(tab);
    }
});

function changeTab(updatedTab) {
    if (updatedTab.url.indexOf('chrome-extension') < 0) {
        currentTab = updatedTab;
        getData();
        chrome.runtime.sendMessage({ url: updatedTab.url, id: updatedTab.id });
    } else {
        extensionTabId = updatedTab.id;
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.isOpened) {
        chrome.runtime.sendMessage({ url: currentTab.url, id: currentTab.id });
        getData();
    }

    if (message.jsLoad === 'true') {
        var updatedUrl = currentTab.url.replace(/\?js_fast_load=1/gi, '') + "?js_fast_load=0";
        chrome.tabs.update(currentTab.id, { url: updatedUrl });
    }
    if (message.jsLoad === 'false') {
        var updatedUrl = currentTab.url.replace(/\?js_fast_load=0/gi, '') + "?js_fast_load=1";
        chrome.tabs.update(currentTab.id, { url: updatedUrl });
    }

    if (message.keys) {
        if (message.keys === '0') {
            var updatedUrl;
            if (currentTab.url.indexOf("?") !== -1) {
                updatedUrl = currentTab.url.substring(0, currentTab.url.lastIndexOf('?')) + "?showTranslationKeys=0";
            } else {
                updatedUrl = currentTab.url + "?showTranslationKeys=0";
            }
            chrome.tabs.update(currentTab.id, { url: updatedUrl });
        }
        if (message.keys === '1') {
            var updatedUrl;
            if (currentTab.url.indexOf("?") !== -1) {
                updatedUrl = currentTab.url.substring(0, currentTab.url.lastIndexOf('?')) + "?showTranslationKeys=1";
            } else {
                updatedUrl = currentTab.url + "?showTranslationKeys=1";
            }
            chrome.tabs.update(currentTab.id, { url: updatedUrl });
        }
        if (message.keys === '2') {
            var updatedUrl;
            if (currentTab.url.indexOf("?") !== -1) {
                updatedUrl = currentTab.url.substring(0, currentTab.url.lastIndexOf('?')) + "?showTranslationKeys=2";
            } else {
                updatedUrl = currentTab.url + "?showTranslationKeys=2";
            }
            chrome.tabs.update(currentTab.id, { url: updatedUrl });
        }
    }
});

function getData() {
    var versionPath = "/html/version.json";
    var url = currentTab.url.match(/((http|https)\:\/\/[a-zA-Z\d\-\.\:]+)*/)[0] + versionPath + "?" + Date.now();
    requestVersionJson(url);
    jiraRequest(currentTab);
}

function requestVersionJson(url) {
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.status + " " + response.statusText);
        }
        return response;
    }

    fetch(url).then(handleErrors).then(function (response) {
        return response.json();
    }).then(function (response) {
        return response.WPL_Version ? chrome.runtime.sendMessage({ version: response }) : null;
    }).catch(function (error) {
        console.log(error);
        fetch(url.replace("/html/", "/")).then(handleErrors).then(function (data) {
            return data.json();
        }).then(function (data) {
            return data.WPL_Version ? chrome.runtime.sendMessage({ version: data }) : null;
        }).catch(console.log);
    });
}

function jiraRequest(tab) {
    if (tab.url.indexOf("portal-jira.playtech") >= 0) {
        var jiraUrl = tab.url;
        console.log("JIRA woo");

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                jiraResponse = this.responseXML;
                if (jiraResponse.querySelector('#issuetable')) {
                    getSubTasks(jiraResponse);
                }
                if (jiraResponse.querySelector('.issueaction-create-subtask')) {
                    chrome.runtime.sendMessage({ createSubTaskButton: true });
                } else {
                    chrome.runtime.sendMessage({ createSubTaskButton: false });
                }
            }
        };
        xhr.responseType = "document";
        xhr.open("GET", jiraUrl + "?" + Date.now(), true);
        xhr.send();
    }
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

/***/ })

/******/ });