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
.controller('MainCtrl',function($scope, $http, $location) {
  $scope.stories = [];
  $scope.user = '';
  $scope.pass = '';
  $scope.loginMessage = '';

  $http({
    method: 'POST',
    url: 'api.php',
    data: 'op=public_feed',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).success(function(data, status, headers, config) {
    $scope.stories = data;
  });

  $scope.login = function() {
    if ($scope.user === '' || $scope.pass === '') return;
    $http({
      method: 'POST',
      url: 'api.php',
      data: 'op=login&user='+$scope.user+'&pass=' + $scope.pass,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      console.log(data);
      if (data === 1 || data === '1') {
        $location.url('/home');
      } else {
        $scope.loginMessage = 'Invalid username or password';
      }
    });
  }
  
  $scope.stripTags = function(str) {
    return str.replace(/<[^>]+>/gi,"");
  };

  $scope.expandedIndex = -1;
  $scope.setExpanded = function(index) {
    if (index == $scope.expandedIndex) {
      $scope.expandedIndex = -1;
    } else {
      $scope.expandedIndex = index;
    }
  };

});













