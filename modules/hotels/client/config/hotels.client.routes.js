(function () {
  'use strict';

  angular
    .module('hotels.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hotels', {
        abstract: true,
        url: '/hotels',
        template: '<ui-view/>'
      })
      .state('hotels.list', {
        url: '',
        templateUrl: 'modules/hotels/client/views/list-hotels.client.view.html',
        controller: 'HotelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hotels List'
        }
      })
      .state('hotels.create', {
        url: '/create',
        templateUrl: 'modules/hotels/client/views/form-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: newHotel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hotels Create'
        }
      })
      .state('hotels.edit', {
        url: '/:hotelId/edit',
        templateUrl: 'modules/hotels/client/views/form-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: getHotel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hotel {{ hotelResolve.title }}'
        }
      })
      .state('hotels.view', {
        url: '/:hotelId',
        templateUrl: 'modules/hotels/client/views/view-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: getHotel
        },
        data: {
          pageTitle: 'Hotel {{ hotelResolve.title }}'
        }
      });
  }

  getHotel.$inject = ['$stateParams', 'HotelsService'];

  function getHotel($stateParams, HotelsService) {
    return HotelsService.get({
      hotelId: $stateParams.hotelId
    }).$promise;
  }

  newHotel.$inject = ['HotelsService'];

  function newHotel(HotelsService) {
    return new HotelsService();
  }
}());
