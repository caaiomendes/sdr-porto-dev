angular.module('principal')
    .controller('EncaminhamentoController', ['Utils', '$location', 'AtendimentoService', 'PacienteService', '$scope', '$localStorage', 'EncaminhamentoService', 'ProfissionalService', 'ProcedimentoService', 'PacienteService', 'ClinicaService', 'AuxClinicaProfissional', 'AtendimentoService',
        function (Utils, $location, AtendimentoService, PacienteService, $scope, $localStorage, EncaminhamentoService, ProfissionalService, ProcedimentoService, PacienteService, ClinicaService, AuxClinicaProfissional, AtendimentoService) {

            $scope.$storage = $localStorage;
            $scope.objetos = [];
            $scope.objeto = {};
            $scope.user = [];
            $scope.clinicaSelecionada = null;

            $scope.getBy = async () => {
                await buscarEncaminhamentosPorDentista();
            }

            async function buscarEncaminhamentosPorDentista() {
                let userMail = localStorage.getItem('ngStorage-email')
                await ProfissionalService.getByMail(userMail.replace(/"/g, '')).success(async (res) => {
                    $scope.user = res

                    await buscarDadosGerais();

                    if (res.profissional[0].tipo == 'dentista') {
                        EncaminhamentoService.getByDentista(res.profissional[0].id).success(async (res) => {
                            await merged(res.odontogramaProcedimento)
                        })
                    } else {
                        await renderAll()
                    }
                    $scope.buscado = true
                })
            }

            async function renderAll() {
                await AuxClinicaProfissional.getByProfissional($scope.user.profissional[0].id).success(async (res) => {
                    let clinicas = res.aux_clinica_profissional.map(e => e.clinicaId);
                    await EncaminhamentoService.getByClinica(clinicas).success(async (res) => {
                        await merged(res.odontogramaProcedimento)
                    })
                })
            }

            async function merged(data) {
                $scope.objetos = await merge(data);
                $scope.$apply()
                findRegisters();
            }

            function findRegisters() {
                if ($scope.objeto.busca) {
                    let newResult = [];
                    $scope.objetos.forEach(element => {
                        if (filter(element).length > 0) {
                            newResult.push(filter(element)[0]);
                        }
                    })
                    $scope.objetos = newResult;
                    $scope.$apply();
                }
            }

            function filter(element) {

                let valueOne = element.paciente.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                let valueOneAcc = element.paciente.nome.toUpperCase()
                let find = $scope.objeto.busca.toUpperCase();

                return pushNewData(element, valueOne, valueOneAcc, find)
            }

            function pushNewData(element, valueOne, valueOneAcc, find) {
                let newData = [];
                if (valueOne.indexOf(find) != -1) {
                    newData.push(element)
                } else {
                    if (valueOneAcc.indexOf(find) != -1) {
                        newData.push(element)
                    }
                }

                return newData;
            }

            async function buscarDadosGerais() {
                //var clinicaId = JSON.parse($scope.clinicaSelecionada).id;

                await ProcedimentoService.getAll().success(res => {
                    $scope.procedimento = res.procedimento
                });
                await ProfissionalService.getAll().success(res => {
                    $scope.profissional = res.profissional
                })
                await PacienteService.getAll().success(res => {
                    $scope.pacientes = res.paciente
                })
                await ClinicaService.getAll().success(res => {
                    $scope.clinica = res.clinica
                })
                await ClinicaService.getAll().success(res => {
                    $scope.clinica = res.clinica
                })
                await AtendimentoService.buscarTodosOdontogramas().success(res => {
                    $scope.odontograma = res.odontograma
                })
            }

            $scope.ordenarTabelas = function () {
                $('#sortable-table-1').tablesort();
            }

            async function merge(array) {
                let merge = [];
                for (let i = 0; i < array.length; i++) {
                    if (array[i].realizado != 1) {
                        merge.push({
                            encaminhamento: {
                                ...array[i],
                                dataFormatada: Utils.converterDataUSAtoBR(array[i].created_at.substr(0, 10))
                            },
                            odontograma: [...($scope.odontograma.filter((itmInner) => itmInner.id === array[i].odontogramaID))][0],
                            paciente: [...($scope.pacientes.filter((itmInner) => itmInner.id === array[i].pacienteID))][0],
                            dentistaSend: [...($scope.profissional.filter((itmInner) => itmInner.id === array[i].dentistaSendId))][0],
                            dentistaRec: [...($scope.profissional.filter((itmInner) => itmInner.id === array[i].dentistaID))][0],
                            clinica: [...($scope.clinica.filter((itmInner) => itmInner.id === array[i].clinicaID))][0],
                            procedimento: [...($scope.procedimento.filter((itmInner) => itmInner.id === array[i].procedimentoID))][0],
                        })
                    }
                }
                return merge;
            }

            $scope.irParaPacientes = (objeto) => {
                localStorage.setItem('objetoPacienteNavigate', JSON.stringify(objeto.paciente));
                localStorage.setItem('flagEditando', true);
                localStorage.setItem('navigateProntuario', true);
                $location.path('/pacientes');
            }

            init = async function () {
                var clinicaId = null;
                var storageClinica = localStorage.getItem('ngStorage-clinica');
                $scope.clinicaSelecionada = storageClinica;

                if(storageClinica){
                    await buscarEncaminhamentosPorDentista();
                }else{
                    alert("Clinica não selecionada, entre em contato com o Administrador");
                }
            };

            init();
        }
    ]);