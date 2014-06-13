//jshint node:true
'use strict';

var assert = require('assert');
var SandboxedModule = require('../..');

var nativeModules = require('../../lib/native_modules');
assert.ok(nativeModules.length > 20, 'error discovering native modules, only found '+nativeModules.length);

var requireModule = SandboxedModule.require('../fixture/nativeModules', {
  requires: { './bar': 'fakeBar' }
});

assert.ok(requireModule);
