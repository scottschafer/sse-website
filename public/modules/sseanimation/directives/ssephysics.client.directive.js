'use strict';

angular.module('sseanimation').directive('ssephysics', [
  function () {
		return {
			restrict: 'E',
			templateUrl: '/modules/sseanimation/directives/ssephysics.html',
			scope: {
				'elements': '=',
				'actions': '=',
				'paused': '=',
				'arrived': '='
			},

			link: function postLink(scope, element, attrs) {

				scope.$svg = element.find('svg');
				var elemModels = scope[attrs.elements];
				scope.elemModels = elemModels;

				function replaceAll(str, replace) {
					for (var key in replace) {
						str = str.replace(new RegExp(key, 'g'), replace[key]);
					}
					return str;
				}

				// build the SVG elements
				function buildElements($svg, elemModels) {
					/*jshint multistr: true */
					var elemId,
						elemModel,
						elemsHtml = '',
						elemTemplate =
						'<g id="%ID%" x="0" y="0" width="0" height="0"> \n \
						   <image xlink:href="%HREF%" x="%X%" y="%Y%" height="%H%px" width="%W%px" /> \n \
							 <text x="0" y="%TY%" width="%W%" font-family="Verdana" font-size="24" fill="rgba(255,255,255,.6)" text-anchor="middle">%TEXT%</text> \n \
						 </g>\n\n';

					for (elemId in elemModels) {
						elemModel = elemModels[elemId];

						elemsHtml += replaceAll(elemTemplate, {
							'%TEXT%': (elemModel.text),
							'%ID%': elemId,
							'%HREF%': elemModel.href,
							'%X%': (-elemModel.w / 2),
							'%Y%': (-elemModel.h / 2),
							'%W%': elemModel.w,
							'%H%': elemModel.h,
							'%TY%': elemModel.h / 3
						});
					}
					$svg[0].innerHTML = elemsHtml;

					for (elemId in elemModels) {
						elemModel = elemModels[elemId];
						elemModel.element = $svg.find('#' + elemId);
					}
				}
				buildElements(scope.$svg, elemModels);

				// update the size of the SVG DOM element
				function updateSVGSize() {
					var svgWidth = $(window).innerWidth();
					var svgHeight = $(window).innerHeight() - scope.$svg.offset().top + 8;

					scope.$svg.css('width', svgWidth + 'px');
					scope.$svg.css('height', svgHeight + 'px');
				}
				updateSVGSize();
				$(window).resize(function () {
					updateSVGSize();
				});

				// drive the physics and apply transforms to elements
				var lastTime = new Date().getTime();
				var currentAction;
				var lastViewBox;
				var lookAtTarget;

				function applyViewBox(lookAt) {
					lastViewBox = lookAt;
					var viewBox = lookAt.x + ' ' + lookAt.y + ' ' + lookAt.w + ' ' + lookAt.h;
					scope.$svg[0].setAttribute('viewBox', viewBox);

					var backgroundFactor = 4;
					var offsetX = -(lookAt.x + lookAt.w / 2) / backgroundFactor;
					var offsetY = -(lookAt.y + lookAt.h / 2) / backgroundFactor;

					while (offsetX > 200) offsetX -= 200;
					while (offsetX < -200) offsetX += 200;
					while (offsetY > 200) offsetY -= 200;
					while (offsetY < -200) offsetY += 200;

					var scaleBkg = 1 + (1000 / lookAt.w - 1) / 10;
					var transform = 'scale(' + scaleBkg + ') translate(' + offsetX + 'px, ' + offsetY + 'px)';
					$('.background').css({
						'transform': transform,
						'-webkit-transform': transform,
						'-moz-transform': transform
					});
				}

				function driveAnimation() {
					requestAnimationFrame(driveAnimation);

					var curTime = new Date().getTime();
					var elapsedTime = curTime - lastTime;
					lastTime = curTime;

					function calcLookAt(lookAt) {
						var elemModel = scope.elemModels[lookAt.target];
						var scale = 1 / lookAt.zoom;
						var size = 1000 * scale;
						return {
							x: (-size / 2 + elemModel.x),
							y: (-size / 2 + elemModel.y),
							w: size,
							h: size
						};
					}

					function applyModelToElement(model, element) {
						var transform = '';

						var x = model.x;
						var y = model.y;
						transform += 'translate(' + x + ' ' + y + ')';

						if (model.hasOwnProperty('rotation')) {
							transform += ' rotate(' + model.rotation + ' 0 0)';
						}

						element.attr('transform', transform);
					}

					function processActions() {
						if (currentAction && currentAction.done) {
							currentAction = null;
						}

						if (currentAction) {
							if (lastTime >= currentAction.endTime) {
								currentAction.done = true;
							}

							var nf = Math.min(1, (curTime - currentAction.startTime) / (currentAction.duration));
							var of = 1 - nf;
							switch (currentAction.type) {
							case 'lookAt':
								var lookAt = calcLookAt(currentAction);
								var from = currentAction.startViewBox;
								lookAt.x = lookAt.x * nf + from.x * of;
								lookAt.y = lookAt.y * nf + from.y * of;
								lookAt.w = lookAt.w * nf + from.w * of;
								lookAt.h = lookAt.h * nf + from.h * of;
								applyViewBox(lookAt);
								break;
							}
						}

						if (!currentAction && scope.actions.length > 0) {
							var action = scope.actions.shift();
							switch (action.type) {
							case 'arrived':
								scope.arrived = true;
								scope.$apply();
								break;

							case 'lookAt':
								scope.arrived = false;
								scope.$apply();
								if (lastViewBox) /*action.hasOwnProperty('duration'))*/ {
									var newLookAt = calcLookAt(action);
									var x1 = newLookAt.x + newLookAt.w / 2;
									var y1 = newLookAt.y + newLookAt.h / 2;
									var x2 = lastViewBox.x + lastViewBox.w / 2;
									var y2 = lastViewBox.y + lastViewBox.h / 2;
									var xd = x1 - x2;
									var yd = y1 - y2;
									var wd = newLookAt.w - lastViewBox.w;
									var dist = Math.sqrt(xd * xd + yd * yd + wd * wd);
									var duration = dist;
									if (action.hasOwnProperty('speed')) {
										duration /= action.speed;
									}
									if (action.hasOwnProperty('minDuration')) {
										duration = Math.max(action.minDuration, duration);
									}
									if (action.hasOwnProperty('maxDuration')) {
										duration = Math.min(action.maxDuration, duration);
									}
									action.duration = duration;
									action.startTime = curTime;
									action.endTime = curTime + duration;
									action.startViewBox = lastViewBox;
									currentAction = action;
								} else {
									lastViewBox = calcLookAt(action);
									applyViewBox(lastViewBox);
								}
								break;

							case 'pause':
								scope.paused = true;
								break;

							case 'unpause':
								scope.paused = false;
								break;
							}
						}
					}
					processActions();

					if (!scope.paused) {
						for (var elemId in scope.elemModels) {

							var model = scope.elemModels[elemId];

							elapsedTime /= 4;

							model.x += model.velocity.x * elapsedTime;
							model.y += model.velocity.y * elapsedTime;
							if (model.hasOwnProperty('rotation')) {
								model.rotation += model.angularVelocity * elapsedTime;
							}

							if (model.hasOwnProperty('gravity')) {
								var x = model.x;
								var y = model.y;
								var distSquared = x * x + y * y;
								var scaleForce = elapsedTime / distSquared;
								var dist = Math.sqrt(distSquared);
								var g = 500;
								var xf = g * (scaleForce * -x / dist);
								var yf = g * (scaleForce * -y / dist);
								model.velocity.x += xf;
								model.velocity.y += yf;
							}

							applyModelToElement(model, model.element);
						}
					}
				}
				driveAnimation();
			}
		};
}
]);