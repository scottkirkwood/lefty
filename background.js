// Copyright 2010 Google Inc. All Rights Reserved.

/**
 * @fileoverview Make the center table or div left.
 * @author scottkirkwood@google.com (Scott Kirkwood)
 */

chrome.extension.onConnect.addListener(
  function(port) {
    if (port.name != 'lefty') {
      console.log('Not listening to port named: ' + port.name);
      return;
    }
    port.onMessage.addListener(
      function(msg) {
        if (msg.cmd == 'getSetting') {
          var obj = getSetting(msg.name, '');
          console.log('Get setting for: ' + msg.name + ' = ' + obj);
          port.postMessage({
              cmd: 'getSetting',
              name: msg.name,
              value: obj });
        } else if (msg.cmd == 'setSetting') {
          console.log('Save setting for ' + msg.name + ' = ' + msg.value);
          setSetting(msg.name, msg.value);
          port.postMessage({});
        } else if (msg.cmd == 'ping') {
          console.log('ping');
          port.postMessage({cmd: 'pong'});
        } else {
          console.log('Got unknown message: ' + msg.cmd);
          port.postMessage({error: 'unknown message'});
        }
      }
    );
  }
);

/**
 * Inject these two files in the page.
 * The second will also execute a function.
 */
function onGoLeft() {
  chrome.tabs.executeScript(null, {file: 'jquery-1.4.2.min.js'});
  chrome.tabs.executeScript(null, {file: 'lefty.js'});
}

chrome.browserAction.onClicked.addListener(onGoLeft);

