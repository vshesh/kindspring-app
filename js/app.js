// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('kindspring-app', ['ngRoute', 'ngSanitize', 'ui.utils', 'kindspring-app.controllers'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    .when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .when('/home', {
      templateUrl: 'templates/homepage.html',
      controller: 'HomepageCtrl'
    })
    .when('/challenge/:cid', {
      templateUrl: 'templates/challenge.html',
      controller: 'ChallengeCtrl'
    })
    .when('/members/:cid', {
      templateUrl: 'templates/members.html',
      controller: 'MemberCtrl'
    })
    .when('/ideas/:cid', {
      templateUrl: 'templates/ideas.html',
      controller: 'IdeaCtrl'
    })
    .when('/post', {
      templateUrl: 'templates/post.html',
      controller: 'PostCtrl'
    })
    .when('/progress', {
      templateUrl: 'templates/progress.html',
      controller: 'ProgressCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.factory('challengeService', function() {
  var challenges = [];
  return {
    getChallenges: function() { return challenges;},
    getCid: function(index) { return challenges[0].cid},
  }
});

