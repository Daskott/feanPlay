
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, PostsService, UserService) {

  $scope.postSelection = 0;
  $scope.question = null;
  $scope.answer = null;
  
  //get reference to our posts in the database
  var databaseRef = firebase.database().ref().child('posts');

  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);


  //save post to realTime db
  $scope.addPost = function () {

      //if post is Text
      if($scope.postSelection === 0){

        if($scope.postBody){
          writeNewPost(
            $scope.currentUser.uid, 
            $scope.currentUser.username,
            $scope.currentUser.fullname,
            "Post-Title", 
            $scope.postBody,
            "Text",
            "No-tags",
            $scope.photo || "", 
            $scope.currentUser.color
          );

          //clear input field
          $scope.postBody = null;
        }
      }
       //if post is K-bits
      else if($scope.postSelection === 1){
        
        if($scope.question && $scope.answer){
          writeNewPost(
            $scope.currentUser.uid, 
            $scope.currentUser.username,
            $scope.currentUser.fullname,
            $scope.question, 
            $scope.answer,
            "K-bits",
            $scope.tags,
            $scope.photo || "", 
            $scope.currentUser.color
          );
          //clear input field
          $scope.question = null;
          $scope.answer = null;
        }

        console.log( $scope.tags);
     }
      
    
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
  
  $scope.toggleVote = function(postId, userId){

    var postRef = firebase.database().ref().child('posts/'+postId);
    //var userPostRef = firebase.database().ref().child('user-posts/' + userId+'/'+postId);
    var currUserId = $scope.currentUser.uid;
    
    //update public posts
    postRef.transaction(function(post) {
      if (post.votes && post.votes[currUserId]) {
        post.voteCount--;
        post.votes[currUserId] = null;
      } else {
        post.voteCount++;
        if (!post.votes) {
          post.votes = {};
        }
        post.votes[currUserId] = true;
      }
      
      //update specific user's post 'voteCount' & votes
      firebase.database().ref()
      .child('user-posts/' + userId+'/'+postId+'/votes/'+currUserId)
      .set(post.votes[currUserId]);

      firebase.database().ref()
      .child('user-posts/' + userId+'/'+postId+'/voteCount')
      .set(post.voteCount);

      return post;
    });
  }

  $scope.votedThisPost = function(postVotes){ 
      if(postVotes && postVotes[$scope.currentUser.uid])
        return true;
      else
        return false;
  }

  $scope.setPostType = function(postSelection){
    $scope.postSelection = postSelection;
  }

  $scope.isSelectedPost = function(postSelection){
    return $scope.postSelection === postSelection;
  }

  $scope.tags = [
            { text: 'Joke' },
            { text: 'Science' },
            { text: 'Music' },
          ];
  $scope.loadTags = function(query) {
    return $http.get('/tags?query=' + query);
  };

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

  function writeNewPost(uid, username, fullname, title, body, type, tags, image, color) {
    //get time of post
    var date = new Date();
    var currMonth = months[date.getMonth() + 1];
    var time = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+timeStamp();

    // A post entry.
    var postData = {
      username: username,
      fullname: fullname,
      title: title,
      body: body,
      type: type,
      tags: tags,
      image: image,
      color: color,
      time: time,
      key:"",
      voteCount:0,
      votes:{},
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



