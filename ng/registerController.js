var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {

  $scope.register = function (username, email, password) {

    if(username && password && email)
    {
      // UserService.register(username, email, password)
      // .then(function (response) {
      //
      //   //console.log(username, password);
      //   UserService.login(username, password); //set user credentials
      //   $location.path('/login'); //redirect to logi page
      //   //console.log(response);
      //
      // });

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(response){
        console.log(response);
        $location.path('/login'); //redirect to logi page
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
    }

  }
});
