//just define module & its dependencies
var app = angular.module('app', [
  'ngRoute',
  'ngCookies',
  'firebase'
  // 'angularFileUpload',
]);

angular.module('app')
.controller('ApplicationCtrl', function ($scope, $rootScope, $location, UserService) {

  //when user refreshes page, mk sure use is set
  $scope.currentUser =  $rootScope.globals.currentUser;

  //when user logs in, receive signal on login
  $scope.$on('login', function () {
     $scope.currentUser = $rootScope.globals.currentUser;
  });

  $scope.logout = function () {
    UserService.clearCredentials();
    $location.path('/'); //go back to sigin page
    $scope.currentUser = null;

    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signed out");
    }, function(error) {
      // An error happened.
    });
  }

 });

'use strict'

var app = angular.module('app');

app.controller('ConnectCtrl', function ($scope,  $firebaseArray, UserService) {

	var databaseRef = firebase.database().ref().child('users');
	
	//get users & update UI
  	$scope.users = $firebaseArray(databaseRef);
  	
  	$scope.toggleFollow = function(user){
  		var following = $scope.isFollowing(user.uid);
  		selectedUser = {username:user.username, uid:user.uid};

  		if(following){

			//delete followee
			firebase.database().ref('users/' + $scope.currentUser.uid+'/followees/'+user.uid).remove();

			//update currentUser in scope
			UserService.unFollow(selectedUser); 
		}
		else{

			//$scope.followText = "unfollow"
			//console.log(user.uid);
			
			//add followee [follow this user]
			firebase.database().ref('users/' + $scope.currentUser.uid+'/followees/'+user.uid).set(selectedUser);
			
			//update currentUser in scope
			UserService.follow(selectedUser); 
		}
  	}

  	$scope.isFollowing = function(userid){
  		//stop binding data, when user logsout
  		if(!$scope.currentUser)return; 
  		
  		return UserService.isFollowing(userid);
  	}

  	//if user logs out, turnoff db listener
  	firebase.auth().onAuthStateChanged(function(user) {
	    if (!user) {
	      databaseRef.off();
	    }
  	});

});
var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $rootScope, $location, UserService) {

  var auth = firebase.auth();
  $scope.invalidLogin = false;

  $scope.login = function (username, password) {
    
    if(username == null || password == null)return;

    $scope.dataLoading = true;
    //UserService.validUserName("");
    
    auth.signInWithEmailAndPassword(username, password)
    .then(function(user){
      //get user record
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var user = snapshot.val();

        UserService.setCredentials(user);
        $scope.$apply(function() {
            $scope.dataLoading = false;
            $scope.invalidLogin = false;
            $scope.$emit('login');
            $location.path('/home');
        });

      });

    })
    .catch(function(error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      $scope.$apply(function() {
        $scope.dataLoading = false;
        $scope.invalidLogin = true;
      });
    });
  }

});


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

var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {

  $scope.register = function (username, email, password) {
    $scope.dataLoading = true;
    if(username && password && email)
    {

      UserService.validUserName(username, function(valid){
        //if username is unique, then register
        if(valid){
           firebase.auth().createUserWithEmailAndPassword(email, password)
           .then(function(userData){

          
          //create user record
          var user = {
            uid: userData.uid,
            username: username,
            email: userData.email,
            color:""
          };

          firebase.database().ref('users/' + user.uid).set(user);
          firebase.database().ref('jb_usernames/' + user.uid).set(user.username);


          UserService.setCredentials(user);
          $scope.$apply(function() {
              $scope.$emit('login');
              $location.path('/home');
          });

          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            $scope.$apply(function() {
                $scope.dataLoading = false;
                $scope.errorMessage = errorMessage;
            });
          });
        }
        else{
          
           $scope.$apply(function() {
            $scope.errorMessage = "Please choose another username, '"+username+"' is already taken."
            $scope.dataLoading = false;
          });
           
        }
        
      });

     
    }

  }
});


(function () {
    'use strict';

    angular
        .module('app')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
          .when('/home', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
          .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
          .when('/connect', { controller: 'ConnectCtrl', templateUrl: 'connect.html' })
          .when('/', { controller: 'LoginCtrl', templateUrl: 'login.html' })
          .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {


        // //if user is no longer logged in, clear cache
        firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
            $http.defaults.headers.common['x-auth'] = null;
            $cookieStore.remove('globals');
          }
        })


        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['x-auth'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/');
            }

            // redirect to home page if logged in and trying to access login page
            if (loggedIn && $location.path() == '/') {
                $location.path('/home');
            }

        });
    }

})();

var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {

/*********************************************
  Firebase Implementation
**********************************************/
  var svc = this;
  svc.setCredentials = function(user){

    //get user credentials & store it globally [replace  currentUser with user]
    var authdata = "token";
    $rootScope.globals = {
          currentUser: {
              username: user.username,
              email: user.email,
              color: user.color,
              uid: user.uid,
              followees: JsonToArray(user.followees), //give them an index
              authdata: authdata
          }
      };

    var array = JsonToArray($rootScope.globals.currentUser.followees);
    console.log(array);  
    //console.log($rootScope.globals.currentUser.followers);//MAsMs5MTiufuTCnnDpTiuCfCHMr1
    //set token for all request
    $cookieStore.put('globals', $rootScope.globals);
    $http.defaults.headers.common['x-auth'] = authdata; // jshint ignore:line

  }

  //clearCredentials
  svc.clearCredentials  = function () {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = null;
  }

  svc.validUserName = function (username, callback) {
    firebase.database().ref('/jb_usernames').once('value').then(function(snapshot) {
      var valid = true; 
      var obj = snapshot.val();

      //convert snapshot to array & check if name is already in use
      if(obj){
        var array = JsonToArray(obj);//Object.keys(obj).map(function(k) { return obj[k] }); 
        if(array.indexOf(username) > -1){valid = false;}
      }
      //return valid;
      callback(valid);
    });
  }

  svc.isFollowing = function (userid) {
      // console.log($rootScope.globals.currentUser.followers);
      var followees = $rootScope.globals.currentUser.followees || [];
      //var following = false;

      for(var i = 0; i < followees.length; i++){
        if(followees[i].uid === userid){
          return true;
        }
      }
     
     return false;
  }

  //MAKE THESE MORE EFFICIENT
  svc.follow = function(user){
    $rootScope.globals.currentUser.followees.push(user);

    //refresh cache
    $cookieStore.remove('globals');
    $cookieStore.put('globals', $rootScope.globals);
  }

  svc.unFollow = function(user){
    var followees = $rootScope.globals.currentUser.followees || [];
    
    for(var i = 0; i < followees.length; i++){
      if(followees[i].uid === user.uid){
        followees[i] = {};
      }
    }

    //update Current user & cache
    $rootScope.globals.currentUser.followees = followees;
    $cookieStore.remove('globals');
    $cookieStore.put('globals', $rootScope.globals);
  }

});

/*********************************************
helper function
*********************************************/
function JsonToArray(obj){
  if(obj){  
    return Object.keys(obj).map(function(k) { return obj[k] });     
  }
  return [];
}