var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $rootScope, $location, UserService) {

  $scope.invalidLogin = false;

  $scope.login = function (username, password) {
    // UserService.login(username, password)
    // .then(function (response) {
    //   $scope.invalidLogin = false;
    //   $scope.$emit('login');
    //   $location.path('/home');
    // }).catch(function(response) {
    //   $scope.invalidLogin = true;
    //   console.error('Login Error', response.status);
    // });

    firebase.auth().signInWithEmailAndPassword(username, password)
    .then(function(user){
      var token = firebase.auth().currentUser.getToken();
      console.log(token);
      //firebase.auth().verifyIdToken(token);
      // $location.path('/login'); //redirect to logi page

      //no need for headers--check if there is a user signed-in
      // var user = firebase.auth().currentUser;
      //
      // if (user) {
      //   // User is signed in.
      // } else {
      //   // No user is signed in.
      // }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }

});
