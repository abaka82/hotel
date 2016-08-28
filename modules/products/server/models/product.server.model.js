'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: 'Category cannot be blank'
  },
  imageUrl: String,
  price: {
    type: Number,
    default: 0,
    min: 0,
    max: 999999999,
    required: 'Price cannot be blank'
  },
  size: String,
  colour: String,
  stock: Number,
  status: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
