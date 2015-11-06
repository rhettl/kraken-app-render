/**
 * Created by rhett on 10/27/15.
 */
'use strict';

var email = require('./email');

var noop = function () {
};

module.exports = {
  sendEmails: function(){

    /*
        This is what the send would look like if it were to be used
    */

    //email.send('test', {
    //  subject: 'test subject'
    //}, {
    //  to     : 'rng2ml@gmail.com',
    //  subject: 'test subject'
    //},
    //function(err, res){
    //  if (err) {
    //    throw err;
    //  } else {
    //    console.log(res);
    //  }
    //});

    console.log('Sending email...');
    email.render('test', {
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

  },

  init: function () {

    module.exports.sendEmails();

  }
};



