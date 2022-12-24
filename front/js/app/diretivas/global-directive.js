angular.module('principal')

.directive('back', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
            	debugger;
                $window.history.back();
            });
        }
    };
}]);

angular.module('principal')
.directive('loading', ['$http' ,function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
        }
    };

}]);

angular.module('principal')
.directive('validate', [function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            elm.bind("blur", function (event) {
                console.dir("Element:" + this);
                if (!this.validity.valid || elm.hasClass('ng-invalid')) {
                    elm.addClass('error');
                    elm.removeClass("success");
                } else {
                    elm.addClass('success');
                    elm.removeClass("error");
                }
            });
        }
    };

}]);

angular.module('principal')
.directive('prescricaoTemplate', function() {
    return {
      templateUrl: 'views/templatePdf.html'
    };
});

angular.module('principal')
.directive('escolhaClinica', function() {
    return {
        restrict:'E',
        scope: {
            origem: '@origem'
        },
        templateUrl: 'views/clinicas-escolha-template.html',
        controller: 'SelecionarClinicaController',
        
    };
});