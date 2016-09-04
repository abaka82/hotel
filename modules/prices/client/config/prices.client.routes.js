(function () {
  'use strict';

  angular
    .module('prices.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('prices', {
        abstract: true,
        url: '/prices',
        template: '<ui-view/>'
      })
      .state('prices.upload', {
        url: '',
        templateUrl: 'modules/prices/client/views/upload-prices.client.view.html',
        controller: 'PricesUploadController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Prices CSV Upload Util'
        }
      })
      .state('prices.list', {
        url: '',
        templateUrl: 'modules/prices/client/views/list-prices.client.view.html',
        controller: 'PricesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Prices List'
        }
      })
      .state('prices.create', {
        url: '/create',
        templateUrl: 'modules/prices/client/views/form-price.client.view.html',
        controller: 'PricesController',
        controllerAs: 'vm',
        resolve: {
          priceResolve: newPrice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Prices Create'
        }
      })
      .state('prices.edit', {
        url: '/:priceId/edit',
        templateUrl: 'modules/prices/client/views/form-price.client.view.html',
        controller: 'PricesController',
        controllerAs: 'vm',
        resolve: {
          priceResolve: getPrice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Price {{ priceResolve.title }}'
        }
      })
      .state('prices.view', {
        url: '/:priceId',
        templateUrl: 'modules/prices/client/views/view-price.client.view.html',
        controller: 'PricesController',
        controllerAs: 'vm',
        resolve: {
          priceResolve: getPrice
        },
        data: {
          pageTitle: 'Price {{ priceResolve.title }}'
        }
      });
  }

  getPrice.$inject = ['$stateParams', 'PricesService'];

  function getPrice($stateParams, PricesService) {
    return PricesService.get({
      priceId: $stateParams.priceId
    }).$promise;
  }

  newPrice.$inject = ['PricesService'];

  function newPrice(PricesService) {
    return new PricesService();
  }
}());
