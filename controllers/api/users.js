var express = require('express');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var User = require('../../models/users');
var router = express.Router();
var config = require('../../config');

router.get('/', function (req, res) {
  var token = req.headers['x-auth']; //dont rili get
  var auth = jwt.decode(token, config.secret);

  User.findOne({username: auth.username}, function(err, user){
    if (err) { return next(err); }
    if (!user) { return res.send(401); }
    res.json(user);
  });

});


router.post('/', function (req, res, next) {
  var user = new User({username: req.body.username});
  console.log('call create');
  bcrypt.hash(req.body.password, 10, function (err, hash){
    user.password = hash;
    user.save(function (err, user) {
      if (err) {
        throw next(err)
      }
      res.sendStatus(201)
    })
  })
});

module.exports = router;
