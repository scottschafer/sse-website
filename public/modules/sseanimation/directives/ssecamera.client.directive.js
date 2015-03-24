'use strict';

angular.module('sseanimation').directive('ssecamera', [
 function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var cameraName = attrs.ssecamera;
        var camera = scope[cameraName];
        var $element = $(element[0]);

        function updateElementSize() {
          camera.viewExtent.w = $element.width();
          camera.viewExtent.h = $(window).innerHeight() - $('header').height() - 50; // TODO: kill the magic number
          $element.css('width', $(window).innerWidth() + 'px');
          $element.css('height', camera.viewExtent.h + 'px');
        }

        $(window).resize(function () {
          updateElementSize();
          scope.$apply();
        });

        scope.$watch(attrs.ssecamera, function (newValue) {
          if (newValue) {
            var w = 1000 / newValue.zoom;
            var h = 1000 / newValue.zoom;
            var viewBox = Math.floor(-w / 2) + ' ' + Math.floor(-h / 2) + ' ' + Math.floor(w) + ' ' + Math.floor(h);
            element[0].setAttribute('viewBox', viewBox);


            /*
            var scale = Math.min(w / newValue.viewExtent.w, h / newValue.viewExtent.h);
            scale *= newValue.zoom;

            var x = w / 2;
            var y = h / 2;

            var transform = '';
            transform += 'rotate(' + newValue.rotation + 'deg) ';
            transform += 'scale(' + scale + ') ';
            //              transform += 'translate(' + x + 'px, ' + y + 'px) ';

            $element.css({
              '-ms-transform': transform,
              '-webkit-transform': transform,
              'transform': transform
*/
            /*

            '-ms-transform-origin': '50% 50%',
            '-webkit-transform-origin': '50% 50%',
            'transform-origin': '50% 50%'  */
          }
        }, true);

        updateElementSize();
      }
    };
  }
]);