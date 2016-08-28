'use strict';

/**
 * Module dependencies
 */
var cartsPolicy = require('../policies/carts.server.policy'),
  carts = require('../controllers/carts.server.controller');

module.exports = function (app) {
  // Carts collection routes
  app.route('/api/carts').all(cartsPolicy.isAllowed)
    .get(carts.list)
    .post(carts.create);

  // Single cart routes
  app.route('/api/carts/:cartId').all(cartsPolicy.isAllowed)
    .get(carts.read)
    .put(carts.update)
    .delete(carts.delete);

  app.route('/api/carts/searchByProduct/:productId').all(cartsPolicy.isAllowed)
    .get(carts.searchByProduct);

  app.route('/api/carts/searchByUser/:userId').all(cartsPolicy.isAllowed)
    .get(carts.searchByUser);

  // Finish by binding the cart middleware
  app.param('cartId', carts.cartByID);
};
