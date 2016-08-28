'use strict';

/**
 * Module dependencies
 */
var hotelsPolicy = require('../policies/hotels.server.policy'),
  hotels = require('../controllers/hotels.server.controller');

module.exports = function (app) {
  // Hotels collection routes
  app.route('/api/hotels').all(hotelsPolicy.isAllowed)
    .get(hotels.list)
    .post(hotels.create);

  // Single hotel routes
  app.route('/api/hotels/:hotelId').all(hotelsPolicy.isAllowed)
    .get(hotels.read)
    .put(hotels.update)
    .delete(hotels.delete);

  // Finish by binding the hotel middleware
  app.param('hotelId', hotels.hotelByID);
};
