/**
 * Created by rhett on 10/21/15.
 */
'use strict';

var extend            = require('extend');
var makara            = require('makara');
var engineMunger      = require('engine-munger');
var nodemailer        = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

//TODO: Add node debugger and replace console.log statements
//TODO: Add debugger at `module.exports.debug`

var baseDefaults         = {};
var baseTemplateDefaults = {};

module.exports = {
  __app             : null,
  __view            : null,
  __transport       : null,
  __cache        : {},
  __defaults        : {},
  __templateDefaults: {},
  /**
   * Set mailtransport and be ready to send emails.
   * @param app  {object} kraken/express application
   * @param conf {object} configuration settings from config.js
   */
  config            : function (app, conf) {
    if (!app || !app.render) {
      throw new Error('There is no render function. Please fix it. Fix it, fix it now!');
    }

    var transOpts = conf.get('mailtransport');
    var mailOpts = conf.get('email');
    var i18nOpts = conf.get('i18n');
    var specOpts = conf.get('specialization');

    if (!transOpts || !transOpts.name || !module.exports['__' + transOpts.name]) {
      throw new Error('No transport has been named or named transport doesn\'t exist.');
    }

    module.exports.__app              = app;
    module.exports.__view             = this.__makeView(i18nOpts, specOpts);
    module.exports.__transport        = module.exports['__' + transOpts.name](transOpts.options);
    module.exports.__defaults         = extend({}, baseDefaults, mailOpts.defaults || {});
    module.exports.__templateDefaults = extend({}, baseTemplateDefaults, mailOpts.templateDefaults || {});

    console.log('Mail Transport Ready');
  },
  __makeView        : function (i18n, specialization) {
    var opts            = {};
    opts['.properties'] = {};
    opts['.js']         = {};
    opts['.dust']       = {};


    if (i18n) {
      opts['.properties'].root = [].concat(i18n.contentPath);
      opts['.properties'].i18n = {
        formatPath: i18n.formatPath || makara.formatPath,
        fallback  : i18n.fallback
      };
    }

    if (specialization) {
      opts['.properties'].specialization = specialization;
      opts['.js'].specialization         = specialization;
      opts['.dust'].specialization       = specialization;
    }
    return engineMunger(opts);
  },

  __newView: function (name) {


    var view = new module.exports.__view(name, {
      defaultEngine: module.exports.__app.get('view engine'),
      root         : module.exports.__app.get('views'),
      engines      : module.exports.__app.engines
    });

    if (!view.path) {
      var dirs = Array.isArray(view.root) && view.root.length > 1
        ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
        : 'directory "' + view.root + '"';
      var err  = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
      err.view = view;
      throw err;
    }

    return view;
  },

  __sendmail: function (options) {
    return nodemailer.createTransport(sendmailTransport(options));
  },


  render: function (template, data, callback) {
    if (typeof data === 'function') {
      if (!callback) {
        callback = data;
        data     = {};
      } else if (typeof callback === 'function') {
        //noinspection JSUnresolvedFunction
        data = data() || {}; // <= put something here ??
      }
    }

    var cache    = module.exports.__cache;
    var tempData = extend({}, module.exports.__templateDefaults, data);
    var name     = 'emails/' + template;
    var view;

    if (tempData.cache == null) {
      tempData.cache = module.exports.__app.enabled('view cache');
    }
    if (tempData.cache) {
      view = cache[name];
    }

    try {
      view = view || this.__newView(name);

      // prime the cache
      if (tempData.cache) {
        cache[name] = view;
      }

      view.render(tempData, callback);
    } catch (err) {
      callback(err);
    }
  },

  send: function (template, templateData, mailOptions, callback) {
    module.exports.render(template, templateData, function (err, html) {
      console.log('here I am');
      if (err) {
        return callback(err);
      }

      var optionsCombined = extend({html: html}, module.exports.__defaults, mailOptions);
      //console.log(html, optionsCombined);


      console.log(optionsCombined);
      module.exports.__transport.sendMail(optionsCombined, callback || function () {
        });
    });
  }

};
