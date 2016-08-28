(function () {
  'use strict';

  angular
    .module('hotels.services')
    .factory('HotelsService', HotelsService);

  HotelsService.$inject = ['$resource'];

  function HotelsService($resource) {
    return $resource('api/hotels/:hotelId', {
      hotelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
