var assert = require('assert');
var SandboxedModule = require('../..');

var foo = SandboxedModule.require('../fixture/foo', {
	"requires": {"doesNotExist": {}},
	"ignoreMissing": true
});
assert.strictEqual(foo.foo, 'foo');
assert.strictEqual(foo.bar, 'bar');
