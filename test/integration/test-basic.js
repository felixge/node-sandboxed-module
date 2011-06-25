var common = require('../common');
var assert = common.assert;
var requireInject = require(common.dir.lib + '/require-inject');

(function testRequire() {
  var foo = requireInject('../fixture/foo');
  assert.strictEqual(foo.foo, 'foo');
  assert.strictEqual(foo.bar, 'bar');
})();

(function testGlobals() {
  var path = common.dir.fixture + '/global';
  var globals = requireInject(path);

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
