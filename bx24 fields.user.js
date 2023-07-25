// ==UserScript==
// @name         bx24 fields
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

var counter = document.getElementsByClassName("ui-entity-editor-column-content");

if (counter) {
    var items = document.getElementsByClassName("ui-entity-editor-content-block");
    var items_len = items.length;
    //console.log(items);
    for (var i = 0; i < items_len; i++) {
        if(items[i].getAttribute("data-cid") != null){
            console.log("FOUND data-cid : ");
            console.log(items[i].getAttribute("data-cid"));
            //console.log(items[i]);
            if(items[i].getElementsByClassName("ui-entity-editor-block-title") != null){
                console.log("FOUND block-title full: ");
                console.log(items[i]);
                console.log("FOUND block-title classname: ");
                console.log(items[i].getElementsByClassName("ui-entity-editor-block-title"));
                if(items[i].getElementsByClassName("ui-entity-editor-block-title").length != 0) {
                    items[i].getElementsByClassName("ui-entity-editor-block-title")[0].innerText += ' {' + items[i].getAttribute("data-cid") + '}' ;
                    console.log("SET LABEL TEXT: ");
                    console.log(items[i].getElementsByClassName("ui-entity-editor-block-title"));
                }
            }
        }
    //console.log(item);
    //var bgcolor = item.style.cssText.split(/:/);
    //bgcolor = bgcolor[1].replace(';','');
    //console.log(item.style.cssText);
    //console.log(bgcolor);
    //item.style.background = bgcolor;
    }
} else {setTimeout(init, 0);}})();