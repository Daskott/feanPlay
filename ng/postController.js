
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService) {


/************************************************************

FireBase Implementation

**************************************************************/

  //var database = app.database();
  //var auth = app.auth();
  //var storage = app.storage();

  //get reference to our posts in the database
  var databaseRef = firebase.database().ref().child('posts');
 
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);
  
  //save post to realTime db
  $scope.addPost = function () {
    var date = new Date();
    var currMonth = months[date.getMonth() + 1];
    var timeStamp = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+date.toLocaleTimeString();

    //console.log($scope.photo.text);
    //$scope.handleFileUpload($scope.photo);

    if($scope.postBody){

        var post = {
          username: $scope.currentUser.username,
          body: $scope.postBody,
          image: $scope.photo || "",
          time: timeStamp 
        }
        databaseRef.push().set(post);
        $scope.postBody = null; //clear input field
    }
  }

  // $scope.handleFileUpload = function(photo){
  //   var storageRef = firebase.storage().ref().child('posts_photos');
  //   var imageRef; 
  //   console.log(photo);
  //   if(photo){
  //     imageRef = storageRef.child(photo);
  //     var uploadTask = imageRef.put(photo);
  //   } 

  // }

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
