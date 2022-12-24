angular.module('principal')
    .controller('SelecionarClinicaController', ['$scope', '$localStorage', 'ClinicaService', 'AuxClinicaProfissional', 'ProfissionalService',
        function ($scope, $localStorage, ClinicaService, AuxClinicaProfissional, ProfissionalService) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.objetos = new Object();

            var buscarClinicas = async function () {
                let admin = localStorage.getItem('ngStorage-tipo').replace(/"/gi, '');
                if(admin == 'administrador'){
                    buscarTodas();
                }else{
                    buscarAssociadas();
                }
            }

            var buscarTodas = function(){

                ClinicaService.getAll()
                .success(function (response) {
                    if (response == "erro") {
                        console.info("erro");
                    } else {
                        if (response.clinica.length > 0) {
                            $scope.objetos = response.clinica;
                        } else {
                            $scope.objetos = new Object();
                        }

                        $scope.buscado = true;
                    }
                })
                .error(function (response) {
                    $scope.mensagem = "Erro ao buscar registros.";
                    $scope.flagSemConteudo = true;
                });
            }

            
            var buscarAssociadas = async function(){
                let dentista = localStorage.getItem('ngStorage-email').replace(/"/gi, '');
                await ProfissionalService.getByMail(dentista).success(res => {
                    AuxClinicaProfissional.getByIdRelationProfissional(res.profissional[0].id).success((res) => {
                        ClinicaService.getListById(res.aux_clinica_profissional.map(e => e.clinicaId))
                            .success(function (response) {
                                if (response == "erro") {
                                    console.info("erro");
                                } else {
                                    if (response.clinica.length > 0) {
                                        $scope.objetos = response.clinica;
                                    } else {
                                        $scope.objetos = new Object();
                                    }

                                    $scope.buscado = true;
                                }
                            })
                            .error(function (response) {
                                $scope.mensagem = "Erro ao buscar registros.";
                                $scope.flagSemConteudo = true;
                            });
                    })
                });
            }
            

            $scope.selecionar = function (selecionado) {
                $scope.$storage.clinica = selecionado;
                localStorage.setItem('clinicaId', selecionado.id);

                setTimeout(decidirOQueFazer, 500);
            }

            var decidirOQueFazer = function(){
                if($scope.origem == 'apoio'){
                    $scope.$parent.init();
                    $scope.$parent.mostrarFormulario();
                }

                if($scope.origem == 'entradas-saidas'){
                    $scope.$parent.init();
                }

                if($scope.origem == 'acertos'){
                    $scope.$parent.init();
                }

                if($scope.origem == 'estoque'){
                    $scope.$parent.init();
                }
            }

            init = function () {
                $scope.barramento = GLOBAL.barramento;
                buscarClinicas();
            };

            init();
        }
    ]);