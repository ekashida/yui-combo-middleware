var MIME_TYPES = {
    'css' : 'text/css',
    'js'  : 'application/javascript'
};

var MAX_AGE = 60 * 60 * 24 * 365; // seconds per year

module.exports = function (config) {
    config = config || {};

    /**
    Invoked when the request is done.

    Adds appropriate headers, sends content, and terminates the request. Fails
    if there is no content under `res.locals.body`.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        if (!res.locals.body) {
            res.statusCode = 500;
            return next(new Error('Done but no body'));
        }

        var mimeType     = MIME_TYPES[res.locals.type],
            nextYear     = Date.now() + (MAX_AGE * 1000), // ms
            expires      = (new Date(nextYear)).toUTCString(),
            cacheControl = 'public,max-age=' + MAX_AGE,
            contentType;

        // Default to JavaScript content type.
        mimeType    = mimeType || MIME_TYPES.js;
        contentType = mimeType + ';charset=utf-8';

        // http://code.google.com/speed/page-speed/docs/caching.html

        // Cache headers for ESI input (ESI document).
        res.setHeader('Cache-Control', cacheControl);
        res.setHeader('Expires', expires);

        res.setHeader('Content-Type', contentType);
        res.setHeader('Vary', 'Accept-Encoding');

        res.statusCode = 200;
        res.end(res.locals.body);
    };
};
