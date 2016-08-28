(function () {
  'use strict';

  angular
    .module('vouchers')
    .controller('VouchersListController', VouchersListController);

  VouchersListController.$inject = ['VouchersService'];

  function VouchersListController(VouchersService) {
    var vm = this;

    vm.vouchers = VouchersService.query();
  }
}());
