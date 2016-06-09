'use strict'

var app = angular.module('app');

app.controller('ConnectCtrl', function ($scope,  $firebaseArray, UserService) {

	var databaseRef = firebase.database().ref().child('users');
	
	//get users & update UI
  	$scope.users = $firebaseArray(databaseRef);
  	
  	$scope.toggleFollow = function(user){
  		var following = $scope.isFollowing(user.uid);
  		selectedUser = {username:user.username, uid:user.uid};

  		if(following){

			//delete followee
			firebase.database().ref('users/' + $scope.currentUser.uid+'/followees/'+user.uid).remove();

			//update currentUser in scope
			UserService.unFollow(selectedUser); 
		}
		else{

			//$scope.followText = "unfollow"
			//console.log(user.uid);
			
			//add followee [follow this user]
			firebase.database().ref('users/' + $scope.currentUser.uid+'/followees/'+user.uid).set(selectedUser);
			
			//update currentUser in scope
			UserService.follow(selectedUser); 
		}
  	}

  	$scope.isFollowing = function(userid){
  		//stop binding data, when user logsout
  		if(!$scope.currentUser)return; 
  		
  		return UserService.isFollowing(userid);
  	}

  	//if user logs out, turnoff db listener
  	firebase.auth().onAuthStateChanged(function(user) {
	    if (!user) {
	      databaseRef.off();
	    }
  	});

});