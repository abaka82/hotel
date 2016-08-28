'use strict';

/**
 * Module dependencies
 */
var vouchersPolicy = require('../policies/vouchers.server.policy'),
  vouchers = require('../controllers/vouchers.server.controller');

module.exports = function (app) {
  // Vouchers collection routes
  app.route('/api/vouchers').all(vouchersPolicy.isAllowed)
    .get(vouchers.list)
    .post(vouchers.create);

  // Single voucher routes
  app.route('/api/vouchers/:voucherId').all(vouchersPolicy.isAllowed)
    .get(vouchers.read)
    .put(vouchers.update)
    .delete(vouchers.delete);

  // Finish by binding the voucher middleware
  app.param('voucherId', vouchers.voucherByID);
};
