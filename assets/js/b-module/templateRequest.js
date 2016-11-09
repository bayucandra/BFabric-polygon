(function(angular) {
    "use strict";
    angular.module('BNgApp')
        .run(function($templateRequest){
            var urls = [
                //BEGIN ICONS
                'assets/img/ui/24/menu.svg',
                'assets/img/ui/24/create.svg',
                'assets/img/ui/24/update.svg',
                'assets/img/ui/24/destroy.svg',
                //BEGIN TEMPLATES
                'assets/js/b-template/dialog.html',
                'assets/js/b-template/loading-overlay.html'
            ];

            // Pre-fetch icons sources by URL and cache in the $templateCache...
            // subsequent $templateRequest calls will look there first.

            angular.forEach(urls, function(url) {
              $templateRequest(url);
            });
        });

})(angular);
