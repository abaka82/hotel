(function () {
  'use strict';

  angular
    .module('hotels')
    .controller('HotelsController', HotelsController);

  HotelsController.$inject = ['$scope', '$state', 'hotelResolve', '$window', 'Authentication'];

  function HotelsController($scope, $state, hotel, $window, Authentication) {
    var vm = this;

    vm.hotel = hotel;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hotel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hotel.$remove($state.go('hotels.list'));
      }
    }

    // Save Hotel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hotelForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hotel._id) {
        vm.hotel.$update(successCallback, errorCallback);
      } else {
        vm.hotel.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hotels.view', {
          hotelId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
