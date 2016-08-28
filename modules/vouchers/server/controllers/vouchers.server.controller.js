'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Voucher = mongoose.model('Voucher'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an voucher
 */
exports.create = function (req, res) {
  var voucher = new Voucher(req.body);
  voucher.user = req.user;

  voucher.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(voucher);
    }
  });
};

/**
 * Show the current voucher
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var voucher = req.voucher ? req.voucher.toJSON() : {};

  // Add a custom field to the Voucher, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Voucher model.
  voucher.isCurrentUserOwner = !!(req.user && voucher.user && voucher.user._id.toString() === req.user._id.toString());

  res.json(voucher);
};

/**
 * Update an voucher
 */
exports.update = function (req, res) {
  var voucher = req.voucher;

  voucher.title = req.body.title;
  voucher.content = req.body.content;

  voucher.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(voucher);
    }
  });
};

/**
 * Delete an voucher
 */
exports.delete = function (req, res) {
  var voucher = req.voucher;

  voucher.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(voucher);
    }
  });
};

/**
 * List of Vouchers
 */
exports.list = function (req, res) {
  Voucher.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

/**
 * Voucher middleware
 */
exports.voucherByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Voucher is invalid'
    });
  }

  Voucher.findById(id).populate('user', 'displayName').exec(function (err, voucher) {
    if (err) {
      return next(err);
    } else if (!voucher) {
      return res.status(404).send({
        message: 'No voucher with that identifier has been found'
      });
    }
    req.voucher = voucher;
    next();
  });
};
