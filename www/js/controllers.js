angular.module('kindspring-app.controllers', [])
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
.controller('MainCtrl',function($scope, $location) {
  $scope.loginClicked = function() {
    $location.path('/login');
  }
  $scope.stories = [
  {
    title: 'Marks of Kindness',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron"
  },
  {
    title: 'A Kindness That Has Become A Habit',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron" +
     " and sat on the pillion. Immediately he asked me my name and after I told him," +
     " blessed me aloud. We rode on. In five minutes, we were stopped by a traffic" +
     " cop who demanded to see my license. There were many cops who were stopping" +
     " everyone on that road. My ride got down with his sack and got back on after I" +
     " was through with the cop. We reached his destination. He got off and thanked me" +
     " again. After reaching home, while parking my motorcycle I saw that the iron pieces" +
     " in the sack that he had placed on the pillion had made deep marks and almost torn the" +
     " seat in a couple of places. I smiled and took it as a reminder he had left behind" +
     " so that I do not forget what the pillion is for"    
  },
  {
    title: 'Marks of Kindness',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron"
  },
  {
    title: 'Marks of Kindness',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron"
  },
  {
    title: 'Marks of Kindness',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron"
  },
  {
    title: 'Marks of Kindness',
    text : "I was on my way to my parents' on my motorcycle and saw a middle" + 
     "aged man carrying a heavy sack on his shoulders and walking with great" + 
     " struggle. I passed him, then paused, and turned around to stop near him" +
     " and offer him a ride. He lifted the heavy sack which had a lot of scrap iron"
  },
  ];
});
