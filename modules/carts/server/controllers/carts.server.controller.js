'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cart = mongoose.model('Cart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an cart
 */
exports.create = function (req, res) {
  var cart = new Cart(req.body);
  cart.user = req.user;

  cart.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cart);
    }
  });
};

/**
 * Show the current cart
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cart = req.cart ? req.cart.toJSON() : {};

  // Add a custom field to the Cart, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Cart model.
  cart.isCurrentUserOwner = !!(req.user && cart.user && cart.user._id.toString() === req.user._id.toString());

  res.json(cart);
};

/**
 * Update an cart, especially the Qty
 */
exports.update = function (req, res) {
  var cart = req.cart;
  cart.qty = req.body.qty;

  cart.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cart);
    }
  });
};

/**
 * Delete an cart
 */
exports.delete = function (req, res) {
  var cart = req.cart;

  cart.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cart);
    }
  });
};

/**
 * List of Carts
 */
exports.list = function (req, res) {
  Cart.find().sort('-created')
  .populate('user', 'displayName')
  .populate('product')
  .exec(function (err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(carts);
    }
  });
};

/**
 * Cart middleware
 */
exports.cartByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cart is invalid'
    });
  }

  Cart.findById(id)
  .populate('user', 'displayName')
  .populate('product')
  .exec(function (err, cart) {
    if (err) {
      return next(err);
    } else if (!cart) {
      return res.status(404).send({
        message: 'No cart with that identifier has been found'
      });
    }
    req.cart = cart;
    next();
  });
};

exports.searchByProduct = function(req, res) {
 // Cart.findOne({ 'product': req.params.productId, 'user': req.params.userId })
  Cart.findOne({ 'product': req.params.productId, 'user': req.user._id })
  .sort('-createdDate')
  .populate('user', 'displayName')
  .populate('product')
  .exec(function (err, cart) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cart);
    }
  });
};

exports.searchByUser = function(req, res) {
  Cart.find({ 'user': req.user._id })
  .sort('-createdDate')
  .populate('user', 'displayName')
  .populate('product')
  .exec(function (err, cart) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cart);
    }
  });

};
