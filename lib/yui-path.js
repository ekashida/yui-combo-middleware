// Mapping between the requested filter and the string that should be appended.
var FILTER_TO_APPEND = {
    debug: '-debug',
    raw:   '',
    min:   '-min'
};

/**
Formats path components into a path.
@method format
@param {String} version Group version.
@param {String} name Module name.
@param {String} filter Module filter.
@param {String} type File type.
**/
exports.format = function (version, name, filter, type) {
    var pathname,
        parts,
        skin;

    if (!version || !name || !filter || !type) {
        return new Error('Missing a path component');
    }

    if (type !== 'js' && type !== 'css') {
        return new Error('Invalid file type ' + type);
    }

    pathname = [version];

    if (name.indexOf('skin-') === 0) {
        // Note: Skins have a different directory structure and also do not
        // make use of filters. `assets/{name}-core.css` and
        // `assets/skins/{skin}/{name}-skin.css` are concatenated and minified
        // to produce `assets/{skin}/{name}.css`.

        parts = name.split('-'); // ['skin', 'sam', 'widget', 'base']
        parts.shift();           // ['sam', 'widget', 'base']
        skin = parts.shift();    // skin => 'sam'
        name = parts.join('-');  // name => 'widget-base'

        // 3.11.0/widget-base/assets/skins/sam/widget-base.css
        pathname.push(name, 'assets', 'skins', skin, name + '.' + type);
    } else if (name.indexOf('lang/') === 0) {
        // Note: Lang packs have a different directory structure and
        // also do not make use of filters (min by default).

        // lang/autocomplete-list_en => autocomplete-list_en
        parts = name.split('/').pop();
        // autocomplete-list_en => autocomplete-list
        parts = parts.split('_');
        parts.pop();

        // 3.11.0/autocomplete-list/lang/autocomplete-list_en.js
        pathname.push(parts.join('_'), name + '.' + type);
    } else {
        // Default to `min` if the filter is unrecognized.
        filter = FILTER_TO_APPEND[filter];
        if (filter === undefined) {
            filter = FILTER_TO_APPEND.min;
        }

        // 3.11.0/node/node-min.js
        pathname.push(name, name + filter + '.' + type);
    }

    return pathname.join('/');
};
