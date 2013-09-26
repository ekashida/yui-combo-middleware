exports.init        = require('./lib/middleware/init');
exports.context     = require('./lib/middleware/context');
exports.decode      = require('./lib/middleware/decode');
exports.validate    = require('./lib/middleware/validate');
exports.path        = require('./lib/middleware/path');
exports.url         = require('./lib/middleware/url');
exports.esi         = require('./lib/middleware/esi');
exports.done        = require('./lib/middleware/done');

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
@param {Object} strategy Decoding strategy.
@param {Object} config Configuration object.
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
