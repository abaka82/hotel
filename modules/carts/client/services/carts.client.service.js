(function () {
  'use strict';

  angular
    .module('carts.services')
    .factory('CartsService', CartsService)
    .factory('SearchByProduct', SearchByProduct)
    .factory('SearchByUser', SearchByUser);

  CartsService.$inject = ['$resource'];
  SearchByProduct.$inject = ['$resource', '$q'];
  SearchByUser.$inject = ['$resource', '$q'];

  function CartsService($resource) {
    return $resource('api/carts/:cartId', {
      cartId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function SearchByProduct($resource) {
    return $resource('/api/carts/searchByProduct/:productId', { productId: '@productId' }, {
      get: {
        method: 'GET',
        isArray: false
      }
    });
  }

  function SearchByUser($resource) {
    return $resource('/api/carts/searchByUser/:userId', { userId: '@userId' }, {
      get: {
        method: 'GET',
        isArray: true
      }
    });
  }
}());
