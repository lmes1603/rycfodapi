var express = require('express');
var router = express.Router();

var dynamo = require('dynamodb');
const Joi = require('@hapi/joi');

dynamo.AWS.config.loadFromPath('credentials.json');

var Account = dynamo.define('Account', {
  hashKey : 'email',
 
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,
 
  schema : {
    email   : Joi.string().email(),
    name    : Joi.string(),
    age     : Joi.number(),
    roles   : dynamo.types.stringSet(),
    settings : {
      nickname      : Joi.string(),
      acceptedTerms : Joi.boolean().default(false)
    }
  }
});

router.get('/create', function(req, res, next) {
	dynamo.createTables(function(err) {
	  if (err) {
	    console.log('Error creating tables: ', err);
	  } else {
	    console.log('Tables has been created');
	  }
	});
  res.render('index', { title: 'Rycfod Api' });
});

module.exports = router;