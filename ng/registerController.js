var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {

  $scope.register = function (username, email, password) {
    $scope.dataLoading = true;
    if(username && password && email)
    {

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userData){


        var databaseRef = firebase.database().ref().child('posts');

        //create user record
        var user = {
          uid: userData.uid,
          username: username,
          email: userData.email,
          color:""
        };

        firebase.database().ref('users/' + user.uid).set(user);
        UserService.setCredentials(user);
        $scope.$apply(function() {
            $scope.$emit('login');
            $location.path('/home');
        });

      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        $scope.$apply(function() {
            $scope.dataLoading = false;
            $scope.errorMessage = errorMessage;
        });
      });
    }

  }
});
