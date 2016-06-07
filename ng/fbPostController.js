// var app = angular.module('app');
// app.run(function ($rootScope) {
	
//   // Initialize Firebase
//   var config = ""

//   var app = firebase.initializeApp(config);
//   var database = app.database();
//   var auth = app.auth;
//   var storage = app.storage();

//   //get reference to our posts in the database
//   var databaseRef = database.ref().child('posts');

//   //send new post to postcontroller
//   databaseRef.on('child_added', function(snapshot){
//     var post = snapshot.val();
//     $rootScope.$broadcast('fb:new_post', post); //update UI
//   });
  
// });
