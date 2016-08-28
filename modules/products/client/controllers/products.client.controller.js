(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', 'SearchByProduct', 'CartsService', 'productResolve', '$window', 'Authentication', 'categoriesResolve', 'toastr'];

  function ProductsController($scope, $state, SearchByProduct, CartsService, product, $window, Authentication, categories, toastr) {
    var vm = this;

    vm.cart = {};
    vm.product = product;
    vm.categories = categories;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.getQtyList = function(num) { return new Array(num); };

    vm.addToCart = function(form) {
      if (!vm.cart.qty) {
        toastr.error('Please select Quantity first');
      } else {
        vm.cart.product = vm.product._id;
        vm.cart.user = vm.authentication.user._id;

        SearchByProduct.get({ productId: vm.product._id }).$promise.then(function (cart) {
          if (cart.qty > 0) {
            vm.cart.qty = cart.qty + parseInt(vm.cart.qty, 10);

            if (vm.cart.qty > cart.product.stock) {
              toastr.error('Total Cart qty (' + vm.cart.qty + ') is greater than stock qty (' + cart.product.stock + ')');
              vm.cart.qty = cart.qty;
            } else {
              return CartsService.update({ cartId: cart._id }, vm.cart).$promise
              .then(function (cart) {
                toastr.success('Cart has been updated successfully');
                $state.reload();
              }).catch(function (err) {
                toastr.error('There is an error: ' + err.data.message);
              });
            }
          } else {
            return CartsService.save(vm.cart).$promise
            .then(function (cart) {
              toastr.success('New cart has been added successfully');
              $state.reload();
            }).catch(function (err) {
              toastr.error('There is an error: ' + err.data.message);
            });
          }
        });
      }
    };

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      vm.product.category = vm.product.categoryId;

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
