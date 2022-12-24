angular.module('principal')
    .controller('ExamesController', ['$scope', '$document', '$location', '$window', '$filter', '$rootScope', '$localStorage', 'ProfissionalService', 'SolicitacaoExameService', 'ExameService', 'Utils',
        function ($scope, $document, $location, $window, $filter, $rootScope, $localStorage, ProfissionalService, SolicitacaoExameService, ExameService, Utils) {

            $scope.objetoCadExame = {
                titulo: 'Solicitação de Exames'
            };
            $scope.objetoExame = {};

            $scope.mostrarModelos = true;
            $scope.cadastroExames = false;
            $scope.adicionarExame = false;
            $scope.incluirExameBtn = true;
            $scope.visualizarSolicitacao = false;
            $scope.salvarInclusaoExameBtn = false;

            $scope.modelos = [];
            $scope.profissionais = [];
            $scope.listaExamesInseridos = [];

            async function buscarModelos() {
                SolicitacaoExameService.buscarModelo().success((res) => {
                    $scope.modelos = res.solicitacaoExame;
                    buscarExames();
                })
            }

            async function buscarExames() {
                ExameService.buscarExames().success((res) => {
                    $scope.exames = res.exame;
                    filtrarPorSolicitacao();
                })
            }

            function filtrarPorSolicitacao() {
                let _modelos = $scope.modelos;
                let _exames = $scope.exames;
                $scope.listaMergeModelos = []
                let merged = [];

                for (let i = 0; i < _modelos.length; i++) {
                    merged.push({
                        modelo: {
                            ..._modelos[i]
                        },
                        exame: [...(_exames.filter((itmInner) => itmInner.id_solicitacaoExame === _modelos[i].id))],
                    })
                }

                $scope.listaMergeModelos = merged;
            }

            async function buscarProfissionais() {
                ProfissionalService.getBySituacao('ativo').success((response) => {
                    $scope.profissionais = response.profissional;
                })
            }

            $scope.salvarSolicitacaoExame = async () => {
                $scope.objetoCadExame['created_at'] = Utils.generateDateToDataBase()
                $scope.objetoCadExame['id_agendamento'] = localStorage.getItem('agendamentoID')
                $scope.objetoCadExame['id_paciente'] = localStorage.getItem('pacienteID')

                if ($scope.objetoCadExame.id) {
                    delete $scope.objetoCadExame.id
                }
                await ProfissionalService.getOne($scope.objetoCadExame.dentistaID).success((dentista => {
                    if ($scope.objetoCadExame) {
                        SolicitacaoExameService.criarSolicitacao($scope.objetoCadExame).success((res) => {
                            salvarExames(res);
                            buscarModelos();
                            $rootScope.$emit("emitPrintPdf", {
                                data: $scope.listaExamesInseridos,
                                from: 'exames',
                                recomendacoes: $scope.objetoCadExame.recomendacoes,
                                cid: $scope.objetoCadExame.cid,
                                titulo: $scope.objetoCadExame.titulo,
                                dentista: dentista
                            });
                            $scope.closeModalExames();
                        })
                    } else {
                        $rootScope.$emit("emitPrintPdf", {
                            data: $scope.listaExamesInseridos,
                            from: 'exames',
                            cid: $scope.objetoCadExame.cid,
                            recomendacoes: $scope.objetoCadExame.recomendacoes,
                            titulo: $scope.objetoCadExame.titulo,
                            dentista: dentista
                        });
                        $scope.closeModalExames();
                    }
                }))
            }

            $scope.escolherModelo = (value) => {
                let item = value.modelo
                $scope.listaExamesInseridos = $scope.exames.filter((e) => {
                    return e.id_solicitacaoExame === item.id
                })
                $scope.cadastrarExames();
                item.modelo = false
                $scope.objetoCadExame = item
            }

            $scope.removerModelo = (item) => {
                // $scope.closeModalExames()
                $('#removerModeloExames').modal('show')
                $scope.itemRemover = item
            }

            $(document).on('show.bs.modal', '.modal', function () {
                var zIndex = 1040 + (10 * $('.modal:visible').length);
                $(this).css('z-index', zIndex);
                setTimeout(function () {
                    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                }, 0);
            });

            $scope.cancelarExcluirModeloExames = () => {
                $('#removerModeloExames').modal('hide');
                $('#modalExames').css("overflow-y", "auto")
            }

            $('#confirmarExcluirExamesModelo').click(() => {
                let item = $scope.itemRemover
                item.modelo.modelo = 0;
                item.modelo.updated_at = Utils.generateDateToDataBase();
                SolicitacaoExameService.atualizarSolicitacao(item.modelo).success(() => {
                    buscarModelos();
                    $scope.cancelarExcluirModeloExames()
                })
            })

            function salvarExames(idSolicitacao) {
                $scope.listaExamesInseridos.forEach((e) => {
                    if (e.id) {
                        delete e.id
                        // ExameService.atualizarExame(e).success(() => {})
                    }
                    // else {
                    e.id_solicitacaoExame = idSolicitacao;
                    e.created_at = Utils.generateDateToDataBase();
                    ExameService.criarExame(e).success(() => { })
                    // }
                })
            }

            $scope.closeModalIncluirExames = () => {
                $scope.cadastroExames = true;
                $scope.adicionarExame = false;
                $scope.mostrarModelos = false;
                $scope.visualizarSolicitacao = false;
            }

            $scope.closeModalExames = () => {
                $('#modalExames').modal('toggle');
                initModal()
                $scope.listaExamesInseridos = []
                $scope.objetoCadExame = {
                    titulo: 'Solicitação de Exames'
                };
            }

            function initModal() {
                $scope.mostrarModelos = true;
                $scope.cadastroExames = false;
                $scope.adicionarExame = false;
                $scope.visualizarSolicitacao = false;
                $scope.listaExamesInseridos = []
                $scope.objetoExame = {};
                $scope.incluirExameBtn = true;
                $scope.salvarInclusaoExameBtn = false;
                $scope.objetoCadExame = {
                    titulo: 'Solicitação de Exames'
                };
            }

            $scope.cadastrarExames = () => {
                $scope.cadastroExames = true;
                $scope.adicionarExame = false;
                $scope.mostrarModelos = false;
                $scope.visualizarSolicitacao = false;
            }

            $scope.adicionarExames = () => {
                $scope.objetoExame = {};
                $scope.cadastroExames = false;
                $scope.mostrarModelos = false;
                $scope.adicionarExame = true;
                $scope.visualizarSolicitacao = false;
            }

            $scope.incluirExame = () => {
                $scope.listaExamesInseridos.push($scope.objetoExame)
                $scope.cadastroExames = true;
                $scope.mostrarModelos = false;
                $scope.adicionarExame = false;
            }

            $scope.salvarInclusaoExame = () => {
                $scope.incluirExameBtn = true;
                $scope.salvarInclusaoExameBtn = false;
                $scope.cadastrarExames();
            }

            $scope.prosseguir = () => {
                $scope.cadastroExames = false;
                $scope.adicionarExame = false;
                $scope.visualizarSolicitacao = true;
            }

            $scope.closeModalVisualizarExames = () => {
                $scope.cadastroExames = true;
                $scope.adicionarExame = false;
                $scope.visualizarSolicitacao = false;
            }

            $scope.editarExame = (item) => {
                $scope.incluirExameBtn = false;
                $scope.salvarInclusaoExameBtn = true;
                $scope.adicionarExames();
                $scope.objetoExame = item
            }

            $(document).ready(function () {
                $(".collapse.show").each(function () {
                    $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
                });
                $(".collapse").on('show.bs.collapse', function () {
                    $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
                }).on('hide.bs.collapse', function () {
                    $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
                });
            });

            init = async function () {
                buscarProfissionais();
                buscarModelos();
            };

            init();
        }
    ]);