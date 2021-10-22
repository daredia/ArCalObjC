// ==UserScript==
// @name         Autoroll.me
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unroll.me integration into Gmail
// @author       You
// @match        https://mail.google.com/mail/u/0/*
// @icon         https://www.google.com/s2/favicons?domain=gmail.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Autoroll.me loaded', location.hash);

    const corsProxyUrl = 'https://limitless-wildwood-66609.herokuapp.com';
    const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiYWNjb3VudCJdLCJrbiI6ImVjYWMzZWQ5LTJkZjMtNDI2Mi05MGI1LWFhYzllNGY3Mjk3NSIsImlkIjo0MjI0MDIyLCJpYXQiOjE2Mjk3NDU5Mzh9.Lqes-gnU42Zj3yicF-Wm6satoKAaK2tTo88Sf1bqpdQ8eQZ6pSj1FCFgi4Hemt1jWaniXv4YVOMECg5nzpbfC9l7E31tFtT59yW1LpaVyq0zbQrnjI6tmZmZtTS11QiX5h1tModUY4Bx7SRCJXIs5PHiYyk1AEhOJiW5Nb7RA0kKZCVDWkQneWU1vfcrrnge_sI3og5f08oVrXcQRwQZ9A_XWEQor3rq8CsMuhIhKzI8RPaxWSnDWdnwIy7XmB_-0tMwzolPlIOamHQJhxqtdpi3xhcmSTbbvtOmjE1pJJ5E2O5M-yETiWppqNzSGBBEz5R9I3O6kiBlaNiQRLxEpQ';

    const emailToRecord = {};
    let $unrollState;
    let $stateSelector;

    function renderUnrollState(record) {
        if (!record) {
            return;
        }

        // backup node if existing label not found on page
        const template = document.createElement('template');
        template.innerHTML = `
<div class="ahR">
   <div class="hN" role="button" tabindex="0" style="background-color: rgb(221, 221, 221); color: rgb(102, 102, 102);" ></div>
</div>
        `;

        const $nodes = document.querySelectorAll('div[aria-label*="mportant"]');
        const $importanceMarker = $nodes[$nodes.length - 1];
        const $label = $importanceMarker.nextElementSibling;
        $unrollState = $label ? $label.cloneNode(true) : template.content.firstElementChild;
        $unrollState.children[0].removeAttribute('name');
        updateUnrollStateLabel(record.state);
        $unrollState.onclick = (e) => {
            e.preventDefault();
            const isDisplayed = $stateSelector.style.display != 'none';
            $stateSelector.style.display = isDisplayed ? 'none' : 'initial';
        };
        // Wait before appending because otherwise page reflows or something and newly appended node will disappear
        setTimeout(() => {
            $importanceMarker.parentNode.appendChild($unrollState);
            renderUnrollStateSelector(record, $importanceMarker.parentNode);
        }, 500);
    }

    function updateUnrollStateLabel(state) {
        $unrollState.children[0].innerText = 'Unroll.me ' + state;
    }

    function renderUnrollStateSelector(record, $parentNode) {
        const template = document.createElement('template');
        template.innerHTML = `
<div class="J-M aX0 aYO jQjAxd" style="user-select: none; left: 88px; top: 30px; display: none;" role="menu" aria-haspopup="true">
   <div class="SK AX" style="user-select: none; min-width: 12px;">
      <div class="J-N" jslog="20284; u014N:cOuCgd,Kr2w4b;" role="menuitem" id=":1dt" style="user-select: none;">
         <div class="J-N-Jz" style="user-select: none;">Add to rollup</div>
      </div>
      <div class="J-N" role="menuitem" id=":1du" style="user-select: none;">
         <div class="J-N-Jz" style="user-select: none;">Keep in inbox</div>
      </div>
      <div class="J-N" jslog="20511; u014N:cOuCgd,Kr2w4b;" role="menuitem" id=":1dx" style="user-select: none;">
         <div class="J-N-Jz" style="user-select: none;">Unsubscribe</div>
      </div>
   </div>
</div>
        `;
        $stateSelector = template.content.firstElementChild;
        const states = ['rollup', 'inbox', 'unsubscribed'];
        const actionNodes = Array.from($stateSelector.firstElementChild.children);
        actionNodes.forEach((c, i) => {
            c.onclick = () => {
                updateUnrollStateLabel('...');
                updateSubscription(record, states[i]);
                $stateSelector.style.display = 'none';
            };
            c.onmouseover = () => c.style.backgroundColor = '#eee';
            c.onmouseout = () => c.style.backgroundColor = '#fff';
        });
        $parentNode.appendChild($stateSelector);
    }

    function checkForConversationView() {
        const conversationViewRegex = /^#[a-z]+\//i;
        const searchViewRegex = /^#search\/[a-z]+$/i;
        if (!conversationViewRegex.test(location.hash) || searchViewRegex.test(location.hash)) {
            $unrollState = null;
            return;
        }

        const $email = document.querySelector('h3 span[email]')
        const email = $email?.getAttribute('email') || undefined;
        const record = emailToRecord[email];
        if (!$unrollState) {
            renderUnrollState(record);
        }
    }

    async function updateSubscription(record, state) {
        if (record.state == state) {
            return;
        }

        const requestUrl = `https://apiv2.unroll.me/subscriptions/${record.id}`;
        const response = await fetch(`${corsProxyUrl}/${requestUrl}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `Bearer ${authToken}`,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"92\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://unroll.me/",
//            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `{\"state\":\"${state}\"}`,
            "method": "PATCH",
//            "mode": "cors",
//            "credentials": "include"
        });
        if (response.status != 202) {
            updateUnrollStateLabel('error');
            console.warn('Failed to update Unroll.me state. Status code', response.status);
            return;
        }

        setTimeout(async () => {
            await Promise.all([getSubscriptions(record.state), getSubscriptions(state)]);
            const newState = emailToRecord[record.email].state;
            updateUnrollStateLabel(newState);
        }, 500);
    }

    async function getSubscriptions(state) {
        let requestUrl = `https://apiv2.unroll.me/subscriptions?direction=asc&limit=200&order=domain&page=1&state=${state}`;
        let results = [];

        while (requestUrl) {
            const response = await fetch(`${corsProxyUrl}/${requestUrl}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${authToken}`,
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"92\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://unroll.me/",
                //            "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                //            "mode": "no-cors",
                //            "credentials": "include"
            });

            const data = await response.json();
            requestUrl = data.links.next;
            results = results.concat(data.data);
        }

        results.forEach(r => emailToRecord[r.email] = r);
        console.log({count: Object.keys(emailToRecord).length});
        Window.emailToRecord = emailToRecord;
    }

    document.addEventListener('keydown', evt => {
        // Esc -> Close state selector menu
        if (evt.keyCode === 27 && $stateSelector?.style?.display != 'none') {
            $stateSelector.style.display = 'none';
        }
    });

    getSubscriptions('new');
    getSubscriptions('rollup');
    getSubscriptions('inbox');
    getSubscriptions('unsubscribed');

    const interval = setInterval(checkForConversationView, 500);
})();
