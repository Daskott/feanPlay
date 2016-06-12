angular.module('app')
.controller('ApplicationCtrl', function ($scope, $rootScope, $location, UserService) {

  //when user refreshes page, mk sure use is set
  $scope.currentUser =  $rootScope.globals.currentUser;

  // set selected nav if page refreshes
  (function initController() {
    //defacult nav
    $scope.nav = 0;

    if ($location.path() == '/home')
      $scope.nav = 0;
    else if ($location.path() == '/connect')
      $scope.nav = 1;
  })();

  //when user logs in, receive signal on login
  $scope.$on('login', function () {
     $scope.currentUser = $rootScope.globals.currentUser;
  });

  $scope.setNav = function(navIndex){
    $scope.nav = navIndex;
  }

  $scope.isSelectedNav = function(navIndex){
    return $scope.nav === navIndex;
  }

  $scope.logout = function () {
    UserService.clearCredentials();
    //go back to sigin page
    $location.path('/');
    $scope.currentUser = null;
    $scope.nav = 0;
    
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signed out");
    }, function(error) {
      // An error happened.
    });
  }

 });
