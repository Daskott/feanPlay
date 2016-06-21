
var app = angular.module('app');

app.controller('PostsCtrl', function ($scope,  $firebaseArray, $http, PostsService, UserService) {

  $scope.postSelection = 0;
  $scope.question = null;
  $scope.answer = null;
  
  //apparently you need to use an object & not a primitive 
  //to store filechooser value, else it won't work /0\
  $scope.upload = {};
  //$scope.upload.file = "C:\\Users\\cottee2\\Desktop\\flex.png";

  //get reference to our posts in the database
  var databaseRef = firebase.database().ref().child('posts');

  //get post & update UI
  $scope.posts = $firebaseArray(databaseRef);
  
  //NEEDS IMPROVEMENT, UPLOAD IMAGE SEPERATELY & SHOW USER PROGRESS
  //save post to realTime db
  $scope.addPost = function () {

    var file = document.getElementById('input').files[0];
    var text = $scope.postBody;
    // Get a key for a new Post
    var newPostKey = firebase.database().ref('posts').push().key;
    
    //give the illusion that its fast..lol
    //clear text of post
    $scope.postBody = null;

    //clear image selection
    document.getElementById('input').value = '';


    //upload img if any 1st
    $scope.handleFileUpload(file, newPostKey, function(error, imgUrl){
      
      if(file && error)
          console.log("there was an error uploading your image")
      
      //if post is Text
      if($scope.postSelection === 0){

        if(text){
          writeNewPost(
            $scope.currentUser.uid,
            $scope.currentUser.username,
            $scope.currentUser.fullname,
            "Post-Title",
            text,
            "Text",
            "No-tags",
            imgUrl,
            $scope.currentUser.color,
            newPostKey
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
            $scope.currentUser.color,
            newPostKey
          );
          //clear input field
          $scope.question = null;
          $scope.answer = null;
        }
     }
    });
  }

  $scope.handleFileUpload = function(file, key, callback){

    if(file){
      
      console.log("File: "+file.name);
      // Create a root reference
      var storageRef = firebase.storage().ref('posts_photos/'+$scope.currentUser.uid);
      //var key = storageRef.push().key;

      // Create a reference to 'img.jpg' bt use post 'key' 
      // as name/id, so each upload is unique
      var photoRef = storageRef.child(key);

      var uploadTask = photoRef.put(file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function(snapshot){
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
             break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
        callback(error, null);
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log("Done: "+downloadURL);
        callback(null, downloadURL);
        });
      }
      else{
        //callback with no imageUrl & error
        callback(null, "");   
      }
  }

  $scope.isValidPost = function(){
    //if it's a 'Text' post
    if($scope.postSelection === 0){
      if($scope.postBody)
        return true;
      else
        return false;
    }
    //if it's a 'k-bit' post
    else if($scope.postSelection === 1){
      if($scope.question && $scope.answer)
        return true;
      else
        return false;
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
    var currentUsername = $scope.currentUser.username;
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

        //if you like your post, no need to notify yourself
        if($scope.currentUser.uid !== post.uid)
          $scope.notify(" liked your post", post.uid, post.key);
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

  $scope.notify = function(message, recepientId, postId){
    UserService.notify(
      $scope.currentUser.uid,
      $scope.currentUser.username,
      message,
      recepientId,
      timeOffEvent(),
      postId
      );
  }

  $scope.setPostType = function(postSelection){
    $scope.postSelection = postSelection;
  }

  $scope.isSelectedPost = function(postSelection){
    return $scope.postSelection === postSelection;
  }

  $scope.tags = [
    { "text": "Joke" },
    { "text": "Riddle" },
  ];

  $scope.loadTags = function(query) {
    return $http.get('tags.json');
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

function timeOffEvent(){

  var date = new Date();
  var currMonth = months[date.getMonth() + 1];
  var time = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+timeStamp();

  return time;
}

function writeNewPost(uid, username, fullname, title, body, type, tags, image, color, key) {
    //get time of post
    var date = new Date();
    var currMonth = months[date.getMonth() + 1];
    var time = timeOffEvent();//currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+timeStamp();

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
      key:key,
      voteCount:0,
      votes:{},
      uid: uid
    }

    // // Get a key for a new Post.
    // var newPostKey = firebase.database().ref('posts').push().key;
    // postData.key = newPostKey;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + postData.key] = postData;
    updates['/user-posts/' + uid + '/' + postData.key] = postData;
    return firebase.database().ref().update(updates);
}
