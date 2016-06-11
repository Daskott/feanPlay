var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $rootScope, $location, UserService) {

  var auth = firebase.auth();
  $scope.invalidLogin = false;

  $scope.login = function (email, password) {

    if(email == null || password == null)return;

    $scope.dataLoading = true;

    auth.signInWithEmailAndPassword(email, password)
    .then(function(user){
      //get user record
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var user = snapshot.val();

        //reset login status
        UserService.clearCredentials();

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
