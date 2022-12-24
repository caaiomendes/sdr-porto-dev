angular.module('principal')
    .controller('AtestadoController', ['AtestadoService', '$scope', '$localStorage', '$rootScope', 'PacienteService', '$timeout', '$filter', 'Utils', 'PrescricaoService', 'ProfissionalService', 'MedicamentoService', 'AgendamentoService', 'ClinicaService',
        function (AtestadoService, $scope, $localStorage, $rootScope, PacienteService, $timeout, $filter, Utils, PrescricaoService, ProfissionalService, MedicamentoService, AgendamentoService, ClinicaService,) {

            $scope.profissionais = [];
            $scope.barramento = "";
            $scope.agendamento = "";
            $scope.Paciente = {};
            $scope.objetoAtestado = {
                titulo: 'Atestado Odontológico',
            }

            $rootScope.$on("CallParentMethod", async function () {
                $scope.objetoAtestado.data_emissao = dataAtualFormatada(new Date())
                Inputmask("datetime", {
                    inputFormat: "HH:MM",
                    placeholder: "_",
                }).mask("#hora_inicio, #hora_fim");
                await loadData();
            });

            async function loadData() {

                await ProfissionalService.getBySituacao('ativo').success((response) => {
                    $scope.profissionais = response.profissional;
                });

                await PacienteService.getOne(localStorage.getItem('pacienteID')).success((response) => {
                    $scope.Paciente = response;
                });

                await AgendamentoService.getOne(localStorage.getItem('agendamentoID')).success((response) => {
                    var datAtend = new Date(response.data);
                    $scope.objetoAtestado['dataAtendimento'] = new Date(datAtend.setDate(datAtend.getDate() + 1));
                    $scope.objetoAtestado['hora_inicio'] = response.horarioInicio;
                    $scope.objetoAtestado.dentistaId = response.profissionalID;
                });

                initTexto();
                var editor = CKEDITOR.instances['editor1'];
                if (!editor) {
                    initTextArea('editor1');
                    CKEDITOR.instances['editor1'].setData($scope.textoDefault)
                }
            }

            $scope.openModalAtestado = async () => {
                $('#modalAtestado').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            $scope.openModalMostrarTexto = () => {
                $('#modalAtestado').modal('toggle');
                $('#modalAtestadoVisualizarTexto').modal({
                    backdrop: "static",
                    keyboard: false
                })
                initTextArea('editor2')
                formatTextView(1)
            }

            async function formatTextView(from) {
                let textoTextArea = CKEDITOR.instances['editor1'].getData();
                if (textoTextArea.indexOf('#Atividade') != -1 && $scope.objetoAtestado.atividade) {
                    textoTextArea = textoTextArea.replace(/#Atividade/gi, $scope.objetoAtestado.atividade)
                }
                if (textoTextArea.indexOf('#PessoaNomeCompleto') != -1 && $scope.Paciente.nome) {
                    textoTextArea = textoTextArea.replace(/#PessoaNomeCompleto/gi, $scope.Paciente.nome)
                }
                if (textoTextArea.indexOf('#PessoaDocumento') != -1 && $scope.Paciente.cpf) {
                    textoTextArea = textoTextArea.replace(/#PessoaDocumento/gi, $scope.Paciente.cpf)
                }
                if (textoTextArea.indexOf('#AtendimentoHorarioInicio') != -1 && $scope.objetoAtestado.hora_inicio) {
                    textoTextArea = textoTextArea.replace(/#AtendimentoHorarioInicio/gi, $scope.objetoAtestado.hora_inicio)
                }
                if (textoTextArea.indexOf('#AtendimentoHorarioTermino') != -1 && $scope.objetoAtestado.hora_fim) {
                    textoTextArea = textoTextArea.replace(/#AtendimentoHorarioTermino/gi, $scope.objetoAtestado.hora_fim)
                }
                if (textoTextArea.indexOf('#AtendimentoData') != -1 && $scope.objetoAtestado.dataAtendimento) {
                    textoTextArea = textoTextArea.replace(/#AtendimentoData/gi, dataAtualFormatada($scope.objetoAtestado.dataAtendimento))
                }
                if (textoTextArea.indexOf('#Repouso') != -1) {
                    if ($scope.objetoAtestado.dias_repouso == 1) {
                        textoTextArea = textoTextArea.replace(/#Repouso/gi, 'permanecer em repouso por ' + $scope.objetoAtestado.dias_repouso + ' dia')
                    } else if ($scope.objetoAtestado.dias_repouso > 1) {
                        textoTextArea = textoTextArea.replace(/#Repouso/gi, 'permanecer em repouso por ' + $scope.objetoAtestado.dias_repouso + ' dias')
                    } else if ($scope.objetoAtestado.dias_repouso == 0) {
                        textoTextArea = textoTextArea.replace(/#Repouso/gi, 'retomar às atividades normais')
                    }
                }
                $scope.textoTextArea = textoTextArea;
                if (from) {
                    CKEDITOR.instances['editor2'].setData(textoTextArea)
                }
            }
            $scope.cadastrarAtestado = async () => {
                formatTextView();
                $scope.objetoAtestado['id_agendamento'] = localStorage.getItem('agendamentoID')
                $scope.objetoAtestado['id_paciente'] = localStorage.getItem('pacienteID')
                $scope.objetoAtestado['texto'] = $scope.textoTextArea;
                $scope.objetoAtestado['created_at'] = Utils.generateDateToDataBase()
                $scope.objetoAtestado.data_atendimento = dataAtualFormatada($scope.objetoAtestado.dataAtendimento);
               
                await ProfissionalService.getOne($scope.objetoAtestado.dentistaId).success((dentista => {
                    AtestadoService.criarAtestado($scope.objetoAtestado).success((res) => {
                        $rootScope.$emit("emitPrintPdf", {
                            data: $scope.textoTextArea,
                            titulo: $scope.objetoAtestado.titulo,
                            cid: $scope.objetoAtestado.cid,
                            from: 'atestado',
                            dentista:dentista
                        });
                    })
                }))
                $scope.closeAtestado()
            }

            $scope.closeModalMostrarTexto = () => {
                $('#modalAtestadoVisualizarTexto').modal('toggle');
                $('#modalAtestado').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            $scope.closeAtestado = () => {
                $('#modalAtestado').modal('toggle');
                initModal()
            };

            function initModal() {
                delete $scope.objetoAtestado.cid
                delete $scope.objetoAtestado.dias_repouso
                delete $scope.objetoAtestado.hora_fim
                delete $scope.objetoAtestado.atividade
            }

            async function initTexto() {
                $scope.textoDefault = `Atesto para os fins de <strong>dispensa de atividades #Atividade </strong> que o(a) Sr(a) <strong> #PessoaNomeCompleto </strong> (portador(a) do CPF, #PessoaDocumento) esteve sob meus cuidados profissionais no período entre <strong> #AtendimentoHorarioInicio </strong> às <strong> #AtendimentoHorarioTermino</strong> do dia <strong> #AtendimentoData</strong>, devendo #Repouso.`
            }

            async function initTextArea(params) {
                CKEDITOR.replace(params, {
                    toolbar: [{
                        name: 'clipboard',
                        groups: ['clipboard', 'undo'],
                        items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
                    },
                        '/',
                    {
                        name: 'basicstyles',
                        groups: ['basicstyles', 'cleanup'],
                        items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
                    },
                    {
                        name: 'paragraph',
                        groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
                        items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
                    },
                        '/',
                    {
                        name: 'styles',
                        items: ['Styles', 'Format', 'Font', 'FontSize']
                    },
                    {
                        name: 'colors',
                        items: ['TextColor', 'BGColor']
                    },
                    ]
                });

            }

            function dataAtualFormatada(date) {
                var data = date,
                    dia = data.getDate().toString().padStart(2, '0'),
                    mes = (data.getMonth() + 1).toString().padStart(2, '0'),
                    ano = data.getFullYear();
                return dia + "/" + mes + "/" + ano;
            }

            init = async function () { };

            init();
        }
    ]);
