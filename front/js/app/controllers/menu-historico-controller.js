angular.module('principal')
    .controller('MenuHistoricoController', ['$scope', '$document', '$location', '$window', '$filter', 'LoginService', '$rootScope', '$localStorage', '$rootScope', 'ProfissionalService', '$q',
        function ($scope, $document, $location, $window, $filter, LoginService, $rootScope, $localStorage, $rootScope, ProfissionalService, $q) {

            $scope.initViews = [true, false, false, false, false]

            $scope.listarViewEspecifica = ((item) => {
                defineViews(item);

                if (item == 0) {}
                if (item == 1) {
                    $scope.loadTimbrado();
                } else if (item == 2) {
                    $scope.loadAtestado();
                } else if (item == 3) {
                    $scope.loadExames();
                } else if (item == 4) {
                    $scope.Prescricoes();
                }
            })

            $scope.loadTimbrado = (() => {
                console.log("loadTimbrado <<<<")
            })


            $scope.loadAtestado = (() => {
                console.log("loadAtestado <<<<")
            })

            $scope.loadExames = (() => {
                console.log("loadExames <<<<")
            })

            $scope.Prescricoes = (() => {
                console.log("Prescricoes <<<<")
            })

            function defineViews(item) {
                for (let i = 0; i < $scope.initViews.length; i++) {
                    if (item !== i) {
                        $scope.initViews[i] = false
                    } else {
                        $scope.initViews[i] = true
                    }
                }
            }

            init = function () {
                // $scope.loadDatas()
            };

            init();
        }
    ]);