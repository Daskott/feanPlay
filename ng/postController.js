
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService, UserService) {

  $scope.postSelection = 0;
  
  //get reference to our posts in the database
  var databaseRef = firebase.database().ref().child('posts');

  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);


  //save post to realTime db
  $scope.addPost = function () {

      if($scope.postBody){
        writeNewPost($scope.currentUser.uid, $scope.currentUser.username,$scope.currentUser.fullname,
                     $scope.postBody, $scope.photo || "", $scope.currentUser.color);
      }
      //clear input field
      $scope.postBody = null;
  }



  //see only posts from users ur following
  $scope.isPostForMe = function(username, userid){
      //stop binding data, when user logsout
      if(!$scope.currentUser)return;

      //see ur posts
      if($scope.currentUser.uid === userid)return true;

      // //see posts of users ur following
      return UserService.isFollowing(username);
  }



   $scope.setPostType = function(postSelection){
    $scope.postSelection = postSelection;
  }

  $scope.isSelectedPost = function(postSelection){
    return $scope.postSelection === postSelection;
  }



  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      databaseRef.off();
    }
  })

});


  /**************************************
  helper functions
  ****************************************/
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function timeStamp() {

    var now = new Date();

    // Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

    // Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

    // Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";

    // Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

    // If hour is 0, set it to 12
    time[0] = time[0] || 12;

    // If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
      if ( time[i] < 10 ) {
        time[i] = "0" + time[i];
    }
  }

  // Return the formatted string [/*date.join("/") + " " +*/ ]
  return time.join(":") + " " + suffix;
}

  function writeNewPost(uid, username, fullname, body, image, color) {
    //get time of post
    var date = new Date();
    var currMonth = months[date.getMonth() + 1];
    var time = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+timeStamp();

    // A post entry.
    var postData = {
      username: username,
      fullname: fullname,
      body: body,
      image: image,
      color: color,
      time: time,
      key:"",
      voteCount:0,
      uid: uid
    }

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref('posts').push().key;
    postData.key = newPostKey;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    return firebase.database().ref().update(updates);
}
