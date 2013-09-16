var lib = {
    http: require('http')
};

/*jshint unused:false*/
module.exports = function (config) {
    config = config || {};

    /**
    Default error handler.

    Changes 200 status codes to 500 and logs useful error messages.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (err, req, res, next) {
        var code = (+res.statusCode === 200) ? 500 : res.statusCode;

        // Prevent this from logging during tests.
        err = err || '';
        if (err) {
            console.error('[ERROR]', err.stack || err);
        }

        res.statusCode = code;
        res.end(
            lib.http.STATUS_CODES[code] + '. ' + err.message
        );
    };
};
