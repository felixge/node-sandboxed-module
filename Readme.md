# require-inject

A module that lets you inject test doubles into your modules.

## Usage

``` javascript
var requireInject = require('require-inject');
var myModule = requireInject('./my_module', {
  require: {
    './foo': {fake: 'foo module'},
    'http': {fake: 'http module'}
  },
  console: {my: 'console object},
  __dirname: '/my/fake/dirname',
});
```
