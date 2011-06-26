# injectable-module

A module that lets you inject test doubles into your modules.

## Usage

``` javascript
var InjectableModule = require('injectable-module');
var myModule = InjectableModule.load('./my', {
  require: {'./foo': {fake: 'foo module'}},
  global: {myGlobal: 'variable'},
  local: {myLocal: 'other variable'},
});
```
