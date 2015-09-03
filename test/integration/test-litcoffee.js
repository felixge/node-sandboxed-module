var assert = require('assert');
var SandboxedModule = require('../..');

var hasCoffee = false;
try {
  require('coffee-script').register();
  hasCoffee = true;
} catch (e) {}

if (hasCoffee) {
  var CoffeeClass = SandboxedModule.load('../fixture/litcoffeeClass', {
    sourceTransformers: {
      litcoffee: litcoffeeCompiler
    }
  }).exports;
  assert.strictEqual(new CoffeeClass().simpleData(), 42);
}

function litcoffeeCompiler(source) {
  if (this.filename.search(/\.litcoffee$/) !== -1){
    return require('coffee-script').compile(source, {literate: true});
  } else {
    return source;
  }
}
