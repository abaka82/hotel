(function () {
  'use strict';

  angular
    .module('vouchers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Vouchers',
      state: 'vouchers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'vouchers', {
      title: 'List Vouchers',
      state: 'vouchers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'vouchers', {
      title: 'Create Voucher',
      state: 'vouchers.create',
      roles: ['user']
    });
  }
}());
