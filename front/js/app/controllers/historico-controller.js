angular.module('principal')
    .controller('HistoricoController', ['ProfissionalService', 'TimbradoService', '$rootScope', '$scope', '$localStorage', 'AgendamentoService', '$timeout', '$filter', 'HistoricoService', 'Utils', 'ProcedimentoService', 'SolicitacaoExameService', 'PrescricaoService', 'AtestadoService', 'ExameService', 'ClinicaService', 'MedicamentoService',
        function (ProfissionalService, TimbradoService, $rootScope, $scope, $localStorage, AgendamentoService, $timeout, $filter, HistoricoService, Utils, ProcedimentoService, SolicitacaoExameService, PrescricaoService, AtestadoService, ExameService, ClinicaService, MedicamentoService) {

            $scope.initViews = [true, false, false, false, false];
            $scope.arrayItens = []

            $scope.$storage = $localStorage;
            $scope.objetos = new Object();

            $scope.clinica = [];
            $scope.historicoLista = []
            $scope.odontogramas = new Array();
            $scope.situacoes = new Array();
            $scope.facetas = new Array();
            $scope.procedimentos = new Array();

            $("#historico-tab").on("click", function () {
                $scope.listarHistorico();
            })

            $scope.listarHistorico = async () => {
                defineViews(0)
                await $scope.buscarAgendamentosPorPacienteID();
                let idsAgendamento = []
                if ($scope.objetos.length > 0) {
                    idsAgendamento = $scope.objetos.map(e => e.id)
                }
                await buscarOdontogramasPorAgendamento(idsAgendamento)
            }

            async function buscarOdontogramasPorAgendamento(idsAgendamento) {
                $scope.odontogramas = []
                await HistoricoService.buscarListaOdontogramasPorAgendamento(idsAgendamento).success((res) => {
                    $scope.odontogramas = res.odontograma
                })
                let idsOdontogramas = $scope.odontogramas.map(e => e.id)
                await buscarSituacaoPorOdontogramas(idsOdontogramas)
                await buscarFacetaPorOdontogramas(idsOdontogramas)
                await buscarProcedimentoPorOdontogramas(idsOdontogramas)
                await buscarNomesProcedimentos()

                await agruparDados()
            }

            async function buscarClinica() {
                await ClinicaService.getAll().success((res) => {
                    $scope.clinica = res.clinica;
                })
            }

            async function buscarProfisionais() {
                await ProfissionalService.getAll().success((res) => {
                    $scope.profissionais = res.profissional;
                })
            }

            async function buscarSituacaoPorOdontogramas(idsOdontogramas) {
                await HistoricoService.buscarListaSituacaoPorOdontograma(idsOdontogramas).success((res) => {
                    $scope.situacoes = res.odontogramaSituacao
                })
            }

            async function buscarFacetaPorOdontogramas(idsOdontogramas) {
                await HistoricoService.buscarListaFacetaPorOdontograma(idsOdontogramas).success((res) => {
                    $scope.facetas = res.odontogramaFaceta
                })
            }

            async function buscarProcedimentoPorOdontogramas(idsOdontogramas) {
                await HistoricoService.buscarListaProcedimentoPorOdontograma(idsOdontogramas).success((res) => {
                    $scope.procedimentos = res.odontogramaProcedimento
                })
            }

            async function buscarNomesProcedimentos() {
                await ProcedimentoService.getAll().success((res) => {
                    $scope.procedimentosNomes = res.procedimento
                })
            }

            async function agruparDados() {
                let a = $scope.odontogramas
                let b = $scope.situacoes
                let c = $scope.facetas
                let d = $scope.procedimentos
                let e = $scope.objetos
                let pn = $scope.procedimentosNomes
                let merged = [];

                for (let i = 0; i < a.length; i++) {
                    merged.push({
                        o: {
                            ...a[i]
                        },
                        s: [...(b.filter((itmInner) => itmInner.odontogramaID === a[i].id))],
                        f: [...(c.filter((itmInner) => itmInner.odontogramaID === a[i].id))],
                        p: [...(d.filter((itmInner) => itmInner.odontogramaID === a[i].id))],
                        a: [...(e.filter((itmInner) => itmInner.id.toString() == a[i].agendamentoID))],
                    })
                }

                $scope.procNomes = []
                for (let i = 0; i < merged.length; i++) {
                    for (let j = 0; j < merged[i].p.length; j++) {
                        for (let l = 0; l < pn.length; l++) {
                            if (merged[i].p[j].procedimentoID === pn[l].id) {
                                merged[i].p[j].nomeProc = pn[l].nome
                                $scope.procNomes.push(pn[l])
                            }
                        }
                    }
                }

                await groupPorDente();
                await groupPorData();

                async function groupPorDente() {
                    var ab = [];
                    var cb = [];
                    await merged.forEach(function (item) {
                        ab[item.o.dente] = ab[item.o.dente] || {};
                        var obj = ab[item.o.dente];
                        if (Object.keys(obj).length == 0)
                            cb.push(obj);
                        obj.dente = item.o.dente;
                        obj.data = obj.data || [];
                        obj.data.push({
                            o: item.o,
                            s: item.s,
                            f: item.f,
                            p: item.p,
                            a: item.a,
                            c: item.c
                        });
                        obj.data.sort((itemInit, itemFinal) => new Date(itemFinal.a[0].data) - new Date(itemInit.a[0].data));
                    });

                    $scope.$evalAsync(function () {
                        $scope.historicoLista = cb
                    })
                }

                async function groupPorData() {
                    var ab = [];
                    var cb = [];
                    await merged.forEach(function (item) {
                        ab[item.a[0].id] = ab[item.a[0].id] || {};
                        var obj = ab[item.a[0].id];
                        if (Object.keys(obj).length == 0)
                            cb.push(obj);
                        obj.id = item.a[0].id;
                        obj.dataOrder = item.a[0].data
                        obj.dataAgendamento = Utils.converterDataUSAtoBR(item.a[0].data);
                        obj.descricao = item.a[0].descricao;
                        obj.data = obj.data || [];
                        obj.data.push({
                            o: item.o,
                            s: item.s,
                            f: item.f,
                            p: item.p,
                            a: item.a,
                            c: item.c
                        });
                    });

                    $scope.$evalAsync(function () {
                        $scope.historicoListaPorData = cb
                        for (i = 0; i < $scope.objetos.length; i++) {
                            let idExists = $scope.historicoListaPorData.find(e => e.id === $scope.objetos[i].id)
                            if (!idExists) {
                                $scope.objetos[i].dataOrder = $scope.objetos[i].data
                                $scope.objetos[i].data = Utils.converterDataUSAtoBR($scope.objetos[i].data)
                                $scope.historicoListaPorData.push($scope.objetos[i])
                            }
                        }
                    })
                }
                await mergedClinica()
                $scope.$apply();
            }

            async function mergedClinica() {
                await buscarClinica();
                for (let i = 0; i < $scope.historicoLista.length; i++) {
                    $scope.historicoLista[i].data.forEach(e => {
                        e.c = [...($scope.clinica.filter((itmInner) => itmInner.id == e.a[0].clinicaID))]
                    })
                }

                for (let i = 0; i < $scope.historicoListaPorData.length; i++) {
                    if (Array.isArray($scope.historicoListaPorData[i].data)) {
                        $scope.historicoListaPorData[i].data.forEach(e => {
                            e.c = [...($scope.clinica.filter((itmInner) => itmInner.id == e.a[0].clinicaID))]
                        })
                    } else {
                        $scope.historicoListaPorData[i].c = [...($scope.clinica.filter((itmInner) => itmInner.id == $scope.historicoListaPorData[i].clinicaID))]
                    }
                }
            }

            $scope.buscarAgendamentosPorPacienteID = async function () {
                await AgendamentoService.buscarAgendamentosPorPacienteID($scope.objeto.pacienteID)
                    .success(function (response) {
                        if (response == "erro") {
                            console.info("erro");
                        } else {
                            if (response.length > 0) {
                                $scope.objetos = response.filter(function (item) {
                                    return item.situacao == 'finalizado';
                                });
                            } else {
                                $scope.objetos = new Object();
                            }

                            $scope.buscado = true;
                        }
                    })
                    .error(function (response) {});
            }

            $scope.isNumber = function(val) {
                return !isNaN(val);
            }

            $scope.listarViewEspecifica = (async (item) => {
                defineViews(item);

                if (item == 0) {}
                if (item == 1) {
                    await $scope.loadTimbrado();
                } else if (item == 2) {
                    await $scope.loadAtestado();
                } else if (item == 3) {
                    await $scope.loadExames();
                } else if (item == 4) {
                    await $scope.Prescricoes();
                }
            })

            $scope.callPdf = ((item) => {
                const NamePosition = $scope.initViews.indexOf(true);
                const NameEmit = NamePosition == 1 ? 'timbrado' : NamePosition == 2 ? 'atestado' : NamePosition == 3 ? 'exames' : 'prescricao';
                definePdf(NameEmit, item)
            })

            async function definePdf(nameEmit, item) {
                await AgendamentoService.getOne(item.registro.id_agendamento).success(res => {
                    localStorage.setItem("agendamentoID", res.id);
                    localStorage.setItem("clinicaId", res.clinicaID);
                })
                emitPdf(nameEmit, item);
            }


            async function formatDate(array) {
                $scope.arrayItens = array.map(e => {
                    let data = e.created_at.split(" ")
                    return {
                        ...e,
                        dataConvertida: e.created_at = data[0].substr(8, 2) + "/" + data[0].substr(5, 2) + "/" + data[0].substr(0, 4)
                    }
                })
            }

            async function mergedDentista() {
                await buscarProfisionais();
                let profissionais = $scope.profissionais;
                let merged = [];

                for (let i = 0; i < $scope.arrayItens.length; i++) {
                    merged.push({
                        registro: {
                            ...$scope.arrayItens[i]
                        },
                        dentista: [...(profissionais.filter((itmInner) => itmInner.id.toString() == $scope.arrayItens[i].dentistaID || $scope.arrayItens[i].dentistaId))]
                    })
                }
                $scope.arrayItens = merged;
                $scope.$apply()
            }

            $scope.loadExames = (async () => {
                await SolicitacaoExameService.buscarTodosPorPaciente(localStorage.getItem('pacienteID')).success(async (res) => {
                    await formatDate(res.solicitacaoExame)
                    await mergedDentista()
                    $scope.subTilte = "Solicitação de Exames";
                })
            })

            $scope.Prescricoes = (async () => {
                await PrescricaoService.buscarTodosPorPaciente(localStorage.getItem('pacienteID')).success(async (res) => {
                    await formatDate(res.prescricao)
                    await mergedDentista()
                    $scope.subTilte = "Prescriçoes";
                })
            })

            $scope.loadAtestado = (async () => {
                await AtestadoService.buscarTodosPorPaciente(localStorage.getItem('pacienteID')).success(async (res) => {
                    await formatDate(res.atestado)
                    await mergedDentista()
                    $scope.subTilte = "Atestado";
                })
            })

            $scope.loadTimbrado = (async () => {
                await TimbradoService.buscarTodosPorPaciente(localStorage.getItem('pacienteID')).success(async (res) => {
                    await formatDate(res.timbrado)
                    await mergedDentista()
                    $scope.subTilte = "Atestado";
                })
                $scope.subTilte = "Timbrado";
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

            async function emitPdf(nameEmit, item) {
                if (nameEmit == 'exames') {
                    await ExameService.buscarExamesPorSolicitação(item.registro.id).success((res) => {
                        $rootScope.$emit("emitPrintPdf", {
                            data: res.exame,
                            dentista: item.dentista[0],
                            from: nameEmit,
                            recomendacoes: item.recomendacoes,
                            cid: item.cid,
                            titulo: item.titulo,
                        });
                    })
                }

                if (nameEmit == 'prescricao') {
                    await MedicamentoService.buscarMedicamentoPorPrescricao(item.registro.id).success((res) => {
                        $rootScope.$emit("emitPrintPdf", {
                            data: res.medicamento,
                            dentista: item.dentista[0],
                            from: nameEmit,
                            especial: item.tipo == 'especial' ? true : false,
                            titulo: res.titulo,
                            cid: item.cid,
                            recomendacoes: res.recomendacoes
                        });
                    })
                }

                if (nameEmit == 'atestado') {
                    $rootScope.$emit("emitPrintPdf", {
                        data: item.registro.texto,
                        dentista: item.dentista[0],
                        titulo: item.registro.titulo,
                        cid: item.registro.cid,
                        from: nameEmit,
                    });
                }

                if (nameEmit == 'timbrado') {
                    $rootScope.$emit("emitPrintPdf", {
                        data: item.registro.texto,
                        dentista: item.dentista[0],
                        from: nameEmit,
                        cid: item.registro.cid,
                        titulo: item.registro.titulo
                    });
                }
            }

            init = function () {
                if ($scope.$parent.$parent && $scope.$parent.$parent.objeto && $scope.$parent.$parent.objeto.id) {
                    var pacienteID = $scope.$parent.$parent.objeto.id;
                    $scope.objeto.pacienteID = pacienteID;
                    // $scope.listarHistorico();
                }
            };

            init();
        }
    ]);