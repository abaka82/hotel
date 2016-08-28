(function (app) {
  'use strict';

  app.registerModule('carts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('carts.services');
  app.registerModule('carts.routes', ['ui.router', 'core.routes', 'carts.services']);
}(ApplicationConfiguration));
