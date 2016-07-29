angular.module('app')
.controller('ApplicationCtrl', function ($scope, $rootScope, $firebaseArray, $location, UserService) {

  //when user refreshes page, mk sure use is set
  $scope.currentUser =  $rootScope.globals.currentUser;
  $scope.notifications = [];
  $scope.notificationPosts = [];
  $scope.notificatonCount = 0;
  var notificationRef; 

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
    //get notifications
    $scope.listenForNotification();
  });

  $scope.listenForNotification = function(){
    notificationRef = firebase.database().ref().child('users/' + $scope.currentUser.uid+'/notifications');
    notificationRef.on('child_added', function(data) {
        $scope.notifications.push(data.val());
        $scope.getNotificationPosts();
        $scope.setNotificationCount();
        $scope.seenNotification = false;

    });

     notificationRef.on('child_removed', function(data) {
        //if a notification is seen/removed, delete all [FOR NOW!]
        $scope.notifications = [];
        $scope.notificationPosts = [];
    });
  }

  $scope.setNav = function(navIndex){
    $scope.nav = navIndex;
  }

  $scope.isSelectedNav = function(navIndex){
    return $scope.nav === navIndex;
  }

  //get unseen notification count
  $scope.setNotificationCount = function(){

    $scope.notificatonCount = 0;
    for(var i = 0; i < $scope.notifications.length; i++){
      if($scope.notifications[i].seen === false)
        $scope.notificatonCount++;
    }
  }

  $scope.seeNotification = function(){

    //set all notifications to seen
    for(var i = 0; i < $scope.notifications.length; i++){
      //update db
      firebase.database().ref()
      .child('users/'+ $scope.currentUser.uid+'/notifications/'+$scope.notifications[i].key+'/seen')
      .set(true);

      //update local var
      $scope.notifications[i].seen = true;
    }

    //clear alert: ALL NOTIFICATIONS SEEN
    $scope.seenNotification = true;
    $scope.notificatonCount = 0;
  }

  $scope.getNotificationPosts = function(){
    var userId = $scope.currentUser.uid;

    //reset & get post notifications
    $scope.notificationPosts = [];
    for(var i = 0; i<$scope.notifications.length; i++){

      firebase.database().ref('/posts/'+$scope.notifications[i].itemId)
      .once('value')
      .then(function(snapshot) {
        var post = snapshot.val();
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
      console.log("signed out");
    }, function(error) {
      // An error happened.
    });
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    }else if(notificationRef){
      notificationRef.off();
    }
  })

  //if user is logged in listen for notification
  if($scope.currentUser)
    $scope.listenForNotification();

 });
