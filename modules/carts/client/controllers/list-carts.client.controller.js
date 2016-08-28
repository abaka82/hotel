(function () {
  'use strict';

  angular
    .module('carts')
    .controller('CartsListController', CartsListController);

  CartsListController.$inject = ['$state', 'CartsService', 'SearchByUser', 'Authentication', 'vouchersResolve', 'toastr'];

  function CartsListController($state, CartsService, SearchByUser, Authentication, vouchers, toastr) {
    var vm = this;

    // list all shopping carts
    // note that we must login first
    // for demo purpose, also able to view shopping cart if not login by list ALL cart
    vm.authentication = Authentication;

    if (!vm.authentication.user._id) {
      vm.carts = CartsService.query();
    } else {
      vm.carts = SearchByUser.query({ userId: vm.authentication.user._id });
    }

    // apply and lookup the voucher
    vm.vouchers = vouchers;
    vm.isFound = false;
    vm.applyDiscountPercent = 0;
    vm.applyDiscountAmount = 0;

    vm.applyVoucher = function() {
      vm.isFound = false;
      angular.forEach(vm.vouchers, function(value, index) {
        if (value.voucherCode === vm.voucher) {
          vm.isFound = true;
          vm.applyDiscountPercent = value.discountPercent;
          vm.applyDiscountAmount = value.discountAmount;
        }
      });
      if (!vm.isFound) {
        toastr.error('Voucher discount not found!');
      }
    };

    vm.deleteCart = function(cartId) {
      return CartsService.delete({ cartId: cartId }).$promise
        .then(function (cart) {
          toastr.success('Cart has been deleted successfully');
          $state.reload();
        }).catch(function (err) {
          toastr.error('There is an error: ' + err.data.message);
        });
    };
  }
}());
