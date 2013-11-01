var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = "fakeBar";
var requireModule = SandboxedModule.load('../fixture/criss');
var criss = requireModule.exports;
var cross = criss.cross
assert.strictEqual(criss.value, "criss value");
assert.strictEqual(cross.value, "cross value");
assert.strictEqual(criss.cross, cross);
assert.strictEqual(cross.criss, criss);


