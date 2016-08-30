(function () {
  'use strict';

  angular
    .module('hotels')
    .controller('HotelsListController', HotelsListController);

  HotelsListController.$inject = ['HotelsService'];

  function HotelsListController(HotelsService) {
    var vm = this;

    vm.hotels = HotelsService.query();

    vm.clearSearch = function() {
      vm.search.$ = '';
      vm.search.hotelName = '';
      vm.search.address = '';
      vm.filterModelMin.price = 0;
      vm.filterModelMax.price = 1000000000000;
    };

    vm.byPriceRange = function (minValue, maxValue) {
      if ((minValue === undefined) || (minValue === null)) minValue = Number.MIN_VALUE;
      if ((maxValue === undefined) || (maxValue === null)) maxValue = Number.MAX_VALUE;

      var numberPattern = /\d+/g;  // search for any digit price

      return function predicateFunc(item) {
        var isFound = false;

        var price1 = item.hotels_comPrice.match(numberPattern);
        if (price1 !== null) {
          price1.forEach(function(entry) {
            if ((minValue <= parseInt(entry, 10)) && (parseInt(entry, 10) <= maxValue)) {
              isFound = true;
            }
          });
        }

        var price2 = item.agodaPrice.match(numberPattern);
        if (price2 !== null) {
          price2.forEach(function(entry) {
            if ((minValue <= parseInt(entry, 10)) && (parseInt(entry, 10) <= maxValue)) {
              isFound = true;
            }
          });
        }

        var price3 = item.booking_comPrice.match(numberPattern);
        if (price3 !== null) {
          price3.forEach(function(entry) {
            if ((minValue <= parseInt(entry, 10)) && (parseInt(entry, 10) <= maxValue)) {
              isFound = true;
            }
          });
        }

        var price4 = item.otherPrice.match(numberPattern);
        if (price4 !== null) {
          price4.forEach(function(entry) {
            if ((minValue <= parseInt(entry, 10)) && (parseInt(entry, 10) <= maxValue)) {
              isFound = true;
            }
          });
        }

        return isFound;
      };
    };
  }
}());
