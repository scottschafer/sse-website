'use strict';

//Setting up route
angular.module('testimonials').config(['$stateProvider',
	function($stateProvider) {
		// Testimonials state routing
		$stateProvider.
		state('listTestimonials', {
			url: '/testimonials',
			templateUrl: 'modules/testimonials/views/list-testimonials.client.view.html'
		}).
		state('createTestimonial', {
			url: '/testimonials/create',
			templateUrl: 'modules/testimonials/views/create-testimonial.client.view.html'
		}).
		state('viewTestimonial', {
			url: '/testimonials/:testimonialId',
			templateUrl: 'modules/testimonials/views/view-testimonial.client.view.html'
		}).
		state('editTestimonial', {
			url: '/testimonials/:testimonialId/edit',
			templateUrl: 'modules/testimonials/views/edit-testimonial.client.view.html'
		});
	}
]);