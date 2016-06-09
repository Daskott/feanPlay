
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService, UserService) {


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

  // databaseRef.on('child_added', function(snapshot) {
  //   // $scope.$apply(function() {
  //   //   $scope.posts.unshift(snapshot.val());
  //   // });
  //   console.log(snapshot.val());
  // });

  //save post to realTime db
  $scope.addPost = function () {
    var date = new Date();
    var currMonth = months[date.getMonth() + 1];
    var time = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+date.toLocaleTimeString();
    var pid =  generatePostId ($scope.currentUser.username);
    //console.log($scope.photo.text);
    //$scope.handleFileUpload($scope.photo);

    if($scope.postBody){

        var post = {
          username: $scope.currentUser.username,
          body: $scope.postBody,
          image: $scope.photo || "",
          time: time,
          timeStamp:date.getTime(),
          pid: pid,
          uid: $scope.currentUser.uid
        }

        firebase.database().ref('posts/' + post.pid).set(post);
        // databaseRef.push().set(post);
        $scope.postBody = null; //clear input field
    }
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      databaseRef.off();
    }
  })

  //see only posts from users ur following
  $scope.isPostForMe = function(userid){
      //stop binding data, when user logsout
      if(!$scope.currentUser)return; 
      
      //see ur posts
      if($scope.currentUser.uid === userid)return true;

      //see posts of users ur following
      return UserService.isFollowing(userid);
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

});


  /**************************************
  helper functions
  ****************************************/
  function generatePostId (username){
    var date = new Date();
    return (username)+""+date.getTime()+""+Math.floor((Math.random() * 100) + 1);
  }
