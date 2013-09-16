var lib = {
    url: require('url')
};

module.exports = function (config) {
    config = config || {};

    return function (req, res, next) {
        if (!req.query || !req.path) {
            // `true` enables query param parsing.
            var url = lib.url.parse(req.url, true);

            // Make parsed query params available downstream.
            req.query = url.query;

            // Make path available downstream.
            req.path = url.pathname;
        }

        // Initialize a namespace for the current request.
        res.locals = res.locals || {};

        next();
    };
};
