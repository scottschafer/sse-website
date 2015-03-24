'use strict';

// Testimonials controller
angular.module('testimonials').controller('TestimonialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Testimonials',
	function($scope, $stateParams, $location, Authentication, Testimonials) {
		$scope.authentication = Authentication;

		// Create new Testimonial
		$scope.create = function() {
			// Create new Testimonial object
			var testimonial = new Testimonials ({
				name: this.name
			});

			// Redirect after save
			testimonial.$save(function(response) {
				$location.path('testimonials/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Testimonial
		$scope.remove = function(testimonial) {
			if ( testimonial ) { 
				testimonial.$remove();

				for (var i in $scope.testimonials) {
					if ($scope.testimonials [i] === testimonial) {
						$scope.testimonials.splice(i, 1);
					}
				}
			} else {
				$scope.testimonial.$remove(function() {
					$location.path('testimonials');
				});
			}
		};

		// Update existing Testimonial
		$scope.update = function() {
			var testimonial = $scope.testimonial;

			testimonial.$update(function() {
				$location.path('testimonials/' + testimonial._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Testimonials
		$scope.find = function() {
			$scope.testimonials = Testimonials.query();
		};

		// Find existing Testimonial
		$scope.findOne = function() {
			$scope.testimonial = Testimonials.get({ 
				testimonialId: $stateParams.testimonialId
			});
		};
	}
]);