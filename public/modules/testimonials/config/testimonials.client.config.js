'use strict';

// Configuring the Articles module
angular.module('testimonials').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Testimonials', 'testimonials', 'dropdown', '/testimonials(/create)?');
		Menus.addSubMenuItem('topbar', 'testimonials', 'List Testimonials', 'testimonials');
		Menus.addSubMenuItem('topbar', 'testimonials', 'New Testimonial', 'testimonials/create');
	}
]);