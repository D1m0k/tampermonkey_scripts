// ==UserScript==
// @name         bx24 colorize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.bitrix24.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.ru
// @grant        none
// ==/UserScript==

(function init() {
    'use strict';
    // Your code here...

var counter = document.getElementById("toolbar_lead_list_settings_menu");
if (counter) {
    var items = document.getElementsByClassName("crm-kanban-item");
    //console.log(items);
    for (const item of items) {
    //console.log(item);
    var bgcolor = item.style.cssText.split(/:/);
    bgcolor = bgcolor[1].replace(';','');
    //console.log(item.style.cssText);
    console.log(bgcolor);
    item.style.background = bgcolor;
    console.log(item);
    }
} else {setTimeout(init, 0);}})();