(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['$state', 'ProductsService', 'CategoriesService', '$filter', 'ngTableParams', 'toastr'];

  function ProductsListController($state, ProductsService, CategoriesService, $filter, ngTableParams, toastr) {
    var vm = this;
    var orderBy = $filter('orderBy');

    vm.products = ProductsService.query();
    vm.categories = CategoriesService.query();
    vm.searchKeyword = { title: '', price: '', size: '', colour: '' };

    vm.order = function(predicate) {
      vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
      vm.predicate = predicate;
    };

    // lint-disable: ngTableParams is an external library (new-cap)
    vm.listProductTable = new ngTableParams({     // eslint-disable-line new-cap
      page: 1,
      count: 3,
      filter: vm.searchKeyword
    }, {
      total: 0, // length of data
      getData: function ($defer, params) {
        ProductsService.query({}, function(response) {
          vm.products = response;

          if (params.filter().title || params.filter().price || params.filter().size || params.filter().colour) {
            vm.data = $filter('filter')(vm.products, params.filter());

            params.total(vm.data.length);
          } else {
            vm.data = vm.products.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(vm.products.length);
          }

        // set total for recalc pagination
          $defer.resolve(vm.data);
        });
      }
    });

    vm.deleteProduct = function(productId) {
      return ProductsService.delete({ productId: productId }).$promise
        .then(function (cart) {
          toastr.success('Product has been deleted successfully');
          $state.reload();
        }).catch(function (err) {
          toastr.error('There is an error: ' + err.data.message);
        });
    };
  }
}());

angular
 .module('products')
 .directive('ngConfirmClick', [
   function() {
     return {
       link: function (scope, element, attr) {
         var msg = attr.ngConfirmClick || 'Are you sure to delete this product??';
         var clickAction = attr.confirmedClick;
         element.bind('click', function (event) {
           if (window.confirm(msg)) {
             scope.$eval(clickAction);
           }
         });
       }
     };
   }]);
