var common = require('../common');
var assert = common.assert;
var InjectableModule = require(common.dir.lib + '/injectable_module');

(function testGlobals() {
  var path = common.dir.fixture + '/global';
  var globals = InjectableModule.load(path).exports;

  assert.ok(globals.module);
  assert.ok(globals.require);
  assert.ok(globals.global);
  assert.strictEqual(globals.GLOBAL, globals.global);
  assert.strictEqual(globals.root, globals.global);
  assert.strictEqual(globals.exports, globals.module.exports);
  assert.equal(globals.__filename, path + '.js');
  assert.equal(globals.__dirname, common.dir.fixture);

  for (var key in global) {
    if (/global|root/i.test(key)) {
      continue;
    }

    assert.strictEqual(globals[key], global[key], key);
  }
})();
