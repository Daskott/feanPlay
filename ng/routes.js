
(function () {
    'use strict';

    angular
        .module('app')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
          .when('/home', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
          .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
          .when('/forgotPassword', { controller: 'ForgotPasswordCtrl', templateUrl: 'forgotPassword.html' })
          .when('/connect', { controller: 'ConnectCtrl', templateUrl: 'connect.html' })
          .when('/notification', { controller: 'NotificationCtrl', templateUrl: 'notification.html' })
          .when('/', { controller: 'LoginCtrl', templateUrl: 'login.html' })
          .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {


        // //if user is no longer logged in, clear cache
        firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
            $http.defaults.headers.common['x-auth'] = null;
            $cookieStore.remove('globals');
            $location.path('/');
          }
        })


        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['x-auth'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/', '/register', '/forgotPassword']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/');
            }

            // redirect to home page if logged in and trying to access login page
            if (loggedIn && $location.path() === '/') {
                $location.path('/home');
            }

        });
    }

})();
