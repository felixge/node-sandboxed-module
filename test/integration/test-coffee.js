var assert = require('assert');
var SandboxedModule = require('../..');

var hasCoffee = false;
try {
  require('coffee-script').register();
  hasCoffee = true;
} catch (e) {}

function testCoffee(file) {
  var CoffeeClass = SandboxedModule.load(file).exports;
  assert.strictEqual(new CoffeeClass().simpleData(), 2);
}

if (hasCoffee) {
  testCoffee('../fixture/coffeeClass');

  SandboxedModule.registerBuiltInSourceTransformer('coffee', null, /.*filtered.*$/);
  assert.throws(testCoffee.bind(null, '../fixture/coffeeClass'));
  testCoffee('../fixture/filteredCoffee');
}
