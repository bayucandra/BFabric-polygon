(function(angular){
    "use strict";
    angular.module('BNgApp')
        .factory('SDialog', function($mdDialog, bsLoadingOverlayService, Notification){
            var ref = {};
            ref.show = function(ev, params){
                ref.params = params;
                $mdDialog.show({
                    controller: controller,
                    templateUrl: 'assets/js/b-template/dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false, escapeToClose:true
                })
                    .then(
                        function(submit){
                            
                        },
                        function(){
                            
                        }
                    );
            };
            return ref;
        });
    function controller($scope, $mdDialog, $mdMedia, $http, $timeout, bsLoadingOverlayService, Notification, SDialog){
        $scope.input = {text:''};
        $scope.title = 'Input new data';
        if(SDialog.params.input_mode === 'update'){
            $scope.title = 'Update data';
        }
        $scope.$watch(
            function(){
                return $mdMedia('xs') || $mdMedia('sm');
            },
            function(wantsFullScreen){
                if(wantsFullScreen){
                    $scope.Bstyle = {'min-width':'100%', 'min-height':'100%'};
                }else{
                    $scope.Bstyle = {'width':'450px'};
                }
            }
        );

        $scope.submit = function(form){
            if(!form.$valid){
                Notification("Plese check again form input", "error");
                return;
            }
            bsLoadingOverlayService.start({
                  referenceId: 'dialog-input'
                });
                
            $timeout(
                function(){
                    Notification("Input data success with value: "+$scope.input.text, "success");
                    bsLoadingOverlayService.stop({
                          referenceId: 'dialog-input'
                        });
                    $scope.cancel();
                },
                5000
            );
        };

        $scope.cancel = function(){
            $mdDialog.hide();
        };
    }
})(angular);