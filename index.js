'use strict';

/**
 * Dependencies
 */
var debug = require('debug')('koan-views');
var render = require('co-render');
var path = require('path');

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

    if (layout) {
      debug('render %s %j', view, locals);
       
      // @todo yield
      locals.body = 'Yield to rendering!';//render(view, locals);

      // Resolve layout
      layout = path.join(dir, layout);
    }
    else
      layout = view;

    debug('render %s %j', layout, locals);
    return render(layout, locals);
  };
};
