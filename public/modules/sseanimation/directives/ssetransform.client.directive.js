'use strict';

angular.module('sseanimation').directive('ssetransform', [
 function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var transformAttr = attrs.ssetransform;

        element.scope().$watch(transformAttr, function (newValue) {
          if (newValue) {
            var transform = '';
            if (newValue.hasOwnProperty('rotate')) {
              transform += 'rotate(' + newValue.rotate + 'deg) ';
            }
            element.css({
              '-ms-transform': transform,
              '-webkit-transform': transform,
              'transform': transform
            });
          }
        }, true);
      }
    };
  }
  ]);