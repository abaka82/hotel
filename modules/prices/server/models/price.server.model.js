'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Price Schema
 */

var PriceSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  checkIn: {
    type: String,
    default: '',
    trim: true
  },
  hotelName: {
    type: String,
    default: '',
    trim: true,
    required: 'Hotel name cannot be blank'
  },
  hotelID: {
    type: String,
    default: '',
    trim: true
  },
  URL: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  postalCode: {
    type: String,
    default: '',
    trim: true
  },
  country: {
    type: String,
    default: '',
    trim: true
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  oldPrice: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Price', PriceSchema);
