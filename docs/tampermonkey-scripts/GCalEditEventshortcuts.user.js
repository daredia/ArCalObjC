// ==UserScript==
// @name         GCal Edit Event shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*/*/r/eventedit*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', evt => {
        // Command + L -> Give focus to event location text field
        if (evt.metaKey && evt.key === 'l') {
            evt.preventDefault();
            const locationInput = document.querySelector('input[aria-label="Location"]');
            locationInput.focus();
        }

        // Command + D -> Give focus to event description text area
        if (evt.metaKey && evt.key === 'd') {
        evt.preventDefault();
        const description = document.querySelector('.T2Ybvb');
        description.focus();
      }

        // Command + P -> Give focus to calendar to easily switch it to my personal calendar
        if (evt.metaKey && evt.key === 'p') {
            evt.preventDefault();
            const calInput = document.querySelector('div[aria-label="Calendar"]');
            if (calInput) {
                calInput.querySelector('div[aria-selected="true"]').focus();
            }
        }
    });
})();
