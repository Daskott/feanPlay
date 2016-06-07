var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $rootScope, $location, UserService) {

  $scope.invalidLogin = false;

  $scope.login = function (username, password) {
    UserService.login(username, password)
    .then(function (response) {
      $scope.invalidLogin = false;
      $scope.$emit('login');
      $location.path('/home');
    }).catch(function(response) {
      $scope.invalidLogin = true;
      console.error('Login Error', response.status);
    });
  }
});
