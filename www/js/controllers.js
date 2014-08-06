// (vishesh): alternatively can just set a global get function on the array object
// that works like the one in here, but that's a more dangerous approach.
function ArrayDataSource(array) {
  return {
    get: function(index, count, success) {
        var start = Math.max(0, index);
        var end = Math.min(index+count, this.data.length);
        success(this.data.slice(0, end));
    },
    data: array    
  };
}

angular.module('kindspring-app.controllers', [])
.controller('ProgressCtrl', function($scope, $timeout, $location) {
  $scope.numActs = [1, 0, 1, 1, 3, 2, 1];
  $scope.previousacts = ArrayDataSource([
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
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
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
    {name: 'Flowers For My Neighbors'},
  ]);
})
.controller('PostCtrl', function($scope, $location) {
    
})
.controller('HomepageCtrl', function($scope, $location) {
  $scope.stories = [
  {
    title: 'Roses',
    text: 'roses are red \nviolets are blue \n... fill in the blanks your own way'
  },
  {
    title: 'Haiku',
    text: 'Haikus are awesome \nBut they can sometimes be strange \nRefrigerator'
  }
  ];
})
.controller('LoginCtrl', function($scope, $location) {
  $scope.login = function() {
    $location.path('/home');
  }
})
.controller('MainCtrl',function($scope, $http, $location) {
  $scope.loginClicked = function() {
    $location.path('/login');
  }
  $scope.stories = [];
  $http({
    method: 'POST',
    url: 'api.php',
    data: 'op=stories',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).success(function(data, status, headers, config) {
    $scope.stories = data;
  });

  $scope.stripTags = function(str) {
    return str.replace(/<[^>]+>/gi,"");
  };
});
