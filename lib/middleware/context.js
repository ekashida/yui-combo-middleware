module.exports = function (config) {
    config = config || {};

    return function (req, res, next) {
        // Detect requests over secure connections.
        req.comboSecure = req.query.secure;
        req.comboSecure = req.comboSecure ||
            (req.headers.via || '').toUpperCase()
            .indexOf('HTTPS') > -1;

        next();
    };
};
