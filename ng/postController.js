
var app = angular.module('app');

//dependency inject 'PostsService' & '$scope'
//basically, '$scope' is like 'this'
app.controller('PostsCtrl', function ($scope, PostsService) {

  //get posts
  PostsService.fetch().success(function (posts) {
    $scope.posts = posts;
  });

  $scope.addPost = function () {

    //push item to db & to top of array( if insert succesful)
    if($scope.postBody){ //get curr user name
      PostsService.create({body: $scope.postBody }).success(function (posts) {
        //$scope.posts.unshift( { username: $scope.currentUser.username, body: $scope.postBody });
        $scope.postBody = null; //clear input field
      });
    }
  }

  $scope.$on('ws:new_post', function (_, post) { 
      console.log('GOT IT');
      $scope.$apply(function () { 
        $scope.posts.unshift(post) 
      }); 
  });

});
