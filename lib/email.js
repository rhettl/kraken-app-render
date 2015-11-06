/**
 * Created by rhett on 10/21/15.
 */
'use strict';

var extend            = require('extend');
var nodemailer        = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

//TODO: Add node debugger and replace console.log statements
//TODO: Add debugger at `module.exports.__d

var baseDefaults         = {};
var baseTemplateDefaults = {

  /* These defaults were added to see if they would fix the problem;
   * They did not */
  _locals      : {
    context: {
      locale: 'en-US'
    }
  },
  contentLocale: {
    locale: 'en-US'
  }
};

module.exports = {
  __transport       : null,
  __render          : null,
  __app             : null,
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
    if (!conf || !conf.name || !module.exports['__' + conf.name]) {
      throw new Error('No transport has been named or named transport doesn\'t exist.');
    }

    module.exports.__app              = app;
    module.exports.__render           = app.render.bind(app);
    module.exports.__transport        = module.exports['__' + conf.name](conf.options);
    module.exports.__defaults         = extend({}, baseDefaults, conf.defaults);
    module.exports.__templateDefaults = extend({}, baseTemplateDefaults, conf.templateDefaults);
    console.log('Mail Transport Ready');
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

    var tempData = extend({}, module.exports.__templateDefaults, data);

    try {
      module.exports.__render('emails/' + template, tempData, callback);
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
