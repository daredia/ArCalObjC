// ==UserScript==
// @name         Instascape
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Escape to exit out of an Instagram DM and back to the Inbox
// @author       You
// @match        https://www.instagram.com/direct/inbox/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', evt => {
        if (evt.keyCode === 27) {
            document.querySelector('.xWeGp').click();
        }
    });
})();