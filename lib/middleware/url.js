var dedupe = require('../utils').dedupe,
    formatterFactory = require('../url-yui');

module.exports = function (config) {
    var yuiBuildDir = config.yuiBuildDir || '/build',
        yuiHost     = config.yuiHost || 'yui.yahooapis.com';

        formatters = {

            app: formatterFactory({
                host:       config.appHost || yuiHost
            }),

            core: formatterFactory({
                host:       yuiHost,
                secureHost: config.yuiHostSecure,
                buildDir:   yuiBuildDir
            }),

            // gallery modules over secure connections are not supported
            gallery: formatterFactory({
                host:       yuiHost,
                buildDir:   yuiBuildDir
            })

        };

    return function (req, res, next) {
        var groups = res.locals.groups,
            urls   = [],
            formatted,
            formatter,
            group,
            len,
            i;

        for (i = 0, len = groups.length; i < len; i += 1) {
            group         = groups[i];
            group.modules = dedupe(group.modules);
            formatter     = formatters[group.name];

            if (formatter) {
                formatted = formatter(group.modules, {
                    filter:  res.locals.filter,
                    version: group.version,
                    type:    res.locals.type,
                    secure:  req.comboSecure
                });
            } else {
                res.statusCode = 400;
                return next(new Error(
                    'A url formatter was not found for group: ' + group.name
                ));
            }

            if (formatted instanceof Error) {
                res.statusCode = 400;
                return next(formatted);
            }

            group.urls = formatted;
            urls = urls.concat(formatted);
        }

        res.locals.urls = urls;

        next();
    };
};
