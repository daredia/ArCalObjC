// ==UserScript==
// @name         Messengerscape
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Escape to exit a Facebook Messenger DM and return to Inbox
// @author       You
// @match        https://www.facebook.com/messages*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickConvoMenuItem(label) {
        Array.from(document.querySelectorAll('._54nf ._54ni')).find(el => el.textContent === label).click();
    }

    function exitAllConvos() {
        const newMsgBtn = document.querySelector('[aria-label="New Message"]');
        newMsgBtn.click();
    }

    function openConvoActionsMenu() {
        // Open conversation actions menu
        // document.querySelector('._23_m ._5blh').click(); - this selector doesnt work when 1st clicking a previously hidden convo
        document.querySelector('._1ht2 ._5blh').click();
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
            setTimeout(() => clickConvoMenuItem('Hide'), 100);
        }

        // Command + F -> Give focus to first conversation in list
        if (evt.metaKey && evt.key === 'f') {
            evt.preventDefault();
            const convoList = document.querySelector('[aria-label="Conversation List"]');
            if (convoList) {
                convoList.firstChild.focus();
            }
        }
    });
})();