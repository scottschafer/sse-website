'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Testimonial = mongoose.model('Testimonial'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, testimonial;

/**
 * Testimonial routes tests
 */
describe('Testimonial CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Testimonial
		user.save(function() {
			testimonial = {
				name: 'Testimonial Name'
			};

			done();
		});
	});

	it('should be able to save Testimonial instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimonial
				agent.post('/testimonials')
					.send(testimonial)
					.expect(200)
					.end(function(testimonialSaveErr, testimonialSaveRes) {
						// Handle Testimonial save error
						if (testimonialSaveErr) done(testimonialSaveErr);

						// Get a list of Testimonials
						agent.get('/testimonials')
							.end(function(testimonialsGetErr, testimonialsGetRes) {
								// Handle Testimonial save error
								if (testimonialsGetErr) done(testimonialsGetErr);

								// Get Testimonials list
								var testimonials = testimonialsGetRes.body;

								// Set assertions
								(testimonials[0].user._id).should.equal(userId);
								(testimonials[0].name).should.match('Testimonial Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Testimonial instance if not logged in', function(done) {
		agent.post('/testimonials')
			.send(testimonial)
			.expect(401)
			.end(function(testimonialSaveErr, testimonialSaveRes) {
				// Call the assertion callback
				done(testimonialSaveErr);
			});
	});

	it('should not be able to save Testimonial instance if no name is provided', function(done) {
		// Invalidate name field
		testimonial.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimonial
				agent.post('/testimonials')
					.send(testimonial)
					.expect(400)
					.end(function(testimonialSaveErr, testimonialSaveRes) {
						// Set message assertion
						(testimonialSaveRes.body.message).should.match('Please fill Testimonial name');
						
						// Handle Testimonial save error
						done(testimonialSaveErr);
					});
			});
	});

	it('should be able to update Testimonial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimonial
				agent.post('/testimonials')
					.send(testimonial)
					.expect(200)
					.end(function(testimonialSaveErr, testimonialSaveRes) {
						// Handle Testimonial save error
						if (testimonialSaveErr) done(testimonialSaveErr);

						// Update Testimonial name
						testimonial.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Testimonial
						agent.put('/testimonials/' + testimonialSaveRes.body._id)
							.send(testimonial)
							.expect(200)
							.end(function(testimonialUpdateErr, testimonialUpdateRes) {
								// Handle Testimonial update error
								if (testimonialUpdateErr) done(testimonialUpdateErr);

								// Set assertions
								(testimonialUpdateRes.body._id).should.equal(testimonialSaveRes.body._id);
								(testimonialUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Testimonials if not signed in', function(done) {
		// Create new Testimonial model instance
		var testimonialObj = new Testimonial(testimonial);

		// Save the Testimonial
		testimonialObj.save(function() {
			// Request Testimonials
			request(app).get('/testimonials')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Testimonial if not signed in', function(done) {
		// Create new Testimonial model instance
		var testimonialObj = new Testimonial(testimonial);

		// Save the Testimonial
		testimonialObj.save(function() {
			request(app).get('/testimonials/' + testimonialObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', testimonial.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Testimonial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimonial
				agent.post('/testimonials')
					.send(testimonial)
					.expect(200)
					.end(function(testimonialSaveErr, testimonialSaveRes) {
						// Handle Testimonial save error
						if (testimonialSaveErr) done(testimonialSaveErr);

						// Delete existing Testimonial
						agent.delete('/testimonials/' + testimonialSaveRes.body._id)
							.send(testimonial)
							.expect(200)
							.end(function(testimonialDeleteErr, testimonialDeleteRes) {
								// Handle Testimonial error error
								if (testimonialDeleteErr) done(testimonialDeleteErr);

								// Set assertions
								(testimonialDeleteRes.body._id).should.equal(testimonialSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Testimonial instance if not signed in', function(done) {
		// Set Testimonial user 
		testimonial.user = user;

		// Create new Testimonial model instance
		var testimonialObj = new Testimonial(testimonial);

		// Save the Testimonial
		testimonialObj.save(function() {
			// Try deleting Testimonial
			request(app).delete('/testimonials/' + testimonialObj._id)
			.expect(401)
			.end(function(testimonialDeleteErr, testimonialDeleteRes) {
				// Set message assertion
				(testimonialDeleteRes.body.message).should.match('User is not logged in');

				// Handle Testimonial error error
				done(testimonialDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Testimonial.remove().exec();
		done();
	});
});