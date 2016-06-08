
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService) {


/************************************************************

FireBase Implementation

**************************************************************/


//  {
//   "rules": {
//     ".read": "auth != null",
//     ".write": "auth != null"
//   }
// }


  // var app = firebase.initializeApp(config);
  //var database = app.database();
  //var auth = app.auth();
  //var storage = app.storage();

  //get reference to our posts in the database
  var databaseRef = firebase.database().ref().child('posts');

  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);

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
  // $scope.google = function(){
  //   auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  // }
  //
  // auth.onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     $scope.currentUser.username = user.displayName;
  //   } else {
  //     // No user is signed in.
  //   }
  // });
  //

});
