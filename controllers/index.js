'use strict';

var IndexModel = require('../models/index');


module.exports = function (router) {

  var model = new IndexModel();

  router.get('/', function (req, res) {

    res.render('index', model);

  });
  router.get('/testemail', function (req, res) {

    model.subject = 'Test email';
    res.render('emails/test', model);

  });

};
