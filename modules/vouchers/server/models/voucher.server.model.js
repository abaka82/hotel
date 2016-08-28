'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Voucher Schema
 */
var VoucherSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  voucherCode: {
    type: String,
    default: '',
    trim: true,
    required: 'Voucher Code cannot be blank'
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0,
    max: 999999999
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Voucher', VoucherSchema);
