var lib = {
    url: require('url')
};

// Mapping between the requested filter and the string that should be appended.
var FILTER_TO_APPEND = {
    debug: '-debug',
    raw:   '',
    min:   '-min'
};

/**
Expands a list of YUI module names into their CDN URLs.

@method expand
@param {String[]} [modules] Array of module names.
@param {Object} [config] Configuration object.
@param {String} [config.filter] Filter type `min`, `debug`, or `raw`. Defaults
    to `min`.
@param {String} [config.type] File type `js` or `css`. Defaults to `js`.
@param {String} [config.version] YUI version.
@return {Array} Array of module URLs.
**/
module.exports = function (conf) {
    return function (mods, config) {
        var pathname,
            protocol,
            version,
            filter,
            parts,
            host,
            skin,
            name,
            len,
            i;

        config = config || {};

        if (!config.type || !config.version) {
            return new Error('Type and version required');
        }

        // Default to `min` if the filter is unrecognized.
        filter = FILTER_TO_APPEND[config.filter];
        if (filter === undefined) {
            filter = FILTER_TO_APPEND.min;
        }

        // Use the secure host for secure requests, if it is available.
        if (config.secure && conf.secureHost) {
            host        = conf.secureHost;
            protocol    = 'https';
        } else {
            host        = conf.host;
            protocol    = 'http';
        }

        for (i = 0, len = mods.length; i < len; i += 1) {
            name     = mods[i];
            version  = config.version + (conf.buildDir || '');
            pathname = version + '/';

            // Note: Skins have a different directory structure and also do not
            // make use of filters. `assets/{name}-core.css` and
            // `assets/skins/{skin}/{name}-skin.css` are concatenated and
            // minified to produce `assets/{skin}/{name}.css`.
            if (name.indexOf('skin-') === 0) {
                parts = name.split('-'); // ['skin', 'sam', 'widget', 'base']
                parts.shift();           // ['sam', 'widget', 'base']
                skin = parts.shift();    // skin => 'sam'
                name = parts.join('-');  // name => 'widget-base'

                // 3.11.0/widget-base/assets/skins/sam
                pathname += name + '/assets/skins/' + skin;
                // 3.11.0/widget-base/assets/skins/sam/tabview.css
                pathname += '/' + name + '.' + config.type;
            } else if (name.indexOf('lang/') === 0) {
                // Note: Lang packs have a different directory structure and
                // also do not make use of filters (min by default).

                // lang/autocomplete-list_en => autocomplete-list_en
                name = name.split('/').pop();
                // autocomplete-list_en => autocomplete-list
                name = name.split('_').shift();

                // 3.11.0/autocomplete-list/lang/autocomplete-list_en.js
                pathname += name + '/' + mods[i] + '.' + config.type;
            } else {
                // 3.11.0/node
                pathname += name;
                // 3.11.0/node/node-min.js
                pathname += '/' + name + filter + '.' + config.type;
            }

            mods[i] = lib.url.format({
                protocol: protocol,
                host: host,
                pathname: pathname
            });
        }

        return mods;
    };
};
