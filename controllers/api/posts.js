var express = require('express');
var Post = require('../../models/posts');
var router = express.Router();
var websockets = require('../../websockets');

router.get('/', function (req, res, next) {

  //put recent post at the top with 'sort'
  Post.find().sort('-date').exec(function(err, posts) {
    if (err) {
      return next(err);
    }
    res.json(posts);
  });

});

router.post('/', function (request, response, next) {
  var post = new Post({body: request.body.body});
  post.username = request.auth.username; 
  console.log('post recieved!');
  post.save(function(error, post){
    if(error)
      return next(error);
    else
      websockets.broadcast('new_post', post);
      response.status(201).json(post); //201 - created
  });

});

module.exports = router;
