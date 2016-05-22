// Firebase
var firebase = "https://tooh.firebaseio.com/";

// User
if (localStorage.user_id == undefined) {
  localStorage.user_id = 0;
  localStorage.user_name = 'Anonymous';
  localStorage.user_photo = 'img/no-photo.png';
}

// History
if (localStorage.history == undefined) {
  localStorage.history = new Array();
}

angular.module('starter', [
  'ionic', 
  'starter.controllers',
  'firebase'
])

.filter('fromNow', function() {
  return function(date) {
    moment.locale('en');

    return moment(date).fromNow();
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // Android
  if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
  }

  // Routes
  $stateProvider

  .state('login', {
    url: "/login",
    cache: false,
    templateUrl: "templates/login/login.html",
    controller: "LoginCtrl"
  })

  .state('tab', {
    url: '/tab',
    cache: false,
    abstract: true,
    templateUrl: 'templates/tabs/tabs.html'
  })

  .state('tab.trends', {
    url: '/trends',
    cache: false,
    views: {
      'trends': {
        templateUrl: 'templates/trends/trends.html',
        controller: 'TrendsCtrl'
      }
    }
  })

  .state('tab.trend', {
    url: '/trends/:id',
    cache: false,
    views: {
      'trends': {
        templateUrl: 'templates/trends/trend.html',
        controller: 'TrendCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    cache: false,
    views: {
      'profile': {
        templateUrl: 'templates/profile/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.profile-trend', {
    url: '/trends/:id',
    cache: false,
    views: {
      'profile': {
        templateUrl: 'templates/trends/trend.html',
        controller: 'TrendCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/login');
});
