'use strict'

var app = angular.module('app');

app.controller('ConnectCtrl', function ($scope, $rootScope, $firebaseArray, UserService) {

	var databaseRef = firebase.database().ref().child('users');
	var followeesRef = firebase.database().ref().child('users/' + $scope.currentUser.uid+'/followees');

	//dynamically update followees when new 1 is added
	followeesRef.on('child_added', function(data) {
			UserService.follow(data.val());
	});

	//dynamically update followees when unFollow
	followeesRef.on('child_removed', function(data) {
  		UserService.unFollow(data.val());
	});


		//get users & update UI
  	$scope.users = $firebaseArray(databaseRef);

  	$scope.toggleFollow = function(user){
  		var following = $scope.isFollowing(user.username);
  		selectedUserName = user.username;

  		if(following){

				// delete the followee data simultaneously in the currentUser list and the user's followers list.
		    var updates = {};
		    updates['users/' + $scope.currentUser.uid+'/followees/'+user.uid] = null;
		    updates['followers/' + user.uid+'/'+$scope.currentUser.uid] = null;
		    firebase.database().ref().update(updates);

				//update currentUser in scope
				UserService.unFollow(selectedUserName);
			}
			else{

				// add the followee data simultaneously in the currentUser list and the user's followers list.
				var updates = {};
		    updates['users/' + $scope.currentUser.uid+'/followees/'+user.uid] = selectedUserName;
		    updates['followers/' + user.uid+'/'+$scope.currentUser.uid] =  $scope.currentUser.username;
		   	firebase.database().ref().update(updates);

				//update currentUser in scope
				UserService.follow(selectedUserName);
			}
  	}

  	$scope.isFollowing = function(username){
  		//stop binding data, when user logsout
  		if(!$scope.currentUser)return;

  		return UserService.isFollowing(username);
  	}

  	//if user logs out, turnoff db listener
  	firebase.auth().onAuthStateChanged(function(user) {
	    if (!user) {
	      databaseRef.off();
	    }
  	});

});
