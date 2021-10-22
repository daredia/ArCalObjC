// ==UserScript==
// @name         GCal Month View Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*/*/r/month*
// @icon         https://www.google.com/s2/favicons?domain=calendar.google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let eventOptionsBtn = null;

    function simulateClick(elem) {
        var rect = elem.getBoundingClientRect(), // holds all position- and size-properties of element
            topEnter = rect.top,
            leftEnter = rect.left, // coordinates of elements topLeft corner
            topMid = topEnter + rect.height / 2,
            leftMid = topEnter + rect.width / 2, // coordinates of elements center
            ddelay = (rect.height + rect.width) * 2, // delay depends on elements size
            ducInit = {bubbles: true, clientX: leftMid, clientY: topMid}, // create init object
            // set up the four events, the first with enter-coordinates,
            mover = new MouseEvent('mouseover', {bubbles: true, clientX: leftEnter, clientY: topEnter}),
            // the other with center-coordinates
            mdown = new MouseEvent('mousedown', ducInit),
            mup = new MouseEvent('mouseup', ducInit),
            mclick = new MouseEvent('click', ducInit);
        // trigger mouseover = enter element at toLeft corner
        elem.dispatchEvent(mover);
        // trigger mousedown  with delay to simulate move-time to center
        window.setTimeout(function() {elem.dispatchEvent(mdown)}, 350);
        // trigger mouseup and click with a bit longer delay
        // to simulate time between pressing/releasing the button
        window.setTimeout(function() {
            elem.dispatchEvent(mup); elem.dispatchEvent(mclick);
        }, 400);
    }

    function toggleCal(label) {
        Array.from(document.querySelectorAll('.XXcuqd')).find(el => el.innerText == label).firstChild.firstChild.click();
    }

    function openEventOptionsMenu(cb) {
        eventOptionsBtn.click();
        setTimeout(cb, 50);
    }

    function getEventOptionEl(label) {
        return Array.from(document.querySelectorAll('.z80M1.taKRZe')).find(el => el.innerText == label);
    }

    function copyEventToArchive() {
        openEventOptionsMenu(() => {
            const copyToArchiveEl = getEventOptionEl('Copy to Archive');
            simulateClick(copyToArchiveEl);
        });
    }

    function giveFocusToFirstEvent() {
        const allEvents = document.querySelectorAll('[data-eventchip]');
        if (allEvents.length) {
            const eventsAfterYesterday = Array.from(allEvents).filter(node => {
                const parentWithDateStr = parentWith(node, (node) => node.firstElementChild.innerText.includes('event'));
                const dateStr = parentWithDateStr.firstElementChild.innerText + ', ' + new Date().getFullYear();
                const dateStrClean = dateStr.replace(/, today/i, '').split(/event[s]?,/)[1];
                return new Date().setHours(0, 0, 0, 0) <= Date.parse(dateStrClean);
            });

            const firstEventAfterYesterday = eventsAfterYesterday[0];
            firstEventAfterYesterday?.firstElementChild?.focus();
        }
    }

    function parentWith(node, predicate) {
        while (node) {
            if (predicate(node)) {
                return node;
            }

            node = node.parentNode;
        }

        return null;
    }

    document.addEventListener('keydown', evt => {
        // Command + A -> Copy event to Archive OR Toggle Archive calendar, depending on context
        if (evt.metaKey && evt.key === 'a') {
            evt.preventDefault();
            eventOptionsBtn = document.querySelector('[aria-label="Options"]');
            eventOptionsBtn ? copyEventToArchive() : toggleCal('Archive');
        }

        // Command + P -> Give focus to calendar to easily switch it to my Personal calendar
        if (evt.metaKey && evt.key === 'p') {
            evt.preventDefault();
            const calInput = document.querySelector('.jNfAwc div[aria-label="Calendar"]');
            if (calInput) {
                calInput.querySelector('div[aria-selected="true"]').focus();
                return;
            }

            const calLabel = document.querySelector('span[data-key="calendar"]');
            const calButton = parentWith(calLabel, node => node.getAttribute('role') == 'button');
            if (calButton) {
                calButton.focus();
            }
        }

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
            if (description) {
                description.focus();
            }
        }

        // Command + F -> Give focus to the event that starts first
        if (evt.metaKey && evt.key === 'f') {
            evt.preventDefault();
            giveFocusToFirstEvent();
        }
    });

})();
