'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CartSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  qty: {
    type: Number,
    default: 0,
    required: 'Qty cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cart', CartSchema);
