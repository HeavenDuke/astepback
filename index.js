/**
 * Created by Obscurity on 2016/7/14.
 */

module.exports = function (options) {
    var options = options || {};
    var key = options.key || 'koa-asb';

    return function *asb(next) {

        if (this.session === undefined) throw new Error('astepback requires the koa-session middleware.');

        var data = this.session[key];

        var defaultValue = '/';

        Object.defineProperty(this, 'asb', {
            enumerable: true,
            get: function() {
                return data || defaultValue;
            },
            set: function(val) {
                this.session[key] = val;
            }
        });

        yield *next;
    };
};