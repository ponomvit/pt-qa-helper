let isPortal = false;
function checkIfPortal () {
    const scripts = document.querySelectorAll('head script');
    let isPortal = false;
    for (let script of scripts) {
        if (script.innerHTML.indexOf('Playtech') > -1) {
            isPortal = true;
            break;
        }
    }
    return isPortal;
}
let getLogo = () => {
    let logoElem = document.querySelector('.main-header__logo') || document.querySelector('.main-logo__img')
    if (logoElem && logoElem.getAttribute('src')) {
        return logoElem.getAttribute('src');
    } else if (logoElem) {
        return logoElem.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    }
};

let getHeaderColor = () => {
    let mainHeader = document.querySelector('.navigation-container') || document.querySelector('.fn-navigation') ;
    if (mainHeader) {
        return getStyle(mainHeader,"background-color")
    }
};

/*let getButtonColor = () => {
    let SignUpButton = document.querySelector('.btn_action_sign-up') || document.querySelector('.btn_action_register');
    let SignUpButtonColor = SignUpButton ? getStyle(SignUpButton,'border-color') : '#ffc107';
    let SignUpButtonTextColor = SignUpButton ? getStyle(document.querySelector('.application-root'),"color" ) : '#111';
    return [SignUpButtonColor,SignUpButtonTextColor];
};*/

let getStyle = (selector, style) => {
    return window.getComputedStyle(selector, null).getPropertyValue(style)
};

isPortal = checkIfPortal();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.warn(request);
        if (request.getTabData) {
            sendResponse({
                tabData:{
                    isPortal:checkIfPortal(),
                    originUrl:window.location.origin,
                    hostname:window.location.hostname
                }
            })
        }
    }
);

let observer = new MutationObserver(function (mutations, me) {
    for (let mutation of mutations) {
        //console.log(mutation.target.querySelector('.fn-navigation'));
        if (mutation.target.querySelector('.fn-navigation') ||  document.querySelector('.fn-navigation-container')) {
            me.disconnect();
            let logo = getLogo();
            let headerColor = getHeaderColor();
            //let buttonStyles = getButtonColor();

            chrome.runtime.sendMessage({
                contentData:true,
                tabData:{
                    isPortal:isPortal,
                    originUrl:window.location.origin,
                    hostname:window.location.hostname
                },
                headerOptions:{
                    url:window.location.origin,
                    hostname:window.location.hostname,
                    logo: window.location.origin+logo,
                    headerColor: headerColor,
/*                    buttonColor: buttonStyles[0],
                    buttonTextColor:buttonStyles[1]*/
                }
            });
            break;
        }
    }
});
if (isPortal) {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}


