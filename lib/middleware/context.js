module.exports = function (config) {
    config = config || {};

    /**
    Contextualize the request.

    Returns contextualized property:
      - `req.comboSecure` Whether the current request is secure. Enabled when
        requests are made over https. Can be forced using the query param
        `secure`.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        // Detect requests over secure connections.
        req.comboSecure = req.query.secure;
        req.comboSecure = req.comboSecure ||
            (req.headers.via || '').toUpperCase()
            .indexOf('HTTPS') > -1;

        next();
    };
};
