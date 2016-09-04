(function (app) {
  'use strict';

  app.registerModule('prices', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('prices.services');
  app.registerModule('prices.routes', ['ui.router', 'core.routes', 'prices.services']);
}(ApplicationConfiguration));
