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
  }
  
 });
