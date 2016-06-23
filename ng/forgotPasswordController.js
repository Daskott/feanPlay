angular.module('app')
.controller('ForgotPasswordCtrl', function ($scope) {

  $scope.emailSent = false;
  $scope.errorMessage;

  $scope.sendResetEmail = function(email)
  {
    if(email){
      var auth = firebase.auth();
      var emailAddress = email;
      $scope.dataLoading = true;

      auth.sendPasswordResetEmail(emailAddress).then(function() {
          // Email sent.
          $scope.$apply(function() {
            $scope.dataLoading = false;
            $scope.emailSent = true;
            $scope.errorMessage = null;
          });
      }, function(error) {
          // An error happened.
          $scope.$apply(function() {
              $scope.dataLoading = false;
              $scope.errorMessage = error.message;
          });
          console.log(error.message);
      });
    }

  }

 });
