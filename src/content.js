class QAHelper {
    static checkIfPortal() {
        const scripts = document.querySelectorAll('head script');
        let isPortal = false;
        for (let script of scripts) {
            if (script.innerHTML.indexOf('Playtech') > -1) {
                isPortal = true;
                break;
            }
        }
        return isPortal;
    };

    static getStyle(selector, style) {
        return window.getComputedStyle(selector, null).getPropertyValue(style)
    };

    static get headerColor() {
        let mainHeader = document.querySelector('.desktop .navigation-container') || document.querySelector('.mobile .main-header__common') || document.querySelector('.fn-navigation') ;
        return mainHeader ? QAHelper.getStyle(mainHeader,"background-color") : 'rgb(36, 80, 149)'
    };

    static get logo() {
        const logoElem = document.querySelector('.main-header__logo') || document.querySelector('.main-logo__img')
        if (logoElem && logoElem.getAttribute('src')) {
            return window.location.origin + logoElem.getAttribute('src');
        } else if (logoElem) {
            return window.location.origin + logoElem.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        } else return './assets/icon-logo-header.png'
    }

    static get theme() {
        return document.querySelector('link[type="text/css"]').getAttribute('href').split('/')[1];
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getTabData) {
            sendResponse({
                tabData:{
                    theme: QAHelper.theme,
                    isPortal: QAHelper.checkIfPortal(),
                    originUrl: window.location.origin,
                    hostname: window.location.hostname
                }
            })
        }
    }
);

let observer = new MutationObserver(function (mutations, me) {
    for (let mutation of mutations) {
        if (mutation.target.querySelector('.fn-navigation') ||  mutation.target.querySelector('.fn-navigation-container')) {
            me.disconnect();
            chrome.runtime.sendMessage({
                contentData:true,
                theme: QAHelper.theme,
                tabData:{
                    isPortal: QAHelper.checkIfPortal(),
                    originUrl:window.location.origin,
                    hostname:window.location.hostname
                },
                headerOptions:{
                    theme: QAHelper.theme,
                    url:window.location.origin,
                    hostname:window.location.hostname,
                    logo: QAHelper.logo,
                    headerColor: QAHelper.headerColor
                }
            });
            break;
        }
    }
});

if (QAHelper.checkIfPortal()) {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}