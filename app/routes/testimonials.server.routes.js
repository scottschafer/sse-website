'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var testimonials = require('../../app/controllers/testimonials.server.controller');

	// Testimonials Routes
	app.route('/testimonials')
		.get(testimonials.list)
		.post(users.requiresLogin, testimonials.create);

	app.route('/testimonials/:testimonialId')
		.get(testimonials.read)
		.put(users.requiresLogin, testimonials.hasAuthorization, testimonials.update)
		.delete(users.requiresLogin, testimonials.hasAuthorization, testimonials.delete);

	// Finish by binding the Testimonial middleware
	app.param('testimonialId', testimonials.testimonialByID);
};
