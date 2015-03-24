'use strict';

angular.module('core').controller('HomeController', ['$scope', '$window', 'Authentication',
  function ($scope, $window, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.paused = false;
		$scope.arrived = false;
		
		$scope.actions = [
			{
				type: 'lookAt',
				target: 'earth',
				zoom: 0.1
			},
			{
				type: 'lookAt',
				target: 'earth',
				zoom: 1,
				minDuration: 2000,
				maxDuration: 2000
			}
		];

		$scope.onClick = function (section) {
			if ($scope.currentSection) {
				$scope.actions.push({
					type: 'lookAt',
					target: $scope.currentSection,
					zoom: 1,
					duration: 5000
				});
			}
			$scope.currentSection = section.link;
			$scope.actions.push({
				type: 'lookAt',
				target: section.link,
				zoom: 10,
				duration: 5000
			});
			$scope.actions.push({
				type: 'pause'
			});
			$scope.actions.push({
				type: 'arrived'
			});
		};

		$scope.onBack = function() {
			$scope.actions.push({
				type: 'lookAt',
				target: 'earth',
				zoom: 1,
				minDuration: 2000,
				maxDuration: 2000
			});
			$scope.actions.push({
				type: 'unpause'
			});
		}

		$scope.sections = [
			{
				link: 'skills',
				text: 'Skills'
			},
			{
				link: 'resume',
				text: 'Résumé'
			}
		];

		$scope.elements = {
			earth: {
				href: '/modules/core/img/earth.png',
				text: '',
				w: 225,
				h: 225,
				x: 0,
				y: 0,
				rotation: 0,

				angularVelocity: 0.02,
				velocity: {
					x: 0,
					y: 0
				}
			},

			skills: {
				href: '/modules/core/img/planet.png',
				text: 'Skills',
				w: 100,
				h: 100,
				x: -400,
				y: 200,
				velocity: {
					x: 0.5,
					y: 0.8
				},
				gravity: 1
			},

			resume: {
				href: '/modules/core/img/planet.png',
				text: 'My Résumé',
				w: 100,
				h: 100,
				x: -1000,
				y: -1000,
				velocity: {
					x: 0.0,
					y: 0.5
				},
				gravity: 1
			}
		};
 	}
]);