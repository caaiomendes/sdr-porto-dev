angular.module('principal')
    .controller('PrescricaoController', ['$scope', '$localStorage', 'PacienteService', '$timeout', '$filter', 'Utils', 'PrescricaoService', 'ProfissionalService', 'MedicamentoService', 'AgendamentoService', 'ClinicaService', '$rootScope',
        function ($scope, $localStorage, PacienteService, $timeout, $filter, Utils, PrescricaoService, ProfissionalService, MedicamentoService, AgendamentoService, ClinicaService, $rootScope) {
            $scope.barramento = "";

            $scope.dataAtual = new Date()
            var diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
            $scope.diaSemana = diasSemana[$scope.dataAtual.getDay()];
            $scope.dia = $scope.dataAtual.getDay();
            var mesesAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            $scope.mes = mesesAno[$scope.dataAtual.getMonth()]
            $scope.ano = $scope.dataAtual.getFullYear();


            $scope.listaAtividades = [{
                nome: "Exames",
                func: "chamarExames()"
            },
            {
                nome: "Prescrição",
                func: "chamarPrescrição()"
            },
            ];

            $scope.pacienteNome = ''
            $scope.modelos = [];
            $scope.objetoClinica = {}
            $scope.medicamentos = [];
            $scope.profissionais = [];
            $scope.dentistaObjeto = {};
            $scope.listaMergeModelos = [];
            $scope.mostrartModelos = true;
            $scope.confirmarPrescricao = false;
            $scope.cadastradoPrescricao = true;
            $scope.cadastradoMedicamento = false;
            $scope.flagBotaoEditarMedicamento = false;
            $scope.objetoMedicamento = {
                tipo_uso: 'Oral',
                grupo_uso: 'Uso Interno'
            };
            $scope.objetoPrescricao = {
                titulo: 'Prescrição',
                modelo: 0,
                tipo: 'simples'
            }
            $scope.listaMedicamentosInseridos = new Array;

            $scope.defineFunction = (nome) => {
                if (nome == 'Atestado') {
                    openModalAtestado()
                } else if (nome == 'Exames') {
                    openModalExames()
                } else {
                    openModalPrescricao()
                }
            }

            async function openModalAtestado() {
                $('#modalAtestado').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            async function openModalExames() {
                $('#modalExames').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            async function openModalPrescricao() {
                $('#modalPrescricao').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            function filtrarPorPrescricaoId() {
                let _modelos = $scope.modelos;
                let _medicamentos = $scope.medicamentos;
                $scope.listaMergeModelos = []
                let merged = [];

                for (let i = 0; i < _modelos.length; i++) {
                    merged.push({
                        modelo: {
                            ..._modelos[i]
                        },
                        medicamento: [...(_medicamentos.filter((itmInner) => itmInner.id_prescricao === _modelos[i].id))],
                    })
                }

                $scope.listaMergeModelos = merged;
                $scope.$evalAsync(function () { })
            }

            $scope.criarNovaPrescricao = (limparArray) => {
                $scope.$evalAsync(function () {
                    $scope.mostrartModelos = false
                    if (limparArray) {
                        $scope.listaMedicamentosInseridos = []
                    }
                })
            }

            $scope.closeModalPrescricao = () => {
                $('#modalPrescricao').modal('toggle');
                $scope.$evalAsync(function () {
                    $scope.initModal();
                    $scope.objetoPrescricao = {
                        titulo: 'Prescrição',
                        tipo: 'simples'
                    }
                })
            }

            $scope.initModal = () => {
                $scope.mostrartModelos = true;
                $scope.confirmarPrescricao = false;
                $scope.cadastradoPrescricao = true;
                $scope.cadastradoMedicamento = false;
                $scope.flagBotaoEditarMedicamento = false;
            }

            $scope.adicionarMedicamento = () => {
                $scope.cadastradoMedicamento = true;
                $scope.cadastradoPrescricao = false;
                $scope.confirmarPrescricao = false;
            }

            $scope.voltarPrescricao = () => {
                $scope.mostrartModelos = false
                $scope.cadastradoMedicamento = false;
                $scope.cadastradoPrescricao = true;
                $scope.confirmarPrescricao = false;
            }

            $scope.visualizarPrescricao = () => {
                buscarPaciente();
                buscarModelos();
                $scope.confirmarPrescricao = true
                $scope.cadastradoMedicamento = false;
                $scope.cadastradoPrescricao = false;
            }

            $scope.closeModalMedicamento = () => {
                $scope.voltarPrescricao();
                limparModeloMedicamento();
            }

            $scope.incluirMedicamento = () => {
                if ($scope.objetoMedicamento.tipo_uso == ('Cutânea(Tópico)' || 'Otológica' || 'Nasal' || 'Bochecho')) {
                    $scope.objetoMedicamento['grupo_uso'] = 'Uso Externo';
                }

                if ($scope.objetoMedicamento.tipo_uso == ('Oral' || 'Bucal' || 'Sublingual' || 'GastroIntestinal')) {
                    $scope.objetoMedicamento['grupo_uso'] = 'Uso Interno';
                }

                if ($scope.objetoMedicamento.tipo_uso == ('Injetavel' || 'Cutânea(...)')) {
                    $scope.objetoMedicamento['grupo_uso'] = 'Uso Paranteal';
                }

                $scope.listaMedicamentosInseridos.push($scope.objetoMedicamento)
                $scope.closeModalMedicamento();
            }

            function limparModeloMedicamento() {
                $scope.objetoMedicamento = {
                    tipo_uso: 'Oral',
                    grupo_uso: 'Uso Interno'
                };
            }

            $scope.editarMedicamento = (item) => {
                $scope.adicionarMedicamento();
                $scope.objetoMedicamento = item;
                $scope.flagBotaoEditarMedicamento = true;
            }

            $scope.salvarEdicaoMedicamento = () => {
                $scope.closeModalMedicamento();
                $scope.flagBotaoEditarMedicamento = false;
            }

            $scope.salvarPrescricao = async () => {
                $scope.objetoPrescricao['id_agendamento'] = localStorage.getItem('agendamentoID')
                $scope.objetoPrescricao['id_paciente'] = localStorage.getItem('pacienteID')

                if ($scope.objetoPrescricao.id) {
                    delete $scope.objetoPrescricao.id;
                }

                await ProfissionalService.getOne($scope.objetoPrescricao.dentistaID).success((dentista => {
                    if ($scope.objetoPrescricao) {
                        $scope.objetoPrescricao['created_at'] = Utils.generateDateToDataBase();
                        PrescricaoService.criarPrescricao($scope.objetoPrescricao).success((res) => {
                            if ($scope.listaMedicamentosInseridos.length > 0) {
                                salvarMedicamentos(res)
                            }
                            $rootScope.$broadcast("emitPrintPdf", {
                                data: $scope.listaMedicamentosInseridos,
                                cid: $scope.objetoPrescricao.cid,
                                from: 'prescricao',
                                especial: $scope.objetoPrescricao.tipo == 'especial' ? true : false,
                                titulo: $scope.objetoPrescricao.titulo,
                                recomendacoes: $scope.objetoPrescricao.recomendacoes,
                                dentista: dentista
                            });
                            $scope.closeModalPrescricao();
                            buscarModelos();
                        })
                    } else {
                        $rootScope.$broadcast("emitPrintPdf", {
                            data: $scope.listaMedicamentosInseridos,
                            from: 'prescricao',
                            cid: $scope.objetoPrescricao.cid,
                            especial: $scope.objetoPrescricao.tipo == 'especial' ? true : false,
                            titulo: $scope.objetoPrescricao.titulo,
                            recomendacoes: $scope.objetoPrescricao.recomendacoes,
                            dentista: dentista
                        });
                        $scope.closeModalPrescricao();
                    }
                }))
            }

            function salvarMedicamentos(idPrescricao) {
                $scope.listaMedicamentosInseridos.forEach((e) => {
                    if (e.id) {
                        delete e.id;
                        // e.id_prescricao = idPrescricao
                        // MedicamentoService.updateMedicamento(e).success(() => {})
                    }
                    // else {
                    e.id_prescricao = idPrescricao
                    e.created_at = Utils.generateDateToDataBase();
                    MedicamentoService.criarMedicamento(e).success(() => { })
                    // }
                })
            }

            
            $(document).on('show.bs.modal', '.modal', function () {
                var zIndex = 1040 + (10 * $('.modal:visible').length);
                $(this).css('z-index', zIndex);
                setTimeout(function () {
                    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                }, 0);
            });
            
            $scope.removerModelo = (item) => {
                item.modelo.modelo = 0;
                item.modelo.updated_at = Utils.generateDateToDataBase();
                PrescricaoService.updateModelo(item.modelo).success(() => {
                    buscarModelos();
                })
            }

            $scope.escolherModelo = (value) => {
                let item = value.modelo
                $scope.listaMedicamentosInseridos = $scope.medicamentos.filter((e) => {
                    return e.id_prescricao === item.id
                })
                $scope.criarNovaPrescricao();
                item.modelo = false
                $scope.objetoPrescricao = item
            }

            async function buscarMedicamento() {
                MedicamentoService.buscarMedicamento().success((res) => {
                    $scope.medicamentos = res.medicamento;
                    filtrarPorPrescricaoId()
                })
            }

            async function buscarModelos() {
                PrescricaoService.buscarModelo().success((response) => {
                    $scope.modelos = response.prescricao;
                    buscarMedicamento();
                    buscarClinica();
                })
            }

            async function buscarPaciente() {
                await AgendamentoService.getOne(localStorage.getItem('agendamentoID')).success((res) => {
                    ProfissionalService.getOne(res.profissionalID).success((res) => {
                        $scope.dentistaObjeto = res
                    }),
                        PacienteService.getOne(res.pacienteID).success((res) => {
                            $scope.pacienteNome = res.nome
                            $scope.pacienteCpf = res.cpf
                        })
                })
            }

            async function buscarClinica() {
                let id = localStorage.getItem('clinicaId')
                await ClinicaService.getOne(id).success((res) => {
                    $scope.objetoClinica = {
                        nome: res.nome,
                        endereco: res.endereco,
                        cnpj: res.cnpj,
                        logo: res.logo
                    }
                })
            }

            async function buscarProfissionais() {
                ProfissionalService.getBySituacao('ativo').success((response) => {
                    $scope.profissionais = response.profissional;
                })
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
                buscarPaciente();
                buscarProfissionais();
                buscarModelos();
                $scope.barramento = GLOBAL.barramento;
            };

            init();
        }
    ]);