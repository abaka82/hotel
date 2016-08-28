(function () {
  'use strict';

  angular
    .module('categories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Categories',
      state: 'categories',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'categories', {
      title: 'List Categories',
      state: 'categories.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'categories', {
      title: 'Create Category',
      state: 'categories.create',
      roles: ['user']
    });
  }
}());
