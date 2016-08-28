(function () {
  'use strict';

  angular
    .module('carts')
    .controller('CartsController', CartsController);

  CartsController.$inject = ['$scope', '$state', 'cartResolve', '$window', 'Authentication'];

  function CartsController($scope, $state, cart, $window, Authentication) {
    var vm = this;

    vm.cart = cart;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cart
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cart.$remove($state.go('carts.list'));
      }
    }

    // Save Cart
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cartForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cart._id) {
        vm.cart.$update(successCallback, errorCallback);
      } else {
        vm.cart.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('carts.view', {
          cartId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
