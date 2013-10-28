/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

/**
Initializes the request in a way similar to Express. Only useful for
Connect-based apps.
@return {Object} req.query
@return {String} req.path
@return {Object} req.locals
**/
exports.init = require('./lib/middleware/init');

/**
Contextualization middleware
@return {Boolean} req.comboSecure
**/
exports.context = require('./lib/middleware/context');

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
Transform modules into paths
@param {Array} res.locals.groups
@return {Array} res.locals.paths
**/
exports.path = require('./lib/middleware/path');

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
Transform urls into an ESI document
@param {Array} res.locals.url
@return {String} res.locals.body
**/
exports.esi = require('./lib/middleware/esi');

/**
Ends the request after setting the proper headers
@param {String} res.locals.body
**/
exports.done = require('./lib/middleware/done');

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

/**
Middleware that decodes combo urls into ESI documents.
@method decodeToESI
@param {Object} config Configuration object.
    @param {Object} config.strategy Decoding strategy
    @param {String} config.yuiBase Base url used to load YUI modules
    @param {String} config.appBase Base url used to load application modules
    @param {String} config.yuiBaseSecure https version of `yuiBase`
    @param {String} config.appBaseSecure https version of `appBase`
@return {Function} Composite middleware that decodes combo urls into ESI docs.
**/
exports.decodeToESI = function (config) {
    return exports.createComposite([
        exports.init(config),
        exports.context(config),
        exports.decode(config),
        exports.validate(config),
        exports.url(config),
        exports.esi(config),
        exports.done(config)
    ]);
};
