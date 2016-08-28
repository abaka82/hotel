(function () {
  'use strict';

  angular
    .module('carts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Shopping Carts',
      state: 'carts.list',
      roles: ['*']
    });
/*
    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'carts', {
      title: 'List Carts',
      state: 'carts.list'
    });*/

  }
}());
