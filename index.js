'use strict';

var express   = require('express');
var kraken    = require('kraken-js');
var email     = require('./lib/email');
var emailCtrl = require('./lib/emailController');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function (config, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */
    next(null, config);
  }
};

app = module.exports = express();
app.use(kraken(options));
app.on('start', function () {
  console.log('Application ready to serve requests.');
  console.log('Environment: %s', app.kraken.get('env:env'));

  /* To test that the same thing happens without my email extension,
   * uncomment below and comment `emailCtrl.init();`
   */

  email.config(app, app.kraken);
  emailCtrl.init();
  //console.log(app.get('view').length);
  //renderTest(app);
});




function renderTest(app) {
  app.render('emails/test', {
    subject: 'test subject'
  }, function(err, res){
    console.log('... Email sent with:');
    if (err) {
      console.log('an error');
      console.error(err.stack);
      throw err;
    } else {
      console.log('no errors, ');
      console.log(res);
    }
  });
}
