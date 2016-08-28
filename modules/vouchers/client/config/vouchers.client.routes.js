(function () {
  'use strict';

  angular
    .module('vouchers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vouchers', {
        abstract: true,
        url: '/vouchers',
        template: '<ui-view/>'
      })
      .state('vouchers.list', {
        url: '',
        templateUrl: 'modules/vouchers/client/views/list-vouchers.client.view.html',
        controller: 'VouchersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vouchers List'
        }
      })
      .state('vouchers.create', {
        url: '/create',
        templateUrl: 'modules/vouchers/client/views/form-voucher.client.view.html',
        controller: 'VouchersController',
        controllerAs: 'vm',
        resolve: {
          voucherResolve: newVoucher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Vouchers Create'
        }
      })
      .state('vouchers.edit', {
        url: '/:voucherId/edit',
        templateUrl: 'modules/vouchers/client/views/form-voucher.client.view.html',
        controller: 'VouchersController',
        controllerAs: 'vm',
        resolve: {
          voucherResolve: getVoucher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Voucher {{ voucherResolve.title }}'
        }
      })
      .state('vouchers.view', {
        url: '/:voucherId',
        templateUrl: 'modules/vouchers/client/views/view-voucher.client.view.html',
        controller: 'VouchersController',
        controllerAs: 'vm',
        resolve: {
          voucherResolve: getVoucher
        },
        data: {
          pageTitle: 'Voucher {{ voucherResolve.title }}'
        }
      });
  }

  getVoucher.$inject = ['$stateParams', 'VouchersService'];

  function getVoucher($stateParams, VouchersService) {
    return VouchersService.get({
      voucherId: $stateParams.voucherId
    }).$promise;
  }

  newVoucher.$inject = ['VouchersService'];

  function newVoucher(VouchersService) {
    return new VouchersService();
  }
}());
