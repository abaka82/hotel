'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hotel Schema
 */

var HotelSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  hotelID: {
    type: String,
    default: '',
    trim: true,
    required: 'Hotel ID cannot be blank'
  },
  startURL: {
    type: String,
    default: '',
    trim: true
  },
  hotelName: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  stars: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  website: {
    type: String,
    default: '',
    trim: true
  },
  websiteURL: {
    type: String,
    default: '',
    trim: true
  },
  mapURL: {
    type: String,
    default: '',
    trim: true
  },
  numberOfGoogleReviews: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000000
  },
  booking_comPrice: {
    type: String,
    default: '',
    trim: true
  },
  hotels_comPrice: {
    type: String,
    default: '',
    trim: true
  },
  agodaPrice: {
    type: String,
    default: '',
    trim: true
  },
  otherPrice: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Hotel', HotelSchema);
