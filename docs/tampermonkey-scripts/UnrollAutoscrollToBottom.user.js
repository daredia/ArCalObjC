// ==UserScript==
// @name         Autoscroll to bottom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically scrolls to the bottom of the page
// @author       You
// @match        https://unroll.me/a/subscriptions/*
// @icon         https://www.google.com/s2/favicons?domain=unroll.me
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let lastScrollTop = document.documentElement.scrollTop;

    var scrollInterval = setInterval(function() {
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        if (document.documentElement.scrollTop == lastScrollTop) {
            stopScroll();
        }
        lastScrollTop = document.documentElement.scrollTop;
    }, 1000);
    var stopScroll = function() { clearInterval(scrollInterval); };

})();