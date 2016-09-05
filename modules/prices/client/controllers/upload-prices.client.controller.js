(function () {
  'use strict';

  angular
    .module('prices')
    .controller('PricesUploadController', PricesUploadController);

  PricesUploadController.$inject = ['$scope', '$state', 'HotelsService', 'PricesService'];

  function PricesUploadController($scope, $state, HotelsService, PricesService) {
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
    vm.csv.result.count = 0;

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

    vm.savePrice = function () {
      var selectedCount = 0;
      vm.csv.result.forEach(function(csvIitem) {
        if (csvIitem.isChecked) {
          selectedCount = selectedCount + 1;

          console.log('save into db: '+JSON.stringify(csvIitem));

          vm.price = new PricesService();
          vm.price.hotelID = csvIitem['hotelID'];
          vm.price.checkIn = csvIitem['Check-in'];
          vm.price.hotelName = csvIitem['Hotel Name'];
          vm.price.URL = csvIitem['URL'];
          vm.price.address = csvIitem['Street Address'];
          vm.price.city = csvIitem['City'];
          vm.price.state = csvIitem['State'];
          vm.price.postalCode = csvIitem['Postal Code'];
          vm.price.country = csvIitem['Country'];
          vm.price.currentPrice = csvIitem['Current Price (USD)'];
          vm.price.oldPrice = csvIitem['Old Price (USD)'];

          vm.price.$save(successCallback, errorCallback);

          function successCallback(res) {
            console.log('success add price with id: '+res.id);
          }

          function errorCallback(res) {
            vm.errorTranslation = res.data.message;
          }


        }
      });

      if (selectedCount === 0) {
        alert('No hotel price selected');
      } else {
        $state.go('prices.list')
      };
    };


    vm.callback = function() {
      console.log('Done reading csv file.');
      console.log('Content: ' + JSON.stringify(vm.csv.result));

      var csvHotelName = '';
      var hotelName = '';
      vm.csv.result.count = 0;

      vm.csv.result.forEach(function(csvIitem) {
        csvHotelName = csvIitem['Hotel Name'].toLowerCase();
        csvIitem.hotelID = '';
        vm.csv.result.count = vm.csv.result.count + 1;

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
