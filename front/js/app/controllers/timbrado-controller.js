angular.module('principal')
    .controller('TimbradoController', ['$scope', '$rootScope', '$localStorage', 'TimbradoService', 'AgendamentoService', 'ProfissionalService',
        function ($scope, $rootScope, $localStorage, TimbradoService, AgendamentoService, ProfissionalService) {
            $scope.objetoTimbrado = {
                titulo: 'Timbrado'
            }

            $scope.openModalTimbrado = () => {
                $scope.disabled = true
                $('#modalTimbrado').modal({
                    backdrop: "static",
                    keyboard: false
                })
                var editor = CKEDITOR.instances['editor3'];
                if (!editor) {
                    initTextArea('editor3');
                }
            };

            $scope.criarTimbrado = async () => {
                await AgendamentoService.getOne(localStorage.getItem("agendamentoID").replace(/"/gi, "")).success((res) => {
                    $scope.objetoTimbrado['id_agendamento'] = localStorage.getItem('agendamentoID')
                    $scope.objetoTimbrado['id_paciente'] = localStorage.getItem('pacienteID')
                    $scope.objetoTimbrado['dentistaID'] = res.profissionalID;
                    $scope.objetoTimbrado['texto'] = CKEDITOR.instances['editor3'].getData();
                    $scope.objetoTimbrado['created_at'] = Utils.generateDateToDataBase()
                })

                await TimbradoService.criarTimbrado($scope.objetoTimbrado).success(async (res) => {
                    await ProfissionalService.getOne($scope.objetoTimbrado.dentistaID).success((dentista => {
                        $rootScope.$emit("emitPrintPdf", {
                            data: $scope.objetoTimbrado.texto,
                            from: 'timbrado',
                            titulo: $scope.objetoTimbrado.titulo,
                            dentista: dentista
                        });
                    }));
                })
                $scope.closeTimbrado()
            }

            $scope.closeTimbrado = () => {
                $('#modalTimbrado').modal('toggle');
                CKEDITOR.instances['editor3'].setData('')
            }

            async function initTextArea(params) {
                $('#btnTimbrado').prop('disabled', true);
                CKEDITOR.replace(params, {
                    removePlugins: 'elementspath',
                    toolbar: [{
                        name: 'basicstyles',
                        items: ['Bold', 'Italic']
                    },]
                }).on('change', function (evt) {
                    let data = CKEDITOR.instances['editor3'].document.$.body.innerText.trim()
                    if (data == '' /*|| data.length > 255*/) {
                        $('#btnTimbrado').prop('disabled', true);
                    } else {
                        $('#btnTimbrado').prop('disabled', false);
                    }
                });
            }

            init = async function () { };

            init();
        }
    ]);