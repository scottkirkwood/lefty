// Copyright 2010 Google Inc. All Rights Reserved.

/**
 * @fileoverview Schema methods.
 * @author scottkirkwood@google.com (Scott Kirkwood)
 */

// Settings start with se_ in the datastore
function getSetting(name, defaultValue) {
  var key = 'le_' + name;
  var obj = localStorage[key];
  if (obj == null) {
    return defaultValue;
  }
  return obj;
}


function setSetting(name, value) {
  var key = 'le_' + name;
  localStorage[key] = value;
}

