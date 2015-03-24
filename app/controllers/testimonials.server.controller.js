'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Testimonial = mongoose.model('Testimonial'),
	_ = require('lodash');

/**
 * Create a Testimonial
 */
exports.create = function(req, res) {
	var testimonial = new Testimonial(req.body);
	testimonial.user = req.user;

	testimonial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimonial);
		}
	});
};

/**
 * Show the current Testimonial
 */
exports.read = function(req, res) {
	res.jsonp(req.testimonial);
};

/**
 * Update a Testimonial
 */
exports.update = function(req, res) {
	var testimonial = req.testimonial ;

	testimonial = _.extend(testimonial , req.body);

	testimonial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimonial);
		}
	});
};

/**
 * Delete an Testimonial
 */
exports.delete = function(req, res) {
	var testimonial = req.testimonial ;

	testimonial.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimonial);
		}
	});
};

/**
 * List of Testimonials
 */
exports.list = function(req, res) { 
	Testimonial.find().sort('-created').populate('user', 'displayName').exec(function(err, testimonials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimonials);
		}
	});
};

/**
 * Testimonial middleware
 */
exports.testimonialByID = function(req, res, next, id) { 
	Testimonial.findById(id).populate('user', 'displayName').exec(function(err, testimonial) {
		if (err) return next(err);
		if (! testimonial) return next(new Error('Failed to load Testimonial ' + id));
		req.testimonial = testimonial ;
		next();
	});
};

/**
 * Testimonial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.testimonial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
