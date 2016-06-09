var app = angular.module('app');

app.service('PostsService', function($http){

  //get posts
  this.fetch = function(){
    return $http.get('/api/posts');
  }

  //create posts
  this.create = function(post){
    return $http.post('/api/posts', post);
  }

});
