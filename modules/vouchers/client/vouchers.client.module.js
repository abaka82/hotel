(function (app) {
  'use strict';

  app.registerModule('vouchers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('vouchers.services');
  app.registerModule('vouchers.routes', ['ui.router', 'core.routes', 'vouchers.services']);
}(ApplicationConfiguration));
