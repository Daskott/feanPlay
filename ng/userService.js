var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {

/*********************************************
  Firebase Implementation
**********************************************/
  var svc = this;
  svc.setCredentials = function(user){

    //get user credentials & store it globally [replace  currentUser with user]
    // SET TOKEN IN THE FUTURE FOR SERVER REQUEST
    var authdata = "token";
    $rootScope.globals = {
          currentUser: {
              username: user.username,
              fullname: user.fullname,
              email: user.email,
              color: user.color,
              uid: user.uid,
              followees: JsonToArray(user.followees),
              authdata: authdata
          }
      };

    var array = JsonToArray($rootScope.globals.currentUser.followees);

    //set token for all request
    $cookieStore.put('globals', $rootScope.globals);
    $http.defaults.headers.common['x-auth'] = authdata; // jshint ignore:line

  }

  //clearCredentials
  svc.clearCredentials  = function () {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = null;
  }

  svc.validUserName = function (username, callback) {
    firebase.database().ref('/jb_usernames').once('value').then(function(snapshot) {
      var valid = true;
      var obj = snapshot.val();

      //convert snapshot to array & check if name is already in use
      if(obj){
        var array = JsonToArray(obj);
        if(array.indexOf(username) > -1){valid = false;}
      }
      //return valid;
      callback(valid);
    });
  }

  svc.isFollowing = function (username) {

      var followees = $rootScope.globals.currentUser.followees;

      if(followees.indexOf(username) > -1){
        return true;
      }

     return false;
  }

  //MAKE THESE MORE EFFICIENT
  svc.follow = function(username){

    //add followee if he/she is not already in list
    if($rootScope.globals.currentUser.followees.indexOf(username) <= -1){
      $rootScope.globals.currentUser.followees.push(username);

      //refresh cache
      $cookieStore.remove('globals');
      $cookieStore.put('globals', $rootScope.globals);
    }

  }

  svc.unFollow = function(username){
    var followees = $rootScope.globals.currentUser.followees;

    //remove user from followees list
    index = followees.indexOf(username);
    if(index > -1){
      followees[index] = '';
    }

    //update Current user & cache
    $rootScope.globals.currentUser.followees = followees;
    $cookieStore.remove('globals');
    $cookieStore.put('globals', $rootScope.globals);
  }


  svc.notify = function(senderId, senderUsername, message, recepientId, time, itemId){
    
    var notification = {
                            senderId: senderId,
                            senderUsername: senderUsername,
                            message: message,
                            key: "",
                            seen:false,
                            time:time,
                            itemId:itemId,
                            }

     //get key
     var key = firebase.database().ref('users/' + recepientId+'/notifications').push().key
     notification.key = key;
     
    //update notification
    firebase.database().ref()
    .child('users/' + recepientId+'/notifications/'+key)
    .set(notification);

  }

});

/*********************************************
helper function
*********************************************/
function JsonToArray(obj){
  if(obj){
    return Object.keys(obj).map(function(k) { return obj[k] });
  }
  return [];
}
