/**
Dedupes an array of strings, returning an array that's guaranteed to
contain only one copy of a given string.

@method dedupe
@param {String[]} [array] Array of strings to dedupe.
@return {Array} Deduped copy of _array_.
**/
exports.dedupe = function (arr) {
    var hash    = {},
        deduped = [],
        item,
        len,
        i;

    for (i = 0, len = arr.length; i < len; i += 1) {
        item = arr[i];
        if (item && !hash[item]) {
            hash[item] = true;
            deduped.push(item);
        }
    }

    return deduped;
};

/**
Returns a new object containing all of the properties of all the
supplied objects. The properties from later objects will overwrite
those in earlier objects.

@method merge
@param {Objects} Objects to merge.
@return {Object} Merged object.
**/
exports.merge = function () {
    var args = Array.prototype.slice.call(arguments),
        to   = args.shift(),
        from,
        key,
        len,
        i;

    if (args.length) {
        for (i = 0, len = args.length; i < len; i += 1) {
            from = args[i];
            for (key in from) {
                if (from.hasOwnProperty(key)) {
                    to[key] = from[key];
                }
            }
        }
    }

    return to;
};
