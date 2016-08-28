'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hotel = mongoose.model('Hotel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an hotel
 */
exports.create = function (req, res) {
  var hotel = new Hotel(req.body);
  hotel.user = req.user;

  hotel.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hotel);
    }
  });
};

/**
 * Show the current hotel
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var hotel = req.hotel ? req.hotel.toJSON() : {};

  // Add a custom field to the Hotel, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Hotel model.
  hotel.isCurrentUserOwner = !!(req.user && hotel.user && hotel.user._id.toString() === req.user._id.toString());

  res.json(hotel);
};

/**
 * Update an hotel
 */
exports.update = function (req, res) {
  var hotel = req.hotel;

  hotel.hotelID = req.body.hotelID;
  hotel.startURL = req.body.startURL;
  hotel.hotelName = req.body.hotelName;
  hotel.address = req.body.address;
  hotel.stars = req.body.stars;
  hotel.website = req.body.website;
  hotel.websiteURL = req.body.websiteURL;
  hotel.mapURL = req.body.mapURL;
  hotel.numberOfGoogleReviews = req.body.numberOfGoogleReviews;
  hotel.booking_comPrice = req.body.booking_comPrice;
  hotel.hotels_comPrice = req.body.hotels_comPrice;
  hotel.agodaPrice = req.body.agodaPrice;
  hotel.otherPrice = req.body.otherPrice;

  hotel.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hotel);
    }
  });
};

/**
 * Delete an hotel
 */
exports.delete = function (req, res) {
  var hotel = req.hotel;

  hotel.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hotel);
    }
  });
};

/**
 * List of Hotels
 */
exports.list = function (req, res) {
  Hotel.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
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
 * Hotel middleware
 */
exports.hotelByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hotel is invalid'
    });
  }

  Hotel.findById(id).populate('user', 'displayName').exec(function (err, hotel) {
    if (err) {
      return next(err);
    } else if (!hotel) {
      return res.status(404).send({
        message: 'No hotel with that identifier has been found'
      });
    }
    req.hotel = hotel;
    next();
  });
};
