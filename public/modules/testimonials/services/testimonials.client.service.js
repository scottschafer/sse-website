'use strict';

//Testimonials service used to communicate Testimonials REST endpoints
angular.module('testimonials').factory('Testimonials', ['$resource',
	function($resource) {
		return $resource('testimonials/:testimonialId', { testimonialId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);