(function () {
  'use strict';

  angular
    .module('vouchers.services')
    .factory('VouchersService', VouchersService);

  VouchersService.$inject = ['$resource'];

  function VouchersService($resource) {
    return $resource('api/vouchers/:voucherId', {
      voucherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
