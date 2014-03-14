/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */


/**
Middleware to decode the combo url
    @param {Object} config.strategy Optional strategy. Defaults to Pathogen.
@return {Array} req.locals.groups Decoded module groups
@return {String} req.locals.type Combo asset type (js or css)
@return {String} req.locals.filter Combo asset filter
**/
exports.decode = require('./lib/middleware/decode');

/**
Validation middleware
@param {Array} res.locals.groups
**/
exports.validate = require('./lib/middleware/validate');

/**
Transform modules into urls
@param {Array} res.locals.groups Array of module groups
@param {String} res.locals.filter Filter
@param {String} res.locals.type Type (js or css)
@param {String} config.yuiBase Base url used to load YUI modules
@param {String} config.appBase Base url used to load application modules
@param {String} config.yuiBaseSecure https version of `yuiBase`
@param {String} config.appBaseSecure https version of `appBase`
@return {Array} res.locals.urls
**/
exports.url = require('./lib/middleware/url');

/**
Create composite middleware.
@method createComposite
@param {Function|Array} middleware* One or more middleware to combine.
@return {Function} Composite middleware.
**/
exports.createComposite = function () {
    var args     = Array.prototype.slice.apply(arguments),
        handlers = [];

    args.forEach(function (arg) {
        if (Array.isArray(arg)) {
            handlers = handlers.concat(arg);
        } else {
            handlers.push(arg);
        }
    });

    return function (req, res, next) {
        function run(index) {
            if (index < handlers.length) {
                handlers[index](req, res, function (err) {
                    if (err) {
                        return next(err);
                    }
                    index += 1;
                    run(index);
                });
            } else {
                next();
            }
        }
        run(0);
    };
};
