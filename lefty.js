// Copyright 2010 Google Inc. All Rights Reserved.

/**
 * @fileoverview Make a page that is normally centered, move to the left.
 *
 * @author scottkirkwood@google.com (Scott Kirkwood)
 */

var port = chrome.extension.connect({name: 'lefty'});

var whichSite = document.location.protocol + '//' + document.location.host;

// This style works amazingly well.
var marginRight = {'margin-right': '950px', 'margin-left': '5px'};

var didIt = false;  // did we apply left?

function applyCss(elem) {
  elem.css(marginRight);
  var output = '';
  for (var key in marginRight) {
    if (marginRight.hasOwnProperty(key)) {
      output += key + ': ' + marginRight[key] + '; ';
    }
  }
  console.log('.css({' + output + '}); site: ' + whichSite);
}

function kixCss(elem) {
  for (i = 0; i < 3; i++) {
    elem = elem.children().first();
  }
  elem.css({'left': 5});
  console.log('kix.css({left: 5}); site: ' + whichSite);
}

var queries = [
  // ex. orkut
  { 'q': '#gwtPanel center', 'maxDepth': 8, 'func': applyCss },

  // docs
  { 'q': '#kix-appview', 'maxDepth': 5, 'func': kixCss },

  // This seems to work for 90% of the sites
  { 'q': 'body', 'maxDepth': 1, 'func': applyCss }
];

/**
 * Create a jquery function to find the depth.
 */
$.fn.depth = function() {
  return $(this).parents().length;
}

/**
 * Removed white space left and right.
 */
function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/*
 * Attempt to set the style.
 */
function setStyle(style) {
  if (!style) {
    return;
  }
  var styles = style.split(';');
  if (style.length === 0) {
    console.log('Got 0 length array');
    return;
  }
  marginRight = {};
  for (var i in styles) {
    if (styles.hasOwnProperty(i)) {
      var keyval = styles[i].split(':');
      if (keyval.length == 2) {
        marginRight[trim(keyval[0])] = trim(keyval[1]);
      }
    }
  }
  var output = 'margin_right = ';
  for (var key in marginRight) {
    if (marginRight.hasOwnProperty(key)) {
      output += key + ': ' + marginRight[key] + '; ';
    }
  }
  console.log(output);
}

/**
 * Loop through the known queries that often work.
 */
function loopKnown() {
  for (var query in queries) {
    if (queries.hasOwnProperty(query)) {
      var id = queries[query].q;
      var elem = $(id);
      if (elem.length) {
        var depth = elem.depth();
        var maxDepth = queries[query].maxDepth;
        if (depth > maxDepth) {
          console.log('too deep, depth is: ' + depth + " for " + id);
          continue;
        } else {
          console.log('depth is: ' + depth + " for " + id);
        }
        var func = queries[query].func;
        func(elem);
        return true;
      }
    }
  }
  return false;
}

port.onMessage.addListener(
  function(msg) {
    if (msg.cmd == 'getSetting') {
      if (msg.name == 'style') {
        setStyle(msg.value);
      } else {
        console.log('Unknown setting: ' + msg.name);
      }
    } else if (msg.cmd == 'pong') {
      loopKnown();
    } else {
      console.log('Unknown message: ' + msg.cmd);
    }
  });

// Post a messages and wait for response
port.postMessage({cmd: 'getSetting', name: 'style'});
port.postMessage({cmd: 'ping'});
