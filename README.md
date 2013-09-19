## Installation

    $ npm install yui-combo-middleware

## Overview

This package is a bundle of middleware which can be used to decode custom combo
urls which represent a set of YUI modules. It is compatible with both Connect
and Express-based applications.

## Usage

```js
// Decode a combo url into a list of YUI module urls.
var mid = require('yui-combo-middleware');
var strategy = require('yui-pathogen-decoder'); // or any decoding strategy
var decodeURLs = mid.createComposite([
    mid.init(config),
    mid.context(config),
    mid.decode(strategy, config),
    mid.validate(config),
    mid.url(config)
]);
app.use('/combo', decodeURLs, function (req, res, next) {
    // res.locals.urls is an array of individual YUI modules
});
```

## License

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/ekashida/yui-combo-middleware/blob/master/LICENSE
