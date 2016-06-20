angular.module('app')
.controller('ApplicationCtrl', function ($scope, $rootScope, $firebaseArray, $location, UserService) {

  //when user refreshes page, mk sure use is set
  $scope.currentUser =  $rootScope.globals.currentUser;
  $scope.notificationPosts = [];
  
  var notificationRef = []; 

  if($scope.currentUser){
    notificationRef = firebase.database().ref().child('users/' + $scope.currentUser.uid+'/notifications');
    $scope.notifications = $firebaseArray(notificationRef);
  }

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

  $scope.unSeenNotification = function(){

    var count = 0;
    for(var i = 0; i < $scope.notifications.length; i++){
      if(!$scope.notifications[i].seen)
        count++;
    }

    return count;
  }

  
  $scope.getNotificationPosts = function(){
    var userId = $scope.currentUser.uid;

    // reset and repopulate
    $scope.notificationPosts = [];
    for(var i = 0; i<$scope.notifications.length; i++){

      firebase.database().ref('/posts/'+$scope.notifications[i].itemId)
      .once('value')
      .then(function(snapshot) {
        var post = snapshot.val();
        console.log(post);
        $scope.notificationPosts.unshift(post);
      });
    }
  }


  $scope.logout = function () {
    UserService.clearCredentials();
    //go back to sigin page
    $location.path('/');
    $scope.currentUser = null;
    $scope.nav = 0;
    
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      notificationRef.off();
      console.log("signed out");
    }, function(error) {
      // An error happened.
    });
  }

 });
