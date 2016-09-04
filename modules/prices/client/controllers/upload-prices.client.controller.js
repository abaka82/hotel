(function () {
  'use strict';

  angular
    .module('prices')
    .controller('PricesUploadController', PricesUploadController);

  PricesUploadController.$inject = ['$scope', 'HotelsService'];

  function PricesUploadController($scope, HotelsService) {
    var vm = this;

    vm.hotels = HotelsService.query();

    vm.csv = {
      content: null,
      header: true,
      headerVisible: false,
      separator: ',',
      separatorVisible: false,
      result: null,
      encoding: 'ISO-8859-1',
      encodingVisible: false
    };
    vm.csv.result = {};

    // This property will be bound to checkbox in table header
    vm.csv.result.allItemsSelected = false;

    // This executes when entity in table is checked
    vm.selectEntity = function () {
      // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
      for (var i = 0; i < vm.csv.result.length; i++) {
        if (!vm.csv.result[i].isChecked) {
          vm.csv.result.allItemsSelected = false;
          return;
        }
      }
      // If not the check the "allItemsSelected" checkbox
      vm.csv.result.allItemsSelected = true;
    };

    // This executes when checkbox in table header is checked
    vm.selectAll = function () {
      // Loop through all the entities and set their isChecked property
      for (var i = 0; i < vm.csv.result.length; i++) {
        vm.csv.result[i].isChecked = vm.csv.result.allItemsSelected;
      }
    };

    vm.callback = function() {
      console.log('Done reading csv file.');
      console.log('Content: ' + JSON.stringify(vm.csv.result));

      var csvHotelName = '';
      var hotelName = '';

      vm.csv.result.forEach(function(csvIitem) {
        csvHotelName = csvIitem['Hotel Name'].toLowerCase();
        csvIitem.hotelID = '';

        // loop to hotel db to search for hotel ID
        vm.hotels.forEach(function(hotelItem) {
          // console.log('hotelItem.hotelName: '+hotelItem.hotelName);
          hotelName = hotelItem.hotelName.toLowerCase();
          if (hotelName.indexOf(csvHotelName) !== -1) {
            console.log('Matched: ' + hotelItem.hotelName);
            console.log('Id : ' + hotelItem.hotelID);
            csvIitem.hotelID = hotelItem.hotelID;
          }
        });
      });
      // refresh grid
      $scope.$apply();
    };
  }
}());
