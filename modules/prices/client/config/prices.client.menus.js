(function () {
  'use strict';

  angular
    .module('prices')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Prices',
      state: 'prices',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'prices', {
      title: 'List Prices',
      state: 'prices.list'
    });

    menuService.addSubMenuItem('topbar', 'prices', {
      title: 'Upload Prices',
      state: 'prices.upload'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'prices', {
      title: 'Create Price',
      state: 'prices.create',
      roles: ['user']
    });
  }
}());
