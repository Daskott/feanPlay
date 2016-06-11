var app = angular.module('app');
app.controller('RegisterCtrl', function ($scope, $location, UserService) {

  $scope.register = function (fullname, username, email, password) {
    $scope.dataLoading = true;
    if(fullname && username && password && email)
    {

      UserService.validUserName(username, function(valid){
        //if username is unique, then register
        if(valid){
           firebase.auth().createUserWithEmailAndPassword(email, password)
           .then(function(userData){


          //create user record
          var user = {
            uid: userData.uid,
            fullname: fullname,
            username: username,
            email: userData.email,
            color:getRandomColor()
          };

          firebase.database().ref('users/' + user.uid).set(user);
          firebase.database().ref('jb_usernames/' + user.uid).set(user.username);


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
        else{

           $scope.$apply(function() {
            $scope.errorMessage = "Please choose another username, '"+username+"' is already taken."
            $scope.dataLoading = false;
          });

        }

      });


    }

  }
});

/*******************************************
helper functions
*********************************************/
var colors = ['#ef5350', '#9C27B0', '#FF5722', '#795548', '#FFC107', '#4CAF50', '#009688',
              '#00BCD4', '#03A9F4', '#2196F3', '#3F51B5', '#673AB7', '#263238', '#33691E',
              '#c0392b', '#e74c3c', '#2980b9', '#3498db', '#f1c40f', '#9b59b6', '#a0522d']


function getRandomColor()
{
  var index = Math.floor((Math.random() * colors.length));

  return colors[index];
}
