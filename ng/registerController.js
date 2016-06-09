var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {

  $scope.register = function (username, email, password) {
    $scope.dataLoading = true;
    if(username && password && email)
    {

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(user){

        //update username [MAKE SURE USERNAME IS UNIQUE] -- update user node with profile info
        user.updateProfile({
          displayName: username,
        })
        .then(function() {
          // Update successful.
          UserService.setCredentials(user);
          $scope.$apply(function() {
              $scope.$emit('login');
              $location.path('/home');
          });
          console.log("successful sigin");
        }, function(error) {
          // An error happened.
        });

      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        $scope.$apply(function() {
            $scope.dataLoading = false;
        });
      });
    }

  }
});
