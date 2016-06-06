var app = angular.module('bowtieApp', []);

app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('homeController', ['$scope', '$timeout', '$location', function ($scope, $timeout, $location) {

  $scope.showMe = false;
  $scope.numbRequired = false;

  bowtie.user.info(function(user){
    $scope.userName = user;
  });

  bowtie.user.profile(function(profile){
    $scope.$apply(function () {
      $scope.privateProfile = profile;
    });
  });

  $scope.myUser = {};
  var timeout;

  $scope.numberCheck = function (input) {
    if (input != undefined) {
      var number = input.match(/^\d+$/);
      if (number != null) {
        $scope.showMe = false;
        $scope.$watch('myUser.age', checkNumbIntegrity);
      }
      else {
        $scope.numbRequired = false;
        $scope.showMe = true;
      }
    };
  };

  var checkNumbIntegrity = function (newVal, oldVal) {
    if (newVal === undefined) {
      $scope.numbRequired = true;
      $timeout.cancel(timeout);
    }
    else {
      if (newVal != oldVal) {
        if (newVal.match(/^\d+$/) != null) {
          if (timeout) {
            $timeout.cancel(timeout)
          }
          $scope.numbRequired = false;
          timeout = $timeout(saveUpdates, 3000);
        }
        else {
          $timeout.cancel(timeout);
        }
      }
    }
  };

  var saveUpdates = function() {
    bowtie.user.profile($scope.myUser)
    window.alert('Profile Information Saved.')
  };

  var delayApiCall = function(newVal, oldVal) {
    if (newVal != oldVal) {
      if (timeout) {
        $timeout.cancel(timeout)
      }
      timeout = $timeout(saveUpdates, 3000);
    }
  };
  $scope.$watch('myUser.angular_interest', delayApiCall)
  $scope.$watch('myUser.referral', delayApiCall)
  $scope.$watch('myUser.angular_user', delayApiCall)

}]);
