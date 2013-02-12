var assert = require('assert');
var SandboxedModule = require('../..');

var hasCoffee = false;
try {
  require('coffee-script');
  hasCoffee = true;
} catch (e) {}

if (hasCoffee) {
  var CoffeeClass = SandboxedModule.load('../fixture/coffeeClass').exports;
  assert.strictEqual(new CoffeeClass().simpleData(), 2);
}
