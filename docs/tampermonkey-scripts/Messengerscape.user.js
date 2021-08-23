// ==UserScript==
// @name         Messengerscape
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Press Escape to exit a Facebook Messenger DM and return to Inbox
// @author       You
// @match        https://www.facebook.com/messages*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise((res, rej) => setTimeout(res, ms));
    }

    function clickConvoMenuItem(label) {
        Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => el.textContent === label).click();
    }

    async function exitAllConvos() {
        const newMsgBtn = document.querySelector('[aria-label="New Message"]');
        newMsgBtn.click();
        await sleep(100);
        const newMsgDropdown = document.querySelector('[role="listbox"]');
        if (newMsgDropdown) {
            newMsgDropdown.parentElement.style.display = "none";
        }
    }

    async function openConvoActionsMenu(activeThreadName) {
        // Open conversation actions menu
        activeThreadName = activeThreadName || getActiveThreadName();
        console.log({activeThreadName});
        if (!activeThreadName) {
            return;
        }

        const activeThreadNode = Array.from(document.querySelectorAll('[data-testid="mwthreadlist-item"]'))
            .find(el => el.textContent.includes(activeThreadName));
        console.log({activeThreadNode: activeThreadNode.textContent});
        activeThreadNode.querySelector('[aria-label="Menu"]').click();
        await sleep(100);
    }

    function getActiveThreadName() {
        return document.querySelector('[role="main"] span:not([data-visualcompletion="ignore"])').innerText;
    }

    document.addEventListener('keydown', async evt => {
        // Esc -> exit all conversations
        if (evt.keyCode === 27) {
            exitAllConvos();
        }

        // Command + U -> Mark currently selected conversation as Unread
        if (evt.metaKey && evt.key === 'u') {
            // hack: messenger has a bug where even manually marking unread while a thread is selected doesnt really work,
            // so work around this by exiting 1st, then marking unread
            const activeThreadName = getActiveThreadName();
            await exitAllConvos();
            await sleep(100);
            await openConvoActionsMenu(activeThreadName);
            clickConvoMenuItem('Mark as Unread');
        }

        // Command + H -> Hide currently selected conversation
        if (evt.metaKey && evt.key === 'i') {
            await openConvoActionsMenu();
            clickConvoMenuItem('Archive Chat');
            exitAllConvos();
        }

        // Command + F -> Give focus to first conversation in list
        if (evt.metaKey && evt.key === 'f') {
            evt.preventDefault();
            const firstThread = document.querySelector('[data-testid="mwthreadlist-item"] [role="link"]');
            if (firstThread) {
                firstThread.tabIndex = 0;
                firstThread.focus();
            }
        }

        // Command + K -> Give focus to Messenger searchbox
        if (evt.metaKey && evt.key === 'k') {
            const searchBox = document.querySelector('[aria-label="Search Messenger"]');
            searchBox.focus();
        }
    });
})();
