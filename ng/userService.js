var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {

/*********************************************
  Firebase Implementation
**********************************************/
  var svc = this;
  svc.setCredentials = function(user){

    //get user credentials & store it globally [replace  currentUser with user]
    var authdata = "token";
    $rootScope.globals = {
          currentUser: {
              username: user.username,
              email: user.email,
              color: user.color,
              uid: user.uid,
              followees: JsonToArray(user.followees), //give them an index
              authdata: authdata
          }
      };

    var array = JsonToArray($rootScope.globals.currentUser.followees);
    console.log(array);  
    //console.log($rootScope.globals.currentUser.followers);//MAsMs5MTiufuTCnnDpTiuCfCHMr1
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
        var array = JsonToArray(obj);//Object.keys(obj).map(function(k) { return obj[k] }); 
        if(array.indexOf(username) > -1){valid = false;}
      }
      //return valid;
      callback(valid);
    });
  }

  svc.isFollowing = function (userid) {
      // console.log($rootScope.globals.currentUser.followers);
      var followees = $rootScope.globals.currentUser.followees || [];
      //var following = false;

      for(var i = 0; i < followees.length; i++){
        if(followees[i].uid === userid){
          return true;
        }
      }
     
     return false;
  }

  //MAKE THESE MORE EFFICIENT
  svc.follow = function(user){
    $rootScope.globals.currentUser.followees.push(user);

    //refresh cache
    $cookieStore.remove('globals');
    $cookieStore.put('globals', $rootScope.globals);
  }

  svc.unFollow = function(user){
    var followees = $rootScope.globals.currentUser.followees || [];
    
    for(var i = 0; i < followees.length; i++){
      if(followees[i].uid === user.uid){
        followees[i] = {};
      }
    }

    //update Current user & cache
    $rootScope.globals.currentUser.followees = followees;
    $cookieStore.remove('globals');
    $cookieStore.put('globals', $rootScope.globals);
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