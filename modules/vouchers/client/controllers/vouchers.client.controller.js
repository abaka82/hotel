(function () {
  'use strict';

  angular
    .module('vouchers')
    .controller('VouchersController', VouchersController);

  VouchersController.$inject = ['$scope', '$state', 'voucherResolve', '$window', 'Authentication'];

  function VouchersController($scope, $state, voucher, $window, Authentication) {
    var vm = this;

    vm.voucher = voucher;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Voucher
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.voucher.$remove($state.go('vouchers.list'));
      }
    }

    // Save Voucher
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.voucherForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.voucher._id) {
        vm.voucher.$update(successCallback, errorCallback);
      } else {
        vm.voucher.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vouchers.view', {
          voucherId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
