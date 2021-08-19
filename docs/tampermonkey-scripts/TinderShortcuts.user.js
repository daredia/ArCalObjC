// ==UserScript==
// @name         Tinder shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keyboard shortcuts for Tinder web app
// @author       You
// @match        https://tinder.com/*
// @icon         https://www.google.com/s2/favicons?domain=tinder.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function exitConvo() {
        const closeBtn = document.querySelector('[aria-label="Close"]');
        closeBtn && closeBtn.click();
    }

    document.addEventListener('keydown', evt => {
        // Esc -> exit conversation
        if (evt.keyCode === 27) {
            exitConvo();
        }
    });
})();