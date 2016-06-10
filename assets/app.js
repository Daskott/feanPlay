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

var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $rootScope, $location, UserService) {

  var auth = firebase.auth();
  $scope.invalidLogin = false;

  $scope.login = function (username, password) {
    $scope.dataLoading = true;
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
    var timeStamp = currMonth + " " + date.getDate() + " " + date.getFullYear()+" - "+date.toLocaleTimeString();
    var pid =  generatePostId ($scope.currentUser.username);
    //console.log($scope.photo.text);
    //$scope.handleFileUpload($scope.photo);

    if($scope.postBody){

        var post = {
          username: $scope.currentUser.username,
          body: $scope.postBody,
          image: $scope.photo || "",
          time: timeStamp,
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

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userData){


        var databaseRef = firebase.database().ref().child('posts');

        //create user record
        var user = {
          uid: userData.uid,
          username: username,
          email: userData.email,
          color:""
        };

        firebase.database().ref('users/' + user.uid).set(user);
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
            //if logged in, u can't go to any other link apart from home
            else if (loggedIn) {
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
              authdata: authdata
          }
      };
    console.log(user.uid);
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


});
