var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {
  $scope.register = function (username, password) {
    UserService.register(username, password)
    .then(function (response) {
      
      console.log(username, password);
      UserService.login(username, password); //set user credentials
      $location.path('/login'); //redirect to logi page
      console.log(response);
      
    });
  }
});
