var lib = {
    http: require('http')
};

/*jshint unused:false*/
module.exports = function (config) {
    config = config || {};

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
