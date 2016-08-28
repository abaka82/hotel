(function () {
  'use strict';

  angular
    .module('hotels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Hotels',
      state: 'hotels',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'hotels', {
      title: 'List Hotels',
      state: 'hotels.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hotels', {
      title: 'Create Hotel',
      state: 'hotels.create',
      roles: ['user']
    });
  }
}());
