// (vishesh): alternatively can just set a global get function on the array object
// that works like the one in here, but that's a more dangerous approach.
function ArrayDataSource(array) {
  return {
    get: function(index, count, success) {
        var start = Math.max(0, index);
        var end = Math.min(index+count, this.data.length);
        success(this.data.slice(start, end));
    },
    data: array    
  };
}

function stripTags(str) {
    return str.replace(/<[^>]+>/gi,"");
}

angular.module('kindspring-app.controllers', [])
.controller('ProgressCtrl', function($scope, $timeout, $location) {
  $scope.numActs = [1, 0, 1, 1, 3, 2, 1];
  $scope.previousacts = ArrayDataSource([
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
  ]);
  $scope.suggestedacts = ArrayDataSource([
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
  ]);
})
.controller('PostCtrl', function($scope, $http, $location, $routeParams) {
  $scope.title = undefined;
  $scope.reflection = undefined;
  $scope.showerror = false;
  $scope.errorMessage = '';

  $scope.addStory = function() {
    if ($scope.title != undefined && $scope.reflection != undefined) {
      $http({
        method: 'POST',
        url: 'api.php',
        data: 'op=add_story&title=' + $scope.title + '&descr=' + $scope.reflection
            + '&cid=' + $routeParams.cid,
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
      })
      .success(function(data) {
        if (isNaN(data)) {
          $scope.errorMessage = data;
          $scope.showerror = true;
        } else {
          $location.url('/challenge/'+$routeParams.cid);
        }
      });
    }
  };
})
.controller('IdeaCtrl', function($scope, $location, $http, $routeParams) {
  $scope.ideas = [];
  $scope.$on('$routeChangeSuccess', function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=chall_ideas&cid=' + $routeParams.cid,
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log(data);
      $scope.ideas = data;
    });
  });  
})
.controller('MemberCtrl', function($scope, $location, $http, $routeParams) {
  $scope.members = ArrayDataSource([]);
  $scope.$on('$routeChangeSuccess', function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=chall_mem&cid=' + $routeParams.cid,
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log(ArrayDataSource(data));
      $scope.members = ArrayDataSource(data);
    });
  });  
})
.controller('ChallengeCtrl', function($scope, $location, $http, $routeParams) {
  $scope.feed = [];
  $scope.$on('$routeChangeSuccess', function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=chall_feed&cid=' + $routeParams.cid,
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    }).success(function(data) {
      $scope.feed = data;
    });
  });
  $scope.routeToPost = function() {
    $location.url('/post/' + $routeParams.cid);
  };
})
.controller('HomepageCtrl', function($scope, $http, $location, $route) {
  $scope.challenges = [{story_title: "sample story", story_descr: "<br>"}];
  $scope.$on('$routeChangeSuccess', function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=chall_list',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      $scope.challenges = data;
    });
  });
  
  $scope.stripTags = stripTags;
  $scope.daysRemaining = function(enddate, startdate) {
    if (new Date(startdate) - new Date() > 0) return 'upcoming challenge';
    var days = Math.floor((new Date(enddate)- new Date())/1000/60/60/24);
    return days > 0 ? days + ' days remaining' : 'challenge completed';
  };
  $scope.goToChallenge = function(cid) {
    $location.url('/challenge/'+cid);
  };
})
.controller('MainCtrl',function($rootScope, $scope, $http, $location) {
  $scope.user = '';
  $scope.pass = '';
  $scope.loginMessage = '';
  $scope.expandedIndex = -1;
  $scope.stories = [];

  $scope.$on('$routeChangeSuccess', function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=public_feed',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      $scope.stories = data;
    });
  });

  $scope.login = function() {
    if ($scope.user === '' || $scope.pass === '') {
      $scope.loginMessage="Please enter a username and password";
      return;
    }
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=login&user='+$scope.user+'&pass=' + $scope.pass,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (data == 1) {
        console.log('success');
        $location.url('/home');
      } else {
        $scope.loginMessage = 'Invalid username or password';
      }
      $rootScope.loggedin = true;
    });
  };
  
  $scope.stripTags = stripTags;
  $scope.setExpanded = function(index) {
    if (index == $scope.expandedIndex) {
      $scope.expandedIndex = -1;
    } else {
      $scope.expandedIndex = index;
    }
  };
})
.controller('SideMenuCtrl', function($rootScope, $scope, $http, $location, $route, snapRemote) {
  $scope.challenges = function() {
    snapRemote.close();
    $location.url('/home');
    $route.reload();
  };
  $scope.progress = function() {

  };
  $scope.logout = function() {
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=logout',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function() {
      snapRemote.close();
      $rootScope.loggedin = null;
      $location.url('/');
      $route.reload();
    });
  };
});













