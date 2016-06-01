var app = angular.module('app');
app.controller('LoginCtrl', function ($scope, $location, UserService) {
  $scope.login = function (username, password) {
    UserService.login(username, password)
    .then(function (response) {
      //emit signal that user has logged in
      console.log(response);
      $scope.$emit('login', response.data);
      $location.path('/');
    });
  }
});
