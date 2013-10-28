/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

/*jslint nomen: true*/
var lib = {
    path:   require('path'),
    fs:     require('fs')
};

var handlebars = require('handlebars');

var filePath = lib.path.join(__dirname, '../..', 'templates/esi.handlebars');
if (!lib.fs.existsSync(filePath)) {
    console.error('[ERROR]', 'Could not find ' + filePath);
    process.exit(1);
}

var template = handlebars.compile(
    lib.fs.readFileSync(filePath, 'utf8')
);

module.exports = function (config) {
    config = config || {};

    /**
    Renders an ESI doc using a template.

    Also sets the header that triggers the ESI plugin.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        // Generate the ESI document.
        res.locals.body = template({
            urls: res.locals.urls,
            esiExcept: config.esiExcept || '7a9b301b6992b405f975c45be8dadd85'
        });

        // Triggers ESI processing.
        res.setHeader('X-Esi', 1);

        next();
    };
};
