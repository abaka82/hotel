(function (app) {
  'use strict';

  app.registerModule('hotels', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('hotels.services');
  app.registerModule('hotels.routes', ['ui.router', 'core.routes', 'hotels.services']);
}(ApplicationConfiguration));
