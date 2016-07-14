/**
 * Created by Obscurity on 2016/7/14.
 */

module.exports = function (opts) {
    var opts = opts || {};
    var key = opts.key || 'koa-asb';
    var defaultPath = opts.defaultPath || '/';

    return function *asb(next) {

        if (this.session === undefined) throw new Error('astepback requires the koa-session middleware.');

        var data = this.session[key];

        Object.defineProperty(this, 'asb', {
            enumerable: true,
            get: function() {
                return data || defaultPath;
            },
            set: function(val) {
                this.session[key] = val;
            }
        });

        yield *next;
    };
};