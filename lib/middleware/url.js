var dedupe  = require('../utils').dedupe,
    yuiPath = require('../yui-path'),

    YUI_CDN_BASE = 'http://yui.yahooapis.com/';

module.exports = function (config) {
    config = config || {};

    // 1) If the application module's base url is unspecified, we assume that
    //    those modules should be retrieved from the same base url that
    //    core/gallery YUI modules are retrieved from.
    // 2) If a secure version of a base url is not specified, we assume that we
    //    should use the corresponding non-secure base url.
    var yuiBase         = config.yuiBase        || YUI_CDN_BASE,
        appBase         = config.appBase        || yuiBase,
        yuiBaseSecure   = config.yuiBaseSecure  || yuiBase,
        appBaseSecure   = config.appBaseSecure  || appBase;

    /**
    Transforms YUI module metadata into URLs.
    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        var groups  = res.locals.groups,
            urls    = [],
            modules,
            group,
            path,
            base;

/*jslint vars: true*/
        for (var i = 0; i < groups.length; i += 1) {
            group = groups[i];

            if (req.comboSecure) {
                base = (group.name === 'app') ? appBaseSecure : yuiBaseSecure;
            } else {
                base = (group.name === 'app') ? appBase : yuiBase;
            }

            modules = dedupe(group.modules);
            for (var j = 0; j < modules.length; j += 1) {
/*jslint vars: false*/
                path = yuiPath.format(
                    group.version,
                    modules[j],
                    res.locals.filter,
                    res.locals.type
                );

                if (path instanceof Error) {
                    res.statusCode = 400;
                    return next(path);
                }

                urls.push(base + path);
            }
        }

        res.locals.urls = urls;

        next();
    };
};
