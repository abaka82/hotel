(function () {
  'use strict';

  angular
    .module('prices')
    .controller('PricesController', PricesController);

  PricesController.$inject = ['$scope', '$state', 'priceResolve', '$window', 'Authentication'];

  function PricesController($scope, $state, price, $window, Authentication) {
    var vm = this;

    vm.price = price;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Price
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.price.$remove($state.go('prices.list'));
      }
    }

    // Save Price
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.priceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.price._id) {
        vm.price.$update(successCallback, errorCallback);
      } else {
        vm.price.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('prices.view', {
          priceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
