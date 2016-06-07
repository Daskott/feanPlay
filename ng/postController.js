
var app = angular.module('app');


//dependency inject 'PostsService' & '$scope'
//basically, '$scope' is like 'this'
app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService) {



/************************************************************

Websockets Implementation

**************************************************************/

/*
  //get posts from mongo
  PostsService.fetch().success(function (posts) { //then[when testing]
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
  */

/************************************************************

FireBase Implementation

**************************************************************/

 
//  {
//   "rules": {
//     ".read": "auth != null",
//     ".write": "auth != null"
//   }
// }

  // Initialize Firebase
  var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
  };//require(__dirname + '/../config');

  var app = firebase.initializeApp(config);
  var database = app.database();
  var auth = app.auth();
  var storage = app.storage();

  //get reference to our posts in the database
  var databaseRef = database.ref().child('posts');
  //$scope.posts = [];

  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);
  
  //$scope.posts.unshift({ username: "tester", body: "testing" })
  //display posts [listen for child nodes get added to the collection]
  // databaseRef.on('child_added', function(snapshot){
  //   var post = snapshot.val();
  //   //$scope.updatePost(post);
  //   //$scope.$emit('fb:new_post', post);
  //   console.log(post);
  //   $scope.posts.unshift(post); //update UI
  // });


  //save post to realTime db
  $scope.addPost = function () {
    var timeStamp = new Date().getTime();
    if($scope.postBody){

        var post = { 
          username: $scope.currentUser.username, 
          body: $scope.postBody,
          time: timeStamp
        }
        databaseRef.push().set(post);
        $scope.postBody = null; //clear input field
    }
  }

  /******************************************
  * User authentication with firebase
  *******************************************/

  //login auth
  $scope.google = function(){
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $scope.currentUser.username = user.displayName;
    } else {
      // No user is signed in.
    }
  });


});
