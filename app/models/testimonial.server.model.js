'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Testimonial Schema
 */
var TestimonialSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  userDisplayName: {
    type: String,
    trim: true
  },
  userTitle: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    default: '',
    required: 'Testify!',
    trim: true
  },
  approved: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Testimonial', TestimonialSchema);