angular.module('app')
.controller('NotificationCtrl', function ($scope, $rootScope, $firebaseArray, $location, UserService) {

    
    //NEEDS MAJOR IMPROVEMENT, ONCE YOU REFRESH PAGE NOTIFICATIONS ARE DELETED
    $scope.$on('$locationChangeStart', function (event, next, current) {
      //delete notification, once you leave page 
      var userId = $scope.currentUser.uid;
      
      firebase.database().ref()
      .child('users/'+ userId+'/notifications')
      .set(null);

      $scope.notificationPosts = [];
      $scope.notifications = [];
      $scope.seenNotification = true;
    });
   
     
  
 });
