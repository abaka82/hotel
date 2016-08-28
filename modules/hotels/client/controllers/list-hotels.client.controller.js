(function () {
  'use strict';

  angular
    .module('hotels')
    .controller('HotelsListController', HotelsListController);

  HotelsListController.$inject = ['HotelsService'];

  function HotelsListController(HotelsService) {
    var vm = this;

    vm.hotels = HotelsService.query();
  }
}());
