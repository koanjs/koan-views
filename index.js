'use strict';

/**
 * Dependencies
 */
var debug = require('debug')('koan-views');
var render = require('co-render');
var path = require('path');
var co = require('co');

/**
 * Environment
 */
var env = process.env.NODE_ENV || 'development';

/**
 * Pass views `dir` and `options` to return
 * a render function.
 *
 *  - `map` an object mapping extnames to engine names [{}]
 *  - `default` default extname to use when missing [html]
 *  - `cache` cached compiled functions [NODE_ENV != 'development']
 *
 * @param {String} [dir]
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */
module.exports = function(dir, options) {
  options = options || {};

  debug('views %s %j', dir, options);

  // View directory
  dir = dir || 'views';

  // Default extname
  var ext = options.ext || options.default || 'html';

  // Engine map
  var map = options.map || {};

  // Cache compiled templates
  var cache = options.cache;
  if (null == cache)
    cache = 'development' != env;

  // Default layout
  var defaultLayout = options.defaultLayout;

  return function(view, locals, layout) {
    locals = locals || {};
    layout = layout || defaultLayout;

    // Make `locals` optional
    if ((typeof locals == 'string')||(locals instanceof String)) {
      layout = locals;
      locals = {};
    }

    // Default extname
    var e = path.extname(view);

    if (!e) {
      e = '.' + ext;
      view += e;
      if (layout)
        layout += e;
    }

    // Remove leading '.'
    e = e.slice(1);

    // Map engine
    locals.engine = map[e] || e;

    // Cache
    locals.cache = cache;

    // Resolve view
    view = path.join(dir, view);

    var renderBody;

    if (layout) {
      debug('render %s %j', view, locals);
       
      // Yielded view rendering
      renderBody = co(function*() {
        debug('render %s %j', view, locals);
        var body = yield render(view, locals);

        return body;
      });

      // Resolve layout
      layout = path.join(dir, layout);
    }
    else
      layout = view;

    return function(done) {
      if (renderBody) {
        renderBody(function(err, body) {
          if (err)
            return done(err);

          locals.body = body;

          debug('render %s %j', layout, locals);
          render(layout, locals)(done);
        });
      }
      else
        render(layout, locals)(done);
    }
  };
};
