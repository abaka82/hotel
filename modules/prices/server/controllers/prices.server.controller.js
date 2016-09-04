'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Price = mongoose.model('Price'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an price
 */
exports.create = function (req, res) {
  var price = new Price(req.body);
  price.user = req.user;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * Show the current price
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var price = req.price ? req.price.toJSON() : {};

  // Add a custom field to the Price, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Price model.
  price.isCurrentUserOwner = !!(req.user && price.user && price.user._id.toString() === req.user._id.toString());

  res.json(price);
};

/**
 * Update an price
 */
exports.update = function (req, res) {
  var price = req.price;

  price.priceID = req.body.priceID;
  price.startURL = req.body.startURL;
  price.priceName = req.body.priceName;
  price.address = req.body.address;
  price.stars = req.body.stars;
  price.website = req.body.website;
  price.websiteURL = req.body.websiteURL;
  price.mapURL = req.body.mapURL;
  price.numberOfGoogleReviews = req.body.numberOfGoogleReviews;
  price.booking_comPrice = req.body.booking_comPrice;
  price.prices_comPrice = req.body.prices_comPrice;
  price.agodaPrice = req.body.agodaPrice;
  price.otherPrice = req.body.otherPrice;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * Delete an price
 */
exports.delete = function (req, res) {
  var price = req.price;

  price.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * List of Prices
 */
exports.list = function (req, res) {
  Price.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
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
 * Price middleware
 */
exports.priceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Price is invalid'
    });
  }

  Price.findById(id).populate('user', 'displayName').exec(function (err, price) {
    if (err) {
      return next(err);
    } else if (!price) {
      return res.status(404).send({
        message: 'No price with that identifier has been found'
      });
    }
    req.price = price;
    next();
  });
};
