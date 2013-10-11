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
            filter  = res.locals.filter,
            type    = res.locals.type,
            urls    = [],
            modules,
            version,
            group,
            name,
            path,
            base,
            i,
            j;

        for (i = 0; i < groups.length; i += 1) {
            group   = groups[i];
            version = group.version;
            name    = group.name;
            modules = dedupe(group.modules);

            if (name === 'core' || name === 'gallery') {
                base = req.comboSecure ? yuiBaseSecure : yuiBase;
            } else {
                base = req.comboSecure ? appBaseSecure : appBase;
            }

            if (name === 'core' || name === 'root' || name === 'gallery') {
                for (j = 0; j < modules.length; j += 1) {
                    path = yuiPath.format(version, modules[j], filter, type);

                    if (path instanceof Error) {
                        res.statusCode = 400;
                        return next(path);
                    }

                    urls.push(base + path);
                }
            } else {
                for (j = 0; j < modules.length; j += 1) {
                    path = version ? version + '/' : '';
                    path += modules[j] + '.' + type;
                    urls.push(base + path);
                }
            }
        }

        res.locals.urls = urls;

        next();
    };
};
