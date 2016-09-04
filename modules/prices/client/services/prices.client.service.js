(function () {
  'use strict';

  angular
    .module('prices.services')
    .factory('PricesService', PricesService);

  PricesService.$inject = ['$resource'];

  function PricesService($resource) {
    return $resource('api/prices/:priceId', {
      priceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
