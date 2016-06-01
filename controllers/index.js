var express = require('express');
var bodyParser = require('body-parser');
var postsRouter = require(__dirname+'/api/posts');
var staticRouter = require(__dirname+'/static');
var sessionRouter = require(__dirname+'/api/sessions');
var usersRouter = require(__dirname+'/api/users');

var router = express.Router();

router.use(bodyParser.json());
router.use(require('../auth'));
router.use('/api/sessions', sessionRouter);
router.use('/api/users', usersRouter);
router.use('/api/posts', postsRouter); //set api calls
router.use(staticRouter); //set static calls

module.exports = router;