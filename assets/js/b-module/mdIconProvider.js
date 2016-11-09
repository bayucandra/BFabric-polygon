(function(angular){
    "use strict";
    angular.module('BNgApp')
        .config(function($mdIconProvider){
            $mdIconProvider
                .icon('main:menu', 'assets/img/ui/24/menu.svg', 24)
                .icon('main:dialog', 'assets/img/ui/24/dialog.svg', 24)
                .icon('crud:create', 'assets/img/ui/24/create.svg', 24)
                .icon('crud:update', 'assets/img/ui/24/update.svg', 24)
                .icon('crud:destroy', 'assets/img/ui/24/destroy.svg', 24);
        });
})(angular);