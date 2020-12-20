// ==UserScript==
// @name         Messengerscape
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Press Escape to exit a Facebook Messenger DM and return to Inbox
// @author       You
// @match        https://www.facebook.com/messages*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickConvoMenuItem(label) {
        Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => el.textContent === label).click();
    }

    function exitAllConvos() {
        const newMsgBtn = document.querySelector('[aria-label="New Message"]');
        newMsgBtn.click();
        setTimeout(() => {
            const newMsgDropdown = document.querySelector('[role="listbox"]');
            newMsgDropdown.style.display = "none";
        }, 100);
    }

    function openConvoActionsMenu() {
        // Open conversation actions menu
        const activeThreadName = getActiveThreadName();
        console.log({activeThreadName});
        if (!activeThreadName) {
            return;
        }

        const activeThreadNode = Array.from(document.querySelectorAll('[data-testid="mwthreadlist-item"]'))
            .find(el => el.textContent.includes(activeThreadName));
        console.log({activeThreadNode: activeThreadNode.textContent});
        activeThreadNode.querySelector('[aria-label="Menu"]').click();
    }

    function getActiveThreadName() {
        return document.querySelector('[role="main"] span:not([data-visualcompletion="ignore"])').innerText;
    }

    document.addEventListener('keydown', evt => {
        // Esc -> exit all conversations
        if (evt.keyCode === 27) {
            exitAllConvos();
        }

        // Command + U -> Mark currently selected conversation as Unread
        if (evt.metaKey && evt.key === 'u') {
            openConvoActionsMenu();
            setTimeout(() => {
                clickConvoMenuItem('Mark as Unread');
                exitAllConvos();
            }, 100);
        }

        // Command + H -> Hide currently selected conversation
        if (evt.metaKey && evt.key === 'h') {
            openConvoActionsMenu();
            setTimeout(() => clickConvoMenuItem('Hide Conversation'), 100);
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
