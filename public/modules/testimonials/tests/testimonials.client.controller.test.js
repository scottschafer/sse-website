'use strict';

(function() {
	// Testimonials Controller Spec
	describe('Testimonials Controller Tests', function() {
		// Initialize global variables
		var TestimonialsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Testimonials controller.
			TestimonialsController = $controller('TestimonialsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Testimonial object fetched from XHR', inject(function(Testimonials) {
			// Create sample Testimonial using the Testimonials service
			var sampleTestimonial = new Testimonials({
				name: 'New Testimonial'
			});

			// Create a sample Testimonials array that includes the new Testimonial
			var sampleTestimonials = [sampleTestimonial];

			// Set GET response
			$httpBackend.expectGET('testimonials').respond(sampleTestimonials);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testimonials).toEqualData(sampleTestimonials);
		}));

		it('$scope.findOne() should create an array with one Testimonial object fetched from XHR using a testimonialId URL parameter', inject(function(Testimonials) {
			// Define a sample Testimonial object
			var sampleTestimonial = new Testimonials({
				name: 'New Testimonial'
			});

			// Set the URL parameter
			$stateParams.testimonialId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/testimonials\/([0-9a-fA-F]{24})$/).respond(sampleTestimonial);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testimonial).toEqualData(sampleTestimonial);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Testimonials) {
			// Create a sample Testimonial object
			var sampleTestimonialPostData = new Testimonials({
				name: 'New Testimonial'
			});

			// Create a sample Testimonial response
			var sampleTestimonialResponse = new Testimonials({
				_id: '525cf20451979dea2c000001',
				name: 'New Testimonial'
			});

			// Fixture mock form input values
			scope.name = 'New Testimonial';

			// Set POST response
			$httpBackend.expectPOST('testimonials', sampleTestimonialPostData).respond(sampleTestimonialResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Testimonial was created
			expect($location.path()).toBe('/testimonials/' + sampleTestimonialResponse._id);
		}));

		it('$scope.update() should update a valid Testimonial', inject(function(Testimonials) {
			// Define a sample Testimonial put data
			var sampleTestimonialPutData = new Testimonials({
				_id: '525cf20451979dea2c000001',
				name: 'New Testimonial'
			});

			// Mock Testimonial in scope
			scope.testimonial = sampleTestimonialPutData;

			// Set PUT response
			$httpBackend.expectPUT(/testimonials\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/testimonials/' + sampleTestimonialPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid testimonialId and remove the Testimonial from the scope', inject(function(Testimonials) {
			// Create new Testimonial object
			var sampleTestimonial = new Testimonials({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Testimonials array and include the Testimonial
			scope.testimonials = [sampleTestimonial];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/testimonials\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTestimonial);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.testimonials.length).toBe(0);
		}));
	});
}());