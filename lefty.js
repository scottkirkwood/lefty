// Copyright 2010 Google Inc. All Rights Reserved.

/**
 * @fileoverview Make a page that is normally centered, move to the left.
 *
 * @author scottkirkwood@google.com (Scott Kirkwood)
 */

var port = chrome.extension.connect({name: 'lefty'});

var whichSite = document.location.protocol + '//' + document.location.host;

// This style works amazingly well.
var margin_right = {'margin-right': '950px', 'margin-left': '5px'};

var queries = [
  '#gwtPanel center', // ex. orkut
  '#kix-appview',  // docs
  'body'  // This seems to work for 90% of the sites
];

var maxDepths = [
  8,
  5,
  1
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
  if (style.length == 0) {
    console.log('Got 0 length array');
    return;
  }
  margin_right = {};
  for (var i in styles) {
    var keyval = styles[i].split(':');
    if (keyval.length == 2) {
      margin_right[trim(keyval[0])] = trim(keyval[1]);
    }
  }
  var output = 'margin_right = ';
  for (key in margin_right) {
    output += key + ': ' + margin_right[key] + '; ';
  }
  console.log(output);
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
      if ($('.kix-documentview').length) {
        // Special handling for docs document
        $('.kix-documentview').css('left', '5px');
        console.log('Kix special case');
      }
    } else {
      console.log('Unknown message: ' + msg.cmd);
    }
  });

/**
 * Loop through the known queries that often work.
 */
function loopKnown() {
  for (var query in queries) {
    var id = queries[query];
    var elem = $(id);
    if (elem.length) {
      var depth = elem.depth();
      if (depth > maxDepths[query]) {
        console.log('too deep, depth is: ' + depth + " for " + id);
        continue;
      } else {
        console.log('depth is: ' + depth + " for " + id);
      }
      elem.css(margin_right);
      var output = '';
      for (key in margin_right) {
        output += key + ': ' + margin_right[key] + '; ';
      }
      console.log('$(' + id + ').css({' + output + '}); site: ' + whichSite);
      return true;
    }
  }
  return false;
}

// Post a messages and wait for response
port.postMessage({cmd: 'getSetting', name: 'style'});
port.postMessage({cmd: 'ping'});
