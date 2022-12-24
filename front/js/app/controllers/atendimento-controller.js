angular.module('principal')
    .controller('AtendimentoController', ['ClinicaService', '$scope', '$localStorage', '$rootScope', 'AgendamentoService', 'PacienteService', '$timeout', '$filter', 'Utils', 'ProcedimentoService', 'AtendimentoService', 'ProfissionalService', 'PlanejamentoService',
        function (ClinicaService, $scope, $localStorage, $rootScope, AgendamentoService, PacienteService, $timeout, $filter, Utils, ProcedimentoService, AtendimentoService, ProfissionalService, PlanejamentoService) {

            $scope.objetos = new Object();
            $scope.editandoAtendimento = false;
            $scope.listaProcedimentosEncaminhadosPlanoOdontologico = []
            $scope.dentes = new Array;
            $scope.situacaoDentes = new Array;
            $scope.facesDentes = new Array;
            $scope.registroAtendimento = new Array;
            $scope.listaProcedimentos = [];
            $scope.allProcedimentosDentes = [];
            $scope.listaTipoProcedimentos = [{
                id: 1,
                nome: 'Convenio'
            }, {
                id: 2,
                nome: 'Particular'
            }]
            $scope.atendimentoDesc = []
            $scope.categoria = {
                nome: ''
            }
            $scope.procedimentosLista = [];
            $scope.itensProcedimentos = []
            $scope.listaProcedimentosEncaminhados = []
            $scope.situacaoSelect = {};
            $scope.disabled = true
            $scope.pessoa = {
                nome: '',
                nascimento: '',
                idade: ''
            }

            //INICIO DO PROCESSO 
            //VERIFICAR SE ESTÁ SE O ATENDIMENTO ESTÁ FINALIZADO OU NÃO
            $scope.editarAtendimento = async function (obj) {
                // var clinicaID = obj.clinicaID;
                // await ProcedimentoService.getByClinica(clinicaID).success((res) => {
                // aqui foi necessario voltar o getAll

                await ProcedimentoService.getAll().success((res) => {
                    $scope.listaNomeProcedimentos = res.procedimento
                })
                await AtendimentoService.buscarAgendamentoPorId(obj.id).success((res) => {
                    $scope.profissionalID = res.profissionalID;
                    $scope.pacienteID = res.pacienteID;

                    $(".span-datails #data").val(Utils.converterDataUSAtoBR(res.data));
                    $(".span-datails #procd").val(res.procedimentoCategoria);

                    localStorage.setItem('pacienteID', res.pacienteID)
                    localStorage.setItem('agendamentoID', obj.id)
                    localStorage.setItem('nomePaciente', obj.nome)
                    localStorage.setItem('clinicaId', obj.clinicaID);
                })

                $(".span-datails #dentista").val('Dr. ' + obj.profissionalNome);

                obj['id'] = obj.id.toString()
                $scope.atendimentoSelecioando = obj.id.toString()
                $scope.atendimentoSelecioandoCompleto = obj
                $scope.editandoAtendimento = true;
                $scope.atendimentoListaParamentros.dente
                $scope.verificarBotoes('ignorar')

                atuzalizarAtendimento()
                atualizarPlanejamentoClinico(obj)
                buscarOdontogramaPorAtendimento(obj.id)
                $scope.getAllProcedimentos();
                setTimeout(() => {
                    Utils.posicionarDentes();
                    $rootScope.$emit("CallParentMethod", {});
                }, 1000);

                verificarPlanejamentoProvado();
            }

            async function atualizarPlanejamentoClinico(obj) {
                //listar todos procedimentos do PACIENTE em questão
                let atendimento = obj.id
                let odontogramas = ''
                //encontrar paciente
                await AtendimentoService.buscarAtendimentoPorId(atendimento).success(async (res) => {
                    //encontrar atendimentos desse paciente
                    await AtendimentoService.buscarAgendamentoPorPaciente(res.pacienteID).success((e) => {
                        let listaDeAtendimentos = []
                        e.agendamento.forEach(e => {
                            listaDeAtendimentos.push(e.id)
                        })

                        

                        //buscar odontogramar por id de 
                        AtendimentoService.buscarListaOdontogramasPorListaAgendamento(listaDeAtendimentos).success((res) => {
                            let listaDeProcedimentos = []
                            odontogramas = res.odontograma
                            res.odontograma.forEach(e => {
                                listaDeProcedimentos.push(e.id)
                            })

                            if(listaDeProcedimentos.length == 0){
                                //para nao buscar nenhum procedimento(nao tem nenhum odontograma com ID 1)
                                listaDeProcedimentos = -1;
                            }
                            
                            AtendimentoService.buscarProcedimentoPorListaId(listaDeProcedimentos).success(async (res) => {
                                let procedimentos = res.odontogramaProcedimento;
                                let nomeProcedimentos = $scope.listaNomeProcedimentos;
                                let merged = [];
                                let mergedEnc = []

                                for (let i = 0; i < procedimentos.length; i++) {
                                    if (procedimentos[i].realizado != '1') {
                                        merged.push({
                                            proc: {
                                                ...procedimentos[i]
                                            },
                                            procNome: {
                                                ...(nomeProcedimentos.filter((innerParam) => innerParam.id === procedimentos[i].procedimentoID))
                                            },
                                            odontograma: {
                                                ...(odontogramas.filter((innerParam) => innerParam.id === procedimentos[i].odontogramaID))
                                            }
                                        })
                                        if (procedimentos[i].dentistaID != '0') {
                                            mergedEnc.push({
                                                proc: {
                                                    ...procedimentos[i]
                                                },
                                                procNome: {
                                                    ...(nomeProcedimentos.filter((innerParam) => innerParam.id === procedimentos[i].procedimentoID))
                                                },
                                                odontograma: {
                                                    ...(odontogramas.filter((innerParam) => innerParam.id === procedimentos[i].odontogramaID))
                                                }
                                            })
                                        }
                                    }
                                }
                                $scope.allProcedimentosDentes = merged
                                $scope.listaProcedimentosEncaminhadosPlanoOdontologico = mergedEnc
                            })
                        })
                    })
                })
            }

            $scope.salvarEncaminhamentoProcedimentos = async (item) => {
                if (item.proc.dentistaID == '0') {
                    alert('O campo dentista é obrigatório')
                    return
                }
                let novoProcedimentoEncaminhado = {
                    id: item.proc.id,
                    descricao: item.proc.descricao,
                    dentistaID: item.proc.dentistaID,
                    dentistaSendId: $scope.profissionalID,
                    clinicaID: $scope.atendimentoSelecioandoCompleto.clinicaID,
                    pacienteID: $scope.pacienteID,
                    odontogramaID: item.odontograma[0].id,
                    created_at: Utils.generateDateToDataBase()
                }
                await AtendimentoService.atualizarOdontogramaProcedimento(novoProcedimentoEncaminhado).success(res => {
                    atualizarPlanejamentoClinico({
                        id: $scope.atendimentoSelecioando
                    })
                })
            }

            $scope.verificarBotoes = async (item) => {
                if(item.tipo == 'particular' && $scope.planejamentoAprovado && $scope.planejamentoAprovado.length > 0){
                    Utils.mensagemDeErro("Já existe planejamento financeiro para este agendamento.");
                    item.tipo = '';
                }

                await inativarBotoes()
            }

            async function inativarBotoes() {
                $scope.botaoZero = $scope.atendimentoListaParamentros.dente == '' ? true : false
            }

            //INICIA A LISTA DE DENTES JA ADICIONADOS AO ODONTOGRAMA DO ATENDIMENTO
            $scope.gerarDentesOdontograma = () => {
                $scope.listaOdontograma = {
                    dente: null
                };
            }

            //GERAR A VERIFICAÇÃO DOS STEPS
            $scope.gerarListaViews = () => {
                $scope.views = [true, false, false, false, false] //INICIO DE VISUALIZAÇÃO ATENDIMENTO
            }

            // INICIA O MODEL DA SITUAÇÃO, PARA QUE POSSA DAR UM CHECK EM UMA OU MAIS SITUAÇÕES
            $scope.gerarSituacaoModel = () => {
                $scope.situacao = [];
            }

            // INICIA O MODEL DA FACE, PARA QUE POSSA DAR UM CHECK EM UMA OU MAIS FACE
            $scope.gerarFaceModel = () => {
                $scope.face = [];
            }

            //CARREGA A ATUALIZAÇÃO DO ATENDIMENTO 
            async function atuzalizarAtendimento() {
                $scope.atendimentoListaParamentros.atualizacaoAtendimento = ''
                await AtendimentoService.buscarAtendimentoPorId($scope.atendimentoSelecioando).success((res) => {
                    $scope.atendimentoListaParamentros.atualizacaoAtendimento = res.comentario
                })
            }

            //INICIAO O OBJETO GERAL DO ATENDIMENTO 
            $scope.gerarObjetoParametros = () => {
                $scope.atendimentoListaParamentros = {
                    dente: '',
                    situacao: [],
                    face: [],
                    comentario: '',
                    procedimentos: [],
                    atualizacaoAtendimento: '',
                    atualizacaoDente: ''
                }
            }

            // FUNÇÃO USADA PARA FAZER O CARREGAMENTO DOS DADOS AO SELECIONAR UM DENTE QUE AINDA NAO ESTA NA LISTA DO ODONTOGRAMA
            //VERIFICA TAMBÉM SE O DENTE SELECIONADO JA ESTÁ NA LISTA DO ODONTOGRAMA, FAZENDO COM QUE CARREGUE AS INFORMAÇÕES DO DENTE
            $scope.selecionarDente = (dente, backStep) => {
                // atualizarComentarioAgendamento()
                if (backStep == 0) {
                    setTimeout(() => {
                        Utils.posicionarDentes();
                    }, 80);
                }

                var nomeDente = dente.nome
                var denteOdontograma = $scope.odontograma.odontograma.filter(e => e.dente === nomeDente)

                $scope.atendimentoListaParamentros.dente = nomeDente
                $scope.novoDenteSelecionado = dente

                if (denteOdontograma.length > 0) {
                    $scope.listaOdontograma.dente = denteOdontograma[0].dente;
                    $scope.denteSelecionado(nomeDente, backStep)
                } else {
                    $scope.listaOdontograma.dente = {
                        dente: ''
                    }
                }

                $scope.situacao = [];
                $scope.face = [];
                $scope.verificarBotoes('ignorar');
            }

            //CARREGA AS INFORMAÇÕES DO DENTE ASSIM QUE SELECIONADO UM DENTE LISTADO NO ADONTOGRAMA
            $scope.denteSelecionado = async (denteSelecionado, backStep) => {
                if (!backStep) {
                    $scope.listarViewEspecifica(0)
                }

                $scope.categoria.nome = '';
                $scope.listaProcedimentos = [];
                $scope.listaProcedimentosEncaminhados = [];
                $scope.atendimentoListaParamentros.procedimentos = []

                let odontograma = $scope.odontograma.odontograma.filter(e => e.dente === denteSelecionado)

                await atualizarDentesOdontograma(denteSelecionado)
                await atualizarProcedimentosOdontograma($scope.atendimentoListaParamentros.dente)
                await atualizarSituacaoOdontograma()
                await atualizarFaceOdontograma()
                await atualizarComentarioAgendamento()
                await atualizarAtualizacaoDente()
                await $scope.verificarBotoes('ignorar')



                // atualizar o model de dentes
                function atualizarDentesOdontograma(denteSelecionado) {
                    let d = $scope.dentes.filter(e => e.nome === denteSelecionado)
                    $scope.atendimentoListaParamentros.dente = d[0].nome
                }

                //atualizar situação do odotograma selecionado
                async function atualizarSituacaoOdontograma() {
                    await buscarSituacaoPorOdontograma(odontograma[0].id)
                    $scope.situacao = [];
                    let sitDentes = $scope.situacaoDentesSelecionado.filter(e => e.odontogramaID == odontograma[0].id)
                    let posicaoSituacao = []

                    sitDentes.forEach((el) => {
                        $scope.situacaoDentes.filter(e => {
                            if (el.situacao == e.nome) {
                                posicaoSituacao.push(e)
                            }
                        })
                    })

                    posicaoSituacao.forEach(e => {
                        $scope.situacao[e.id] = true
                    })
                    $scope.verificarBotoes('ignorar')
                }

                //atualizar faces do odotograma selecionado
                async function atualizarFaceOdontograma() {
                    await buscarFacePorOdontograma(odontograma[0].id)
                    $scope.face = [];
                    let facDentes = $scope.faceSelecionada.filter(e => e.odontogramaID === odontograma[0].id)
                    let posicaoFace = []

                    facDentes.forEach((el) => {
                        $scope.facesDentes.filter(e => {
                            if (el.faceta == e.nome) {
                                posicaoFace.push(e)
                            }
                        })
                    })
                    posicaoFace.forEach(e => {
                        $scope.face[e.id] = true
                    })
                    $scope.verificarBotoes('ignorar')
                }

                async function atualizarAtualizacaoDente() {
                    $scope.atendimentoListaParamentros.atualizacaoDente = ''
                    await AtendimentoService.buscarOdontogramaPorId(odontograma[0].id).success((res) => {
                        $scope.atendimentoListaParamentros.atualizacaoDente = res.atualizacao
                    })
                }

                async function atualizarComentarioAgendamento() {
                    $scope.atendimentoListaParamentros.comentario = ''
                    await AtendimentoService.buscarOdontogramaPorId(odontograma[0].id).success((res) => {
                        $scope.atendimentoListaParamentros.comentario = res.descricao
                    })
                }

            }
            //atualizar lista de procedimento do odontograma selecionado
            async function atualizarProcedimentosOdontograma(denteSelecionado) {
                let odontograma = $scope.odontograma.odontograma.filter(e => e.dente === denteSelecionado)
                let allProcedimentos = []
                $scope.listaProcedimentos = []
                let novoProc = {}

                if(odontograma[0]){
                    await AtendimentoService.buscarProcedimentoPorOdontograma(odontograma[0].id).success((res) => {
                        allProcedimentos = res.odontogramaProcedimento
                    })

                    const lista1 = allProcedimentos //procedimentos carregados por dente
                    let lista2 = $scope.procedimentosDoBanco

                    lista1.forEach(e => {
                        lista2.filter(async (el) => {
                            if (e.procedimentoID == el.id) {
                                // await buscarOdontogramaPorId(e.odontogramaID)
                                novoProc = {
                                    id: e.id,
                                    nome: el.nome,
                                    categoria: el.categoria,
                                    tipo: e.tipo,
                                    odontogramaID: e.odontogramaID,
                                    procedimentoID: e.procedimentoID,
                                    realizado: e.realizado,
                                    dentistaID: e.dentistaID,
                                    descricao: e.descricao,
                                    encaminhamento: e.dentistaID != 0 ? 'true' : 'false',
                                    dente: odontograma[0].dente
                                }
                                if (odontograma.length > 0) {
                                    if (odontograma[0].id == e.odontogramaID) {
                                        $scope.listaProcedimentos.push(novoProc)
                                        $scope.$apply();
                                    }
                                }
                            }
                        })
                    })
                }
            }

            $scope.finalizarAtendimento = () => {
                let objetoAgendamento = {
                    id: $scope.atendimentoSelecioando,
                    situacao: 'finalizado',
                    updated_at: Utils.generateDateToDataBase()
                }
                AtendimentoService.atualizarAgendamento(objetoAgendamento).success(() => {
                    $scope.editandoAtendimento = false
                    $scope.buscarAgendamentosPorPacienteID();
                })
            }

            //ADICIONA VALORES AO OBJETO PADRAO DO ATENDIEMNTO 
            $scope.addParametroLista = () => {
                if ($scope.stepAtual - 1 == 0) {
                    addDente()
                } else if ($scope.stepAtual - 1 == 1) {
                    addSituacao()
                } else if ($scope.stepAtual - 1 == 2) {
                    addFace()
                    addComentario()
                } else if ($scope.stepAtual - 1 == 3) {
                    atualizarTipoPorcedimento()
                }
            }

            $scope.salvarAtualizacaoDente = () => {
                let odontograma = $scope.odontograma.odontograma.filter(e => e.dente === $scope.atendimentoListaParamentros.dente)

                let obj = {
                    id: odontograma[0].id,
                    atualizacao: $scope.atendimentoListaParamentros.atualizacaoDente,
                    updated_at: Utils.generateDateToDataBase()
                }
                AtendimentoService.atualizarOdontograma(obj).success((e) => {})
            }

            $scope.salvarAtualizacaoAtendimento = () => {
                let obj = {
                    id: $scope.atendimentoSelecioando,
                    comentario: $scope.atendimentoListaParamentros.atualizacaoAtendimento,
                    updated_at: Utils.generateDateToDataBase()
                }
                AtendimentoService.atualizarAgendamento(obj).success((e) => {})
            }

            $scope.radioProc = (desc, tip) => {
                let denteAtual = $scope.atendimentoListaParamentros.dente;
                let odontogramaAtual = $scope.odontograma.odontograma.filter(e => e.dente == denteAtual)

                let idOdontograma = odontogramaAtual[0].id

                procedimentosTiposSelecionados = {
                    tipo: tip.nome,
                    procedimentoID: desc[0].id,
                    odontogramaID: idOdontograma
                }
                if ($scope.itensProcedimentos.length > 0) {
                    $scope.itensProcedimentos.filter((e, i) => {
                        if (e.procedimentoID == desc[0].id) {
                            $scope.itensProcedimentos.splice(i, 1)
                        }
                    })
                }
                $scope.itensProcedimentos.push(procedimentosTiposSelecionados)
            }


            // GERAR UM OBJETO UNICO DA DENTE CONTENDO (ATENDIMENTO E DENTE)
            async function addDente() {
                let objetoDente = {
                    agendamentoID: $scope.atendimentoSelecioando,
                    dente: $scope.atendimentoListaParamentros.dente,
                    created_at: Utils.generateDateToDataBase()
                }
                await buscarOdontogramaPorAtendimento($scope.atendimentoSelecioando)
                let verificarOdontograma = $scope.odontograma.odontograma.filter(e => e.dente === objetoDente.dente)
                if (verificarOdontograma <= 0) {
                    if (objetoDente.dente != '') {
                        await AtendimentoService.criarOdontogramaPorAtendimento(objetoDente).success((response) => {})
                        await buscarOdontogramaPorAtendimento($scope.atendimentoSelecioando)
                        $scope.selecionarDente($scope.novoDenteSelecionado, true)
                    }
                }
            }

            // GERAR UM OBJETO UNICO DA SITUAÇÃO CONTENDO (ATENDIMENTO, SITUAÇÃO E DENTE)
            async function addSituacao() {
                $scope.atendimentoListaParamentros.situacao = []
                $scope.situacaoDentes.filter((el, i) => {
                    $scope.situacao.forEach((element, index) => {
                        if (i == index && element == true) {
                            $scope.atendimentoListaParamentros.situacao.push(el)
                        } else if (index == i && element == false) {
                            $scope.atendimentoListaParamentros.situacao.splice(index, 1)
                        }
                    });
                })

                $scope.atendimentoListaParamentros.situacao = $scope.atendimentoListaParamentros.situacao.filter(function (a) {
                    return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                }, Object.create(null))

                //BUSCAR O ID DO ODONTOGRAMA ATUAL
                let denteAtual = $scope.atendimentoListaParamentros.dente;
                let odontogramaAtual = $scope.odontograma.odontograma.filter(e => e.dente == denteAtual)

                let idOdontograma = Number(odontogramaAtual[0].id)


                await buscarSituacaoPorOdontograma(idOdontograma)
                if ($scope.situacaoDentesSelecionado.length > 0) {
                    $scope.situacaoDentesSelecionado.forEach(async (e) => {
                        await AtendimentoService.deleteSituacaoPorId(e.id).success(() => {})
                    })
                }

                if ($scope.atendimentoListaParamentros.situacao.length > 0) {
                    $scope.atendimentoListaParamentros.situacao.forEach(async (e) => {
                        let objetoSituacao = {
                            atendimento: $scope.atendimentoSelecioando,
                            odontogramaID: idOdontograma,
                            situacao: e.nome,
                            created_at: Utils.generateDateToDataBase()
                        }
                        await AtendimentoService.criarSituacaoPorOdontograma(objetoSituacao).success(() => {})
                    })
                }
            }

            // GERAR UM OBJETO UNICO DA FACE CONTENDO (ATENDIMENTO, FACE E DENTE)
            async function addFace() {
                $scope.atendimentoListaParamentros.face = []
                $scope.facesDentes.filter((el, i) => {
                    $scope.face.forEach((element, index) => {
                        if (i == index && element == true) {
                            $scope.atendimentoListaParamentros.face.push(el)
                        } else if (index == i && element == false) {
                            $scope.atendimentoListaParamentros.face.splice(index, 1)
                        }
                    });
                })
                $scope.atendimentoListaParamentros.face = $scope.atendimentoListaParamentros.face.filter(function (a) {
                    return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                }, Object.create(null))

                let denteAtual = $scope.atendimentoListaParamentros.dente;
                let odontogramaAtual = $scope.odontograma.odontograma.filter(e => e.dente == denteAtual)

                let idOdontograma = odontogramaAtual[0].id

                await buscarFacePorOdontograma(idOdontograma)
                if ($scope.faceSelecionada.length > 0) {
                    $scope.faceSelecionada.forEach(async (e) => {
                        await AtendimentoService.deleteFacePorId(e.id).success(() => {})
                    })
                }

                if ($scope.atendimentoListaParamentros.face.length > 0) {
                    $scope.atendimentoListaParamentros.face.forEach(async (e) => {
                        let objetoFace = {
                            atendimento: $scope.atendimentoSelecioando,
                            odontogramaID: idOdontograma,
                            faceta: e.nome,
                            created_at: Utils.generateDateToDataBase()
                        }
                        await AtendimentoService.criarFacePorOdontograma(objetoFace).success(() => {})
                    })
                }
            }

            // GERAR UM OBJETO UNICO DA COMENTARIO CONTENDO (ATENDIMENTO, COMENTARIO E DENTE)
            function addComentario() {
                let denteAtual = $scope.atendimentoListaParamentros.dente;
                let odontogramaAtual = $scope.odontograma.odontograma.filter(e => e.dente == denteAtual)
                let idOdontograma = Number(odontogramaAtual[0].id)

                let agendamento = $scope.atendimentoSelecioandoCompleto
                agendamento['comentario'] = $scope.atendimentoListaParamentros.comentario

                let objetoComentario = {
                    id: idOdontograma,
                    descricao: agendamento.comentario,
                    updated_at: Utils.generateDateToDataBase()
                }
                AtendimentoService.atualizarOdontograma(objetoComentario).success(() => {})
            }

            async function addProcedimento(item) {
                let denteAtual = $scope.atendimentoListaParamentros.dente;
                let odontogramaAtual = $scope.odontograma.odontograma.filter(e => e.dente == denteAtual)
                let idOdontograma = Number(odontogramaAtual[0].id)

                let convenioDoCliente = descobrirConvenio();
                let valorDoProcedimentoPeloConvenio = eval('item.valor' + convenioDoCliente);

                let objetoProcedimento = {
                    odontogramaID: idOdontograma,
                    procedimentoID: item.id,
                    valor: item.valor1 ? item.valor1 : 0,
                    valorConvenio: valorDoProcedimentoPeloConvenio != null ? valorDoProcedimentoPeloConvenio : 0,
                    created_at: Utils.generateDateToDataBase()
                }
                AtendimentoService.criarProcedimentoPorOdontograma(objetoProcedimento).success(async () => {
                    await atualizarPlanejamentoClinico({id: $scope.atendimentoSelecioando})
                    await atualizarProcedimentosOdontograma($scope.atendimentoListaParamentros.dente)
                })
            }

            var descobrirConvenio = function(){
                var convenioNome = localStorage.getItem('convenioNome');
                if( convenioNome == 'PARTICULAR'){ return 1; }
                if( convenioNome == 'AMIL'){ return 2; }
                if( convenioNome == 'METLIFE'){ return 3; }
                if( convenioNome == 'UNIMED'){ return 4; }
                if( convenioNome == 'ODONTOPREV'){ return 5; }
            }

            $scope.openModalConfirmRealizado = (registro) => {
                $scope.itemRealizado = registro
                if ($scope.itemRealizado.realizado) {
                    $('#myModal').modal({
                        backdrop: "static",
                        keyboard: false
                    })
                }
            }

            $("#cancelarRealizado").click(() => {
                $scope.$evalAsync(function () {
                    $scope.allProcedimentosDentes.forEach(e => {
                        if (e.id === $scope.itemRealizado.id) {
                            if (e.proc) {
                                e.proc.realizado = false
                            }
                            if (e.realizado) {
                                e.realizado = false
                            }
                        }
                    })
                })
                $('#myModal').modal('toggle');
            })

            $("#confirmarRealizado").click(function () {
                if ($scope.itemRealizado) {
                    $scope.$evalAsync(async function () {

                        let mesmoAtendimento = $scope.itemRealizado.odontograma[0].agendamentoID === $scope.atendimentoSelecioando;

                        let itemUpdate = {
                            id: $scope.itemRealizado.proc.id,
                            realizado: true,
                            mostrarRealizado: mesmoAtendimento == false ? null : true,
                            updated_at: Utils.generateDateToDataBase()
                        }

                        AtendimentoService.atualizarOdontogramaProcedimento(itemUpdate).success(res => {
                            atualizarPlanejamentoClinico({
                                id: $scope.atendimentoSelecioando
                            })
                            atualizarProcedimentosOdontograma($scope.atendimentoListaParamentros.dente)
                        })

                        // AtendimentoService.atualizarOdontogramaProcedimento(itemUpdate).success(res => {
                        //     atualizarPlanejamentoClinico({
                        //         id: $scope.atendimentoSelecioando
                        //     })
                        //     atualizarProcedimentosOdontograma($scope.atendimentoListaParamentros.dente)
                        // })

                        
                        if ($scope.itemRealizado.odontograma[0].agendamentoID.trim() != $scope.atendimentoSelecioando.trim()) {
                            AtendimentoService.buscarOdontogramaPorAtendimento($scope.atendimentoSelecioando).success((res) => {
                                let array = []

                                res.odontograma.forEach(e => {
                                    if (e.dente == $scope.itemRealizado.odontograma[0].dente) {
                                        array.push(e)
                                    }
                                })
                                if (array.length > 0) {
                                    let obj = {
                                        odontogramaID: array[0].id,
                                        procedimentoID: $scope.itemRealizado.procNome[0].id,
                                        realizado: true,
                                        tipo: $scope.itemRealizado.proc.tipo,
                                        valor: $scope.itemRealizado.proc.valor,
                                        valorConvenio: $scope.itemRealizado.proc.valorConvenio,
                                        mostrarRealizado: true,
                                        created_at: Utils.generateDateToDataBase(),
                                        guia : $scope.itemRealizado.proc.guia,
                                        observacao_apoio : $scope.itemRealizado.proc.observacao_apoio,
                                        dentistaID : $scope.itemRealizado.proc.dentistaExecutorID == null ? "0" : e.dentistaExecutorID
                                    }
                                    AtendimentoService.criarProcedimentoPorOdontograma(obj).success(() => {})
                                } else {
                                    let objetoDente = {
                                        agendamentoID: $scope.atendimentoSelecioando,
                                        dente: $scope.itemRealizado.odontograma[0].dente,
                                        created_at: Utils.generateDateToDataBase()
                                    }
                                    AtendimentoService.criarOdontogramaPorAtendimento(objetoDente).success((idOdontograma) => {
                                        AtendimentoService.buscarSituacaoPorOdontograma($scope.itemRealizado.odontograma[0].id).success(res => {
                                            res.odontogramaSituacao.forEach(async (e) => {
                                                let objetoSituacao = {
                                                    atendimento: $scope.atendimentoSelecioando,
                                                    odontogramaID: idOdontograma,
                                                    situacao: e.situacao,
                                                    created_at: Utils.generateDateToDataBase()
                                                }
                                                await AtendimentoService.criarSituacaoPorOdontograma(objetoSituacao).success(() => {})
                                            })
                                        })
                                        AtendimentoService.buscarFacePorOdontograma($scope.itemRealizado.odontograma[0].id).success(res => {
                                            res.odontogramaFaceta.forEach(async (e) => {
                                                let objetoFace = {
                                                    atendimento: $scope.atendimentoSelecioando,
                                                    odontogramaID: idOdontograma,
                                                    faceta: e.faceta,
                                                    created_at: Utils.generateDateToDataBase()
                                                }
                                                await AtendimentoService.criarFacePorOdontograma(objetoFace).success(() => {})
                                            })
                                        })
                                        AtendimentoService.buscarProcedimentoPorOdontograma($scope.itemRealizado.odontograma[0].id).success((res) => {
                                            res.odontogramaProcedimento.forEach((e) => {


                                                if(e.procedimentoID == $scope.itemRealizado.proc.procedimentoID){

                                                    let realizado = true;
                                                    let mostrarRealizado = true;

                                                    if( (e.realizado == "0" || e.realizado == null) && (e.mostrarRealizado == "0" || e.mostrarRealizado == null) ){
                                                        realizado = null;
                                                        mostrarRealizado = null;
                                                    }
                                                    
                                                    let objetoProcedimento = {
                                                        odontogramaID: idOdontograma,
                                                        procedimentoID: e.procedimentoID,
                                                        realizado: realizado,
                                                        tipo: e.tipo,
                                                        valor: e.valor,
                                                        valorConvenio: e.valorConvenio,
                                                        mostrarRealizado: mostrarRealizado,
                                                        created_at: Utils.generateDateToDataBase(),
                                                        guia : e.guia,
                                                        observacao_apoio : e.observacao_apoio,
                                                        dentistaID : e.dentistaExecutorID == null ? "0" : e.dentistaExecutorID
                                                    }
                                                    AtendimentoService.criarProcedimentoPorOdontograma(objetoProcedimento).success(() => {})
                                                }

                                            })
                                            atualizarPlanejamentoClinico({
                                                id: $scope.atendimentoSelecioando
                                            })
                                        })
                                    })
                                }
                            })
                        }
                        
                    })
                }
                $('#myModal').modal('toggle');
            })

            //ADICIONA PROCEDIMENTO NA LISTA DE ENCAMINHAMENTOS
            $scope.encaminharProcedimento = (item) => {
                let count = $scope.listaProcedimentosEncaminhadosPlanoOdontologico.filter(e => e.proc.id === item.proc.id)
                if (count.length <= 0) {
                    $scope.listaProcedimentosEncaminhadosPlanoOdontologico.push(item)
                }
            }

            //FILTRA A LISTA DE PROCEDIMENTOS DISPONIVEIS PARA ESCOLHA
            $scope.filtrarProcedimentosPorCategoria = (categoria) => {
                $scope.procedimentosLista = [];
                $scope.procedimentosLista = $scope.procedimentosDoBanco.filter(e => e.categoria === categoria);
            }

            async function atualizarTipoPorcedimento() {
                let objetosUpdate = []
                $scope.listaProcedimentos.forEach(e => {
                    $scope.allProcedimentosDentes.filter(el => {
                        if (e.id == el.proc.id) {
                            objetosUpdate.push({
                                id: el.proc.id,
                                tipo: e.tipo ? e.tipo : null
                            })
                        }
                        if (e.id == el.proc.procedimentoID) {
                            objetosUpdate.push({
                                id: el.proc.id,
                                tipo: e.tipo ? e.tipo : null
                            })
                        }
                    })
                })
                objetosUpdate.forEach(e => {
                    e['updated_at'] = Utils.generateDateToDataBase();
                    AtendimentoService.atualizarOdontogramaProcedimento(e).success(res => {})
                })
            }

            var buscarPlanejamentoAprovadoPorAgendamentoID = async function(agendamentoID){
                await PlanejamentoService.buscarPlanejamentoAprovadoPorAgendamentoID(agendamentoID).success((res) => {
                    $scope.planejamentoAprovado = res;
                })
            }

            $scope.adicionarProcedimentos = async (event) => {
                if (event[0]) {
                    let count = []
                    $scope.listaProcedimentos.filter(e => {
                        if (e.procedimentoID) {
                            if (e.procedimentoID === event[0].id) {
                                count.push('')
                            }
                        }
                        if (!e.procedimentoID) {
                            if (e.id === event[0].id) {
                                count.push('')
                            }
                        }
                    })
                    if (count.length <= 0) {
                        gerarListaProcedimentos(event)
                    }
                }
                $scope.verificarBotoes('ignorar');
                
            }

            async function gerarListaProcedimentos(procedimento) {
                $scope.listaProcedimentos.push(procedimento[0])
                await addProcedimento(procedimento[0])
                $scope.verificarBotoes('ignorar')
            }

            //REMOVER UM ELEMENTO DA LISTA DE PROCEDIMENTOS SELECIONADOS PARA UM DENTE
            $scope.removerProcedimentoLista = async (item) => {
                let id = item.id;

                AtendimentoService.deleteProcedimentoPorId(id).success(res => {
                    atualizarPlanejamentoClinico({
                        id: $scope.atendimentoSelecioando
                    })
                })

                var result = $scope.listaProcedimentos.filter((el) => {
                    if (el[0]) {
                        return el[0].id == item[0].id
                    } else {
                        return el.id == item.id
                    }
                });
                for (var elemento of result) {
                    var index = $scope.listaProcedimentos.indexOf(elemento);
                    $scope.listaProcedimentos.splice(index, 1);
                }
                if ($scope.listaProcedimentos.length <= 0) {
                    $scope.listaProcedimentos = []
                }
                $scope.verificarBotoes('ignorar')
            }

            //INICIO DE DADOS FIXOS
            function initData() {
                $scope.facesDentes = Utils.criarFaceDentes();
                $scope.situacaoDentes = Utils.criarSituacaoDentes();
                $scope.dentes = Utils.criarDentes();
            }

            //BUSCAR DADOS DA BASE
            async function buscarProcedimentoPorOdontograma(id) {
                await AtendimentoService.buscarProcedimentoPorOdontograma(id).success((res) => {
                    if (res != "erro") {
                        $scope.procedimentoBanco = res.odontogramaProcedimento
                    }
                })
            }
            async function buscarFacePorOdontograma(obj) {
                await AtendimentoService.buscarFacePorOdontograma(obj).success((res) => {
                    if (res == "erro") {
                        console.info(res)
                    } else {
                        $scope.faceSelecionada = res.odontogramaFaceta
                    }
                })
            }

            async function buscarOdontogramaPorAtendimento(id) {
                await AtendimentoService.buscarOdontogramaPorAtendimento(id).success((response) => {
                    if (response == "erro") {
                        console.info(response)
                    } else {
                        $scope.odontograma = response
                    }
                })
            }

            async function buscarSituacaoPorOdontograma(obj) {
                await AtendimentoService.buscarSituacaoPorOdontograma(obj).success((response) => {
                    if (response == "erro") {
                        console.info(response)
                    } else {
                        $scope.situacaoDentesSelecionado = response.odontogramaSituacao
                    }
                })
            }

            async function buscarOdontogramaPorId(id) {
                await AtendimentoService.buscarOdontogramaPorId(id).success((res) => {
                    $scope.odontogramaPorId = res
                })
            }

            $scope.getAllProcedimentos = function () {
                let clinicaId = $scope.atendimentoSelecioandoCompleto.clinicaID;
                // let clinicaId = JSON.parse(localStorage.getItem('ngStorage-clinica')).id
                ProcedimentoService.getByStatusAndClinica(clinicaId)
                    .success(function (response) {
                        if (response == "erro") {
                            console.info("erro");
                        } else {
                            if (response.procedimento.length > 0) {
                                $scope.procedimentosDoBanco = response.procedimento;
                            } else {
                                $scope.procedimentosDoBanco = new Object();
                            }

                            $scope.buscado = true;
                        }
                    })
                    .error(function (response) {
                        $scope.mensagem = "Erro ao buscar registros.";
                        $scope.flagSemConteudo = true;
                    });
            }

            $scope.buscarAgendamentosPorPacienteID = function () {
                AgendamentoService.buscarAgendamentosPorPacienteID($scope.objeto.pacienteID)
                    .success(function (response) {
                        if (response == "erro") {
                            console.info("erro");
                        } else {
                            if (response.length > 0) {
                                $scope.objetos = response.filter(function (item) {
                                    return item.situacao == 'em atendimento' || item.situacao == 'finalizado';
                                });
                                mergedClinicaAtendimento()
                            } else {
                                $scope.objetos = new Object();
                            }

                            $scope.buscado = true;
                        }
                    })
                    .error(function (response) {});
            }

            var buscarClinicas = async () => {
                await ClinicaService.getAll().success(res => {
                    $scope.clinicas = res.clinica
                })
            }

            var mergedClinicaAtendimento = async () => {
                await buscarClinicas();
                let merged = [];
                for (let i = 0; i < $scope.objetos.length; i++) {
                    merged.push({
                        ...$scope.objetos[i],
                        clinicaNome: {
                            ...($scope.clinicas.find((itmInner) => itmInner.id == $scope.objetos[i].clinicaID))
                        }
                    })
                }
                $scope.$evalAsync(function () {
                    $scope.objetos = merged
                })
            }

            $scope.buscarProfissionais = function () {
                ProfissionalService.getBySituacao('ativo')
                    .success(function (response) {
                        if (response.profissional.length > 0) {
                            $scope.profissionais = response.profissional;
                            // Utils.mensagemDeSucesso("encontrei profissionais: " + response.profissional.length);
                        } else {
                            Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
                        }
                    })
                    .error(function (response) {
                        Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
                    });
            }

            //CONFIGURAÇÕES GERAIS

            //VOLTAR PARA LISTA DE ATENDIMENTOS DO CLEINTE SELECIOADNO
            $scope.return = () => {
                $scope.editandoAtendimento = false
                $scope.listaProcedimentos = []
                $scope.itensProcedimentos = []
                $scope.listaProcedimentosEncaminhados = []
                $(".span-datails #data").val('');
                $(".span-datails #dentista").val('');
                $(".span-datails #procd").val('');

                chamarFuncoes()
            }

            $scope.listarViewEspecifica = function (item) {
                if (item == 0) {
                    setTimeout(() => {
                        Utils.posicionarDentes();
                    }, 80);
                }
                inativarBotoes();
                for (let i = 0; i < $scope.views.length; i++) {
                    if (item !== i) {
                        $scope.views[i] = false
                    } else {
                        $scope.views[i] = true
                    }
                }
            }

            //VOLTAR UM STEP
            $scope.backStep = (anteirorStep) => {
                $scope.listarViewEspecifica(anteirorStep);
            }

            //SEGUIR UM STEP E CRIAR OS OBJETOS DE CADA STEP
            $scope.nextStep = (proximoStep) => {
                $scope.verificarBotoes('ignorar')
                $scope.stepAtual = proximoStep
                $scope.listarViewEspecifica(proximoStep);
                $scope.addParametroLista()
            }


            $scope.removerDente = function (dente) {
                $('#modalExcluirDente').modal({
                    backdrop: "static"
                })
                $("#confirmarExcluirDente").click(function () {
                    AtendimentoService.deleteOdontogramaPorId(dente.id).success(res => {
                        buscarOdontogramaPorAtendimento($scope.atendimentoSelecioando)
                    })
                    $('#modalExcluirDente').modal('toggle');
                })

                $("#cancelarExcluirDente").click(function () {
                    $('#modalExcluirDente').modal('toggle');
                })

            }

            //INICIO GERAL DE FUNÇÕES
            function chamarFuncoes() {
                $scope.gerarObjetoParametros();
                $scope.gerarSituacaoModel();
                $scope.gerarListaViews();
                $scope.gerarDentesOdontograma();
                $scope.gerarFaceModel();
                $scope.buscarProfissionais();
                initData();
            }

            async function verificarAcessoAoAtendimento() {
                setTimeout(async () => {
                    if (!localStorage.getItem('navigateProntuario')) {
                        if ($scope.$parent.$parent && $scope.$parent.$parent.objeto && $scope.$parent.$parent.objeto.id) {
                            acessarAtendimentoPaciente()
                        }
                        if (localStorage.getItem('editandoAtendimento')) {
                            acessarProntuarioPaciente()
                        }
                    }
                }, 10)
            }

            async function acessarAtendimentoPaciente() {
                var pacienteID = $scope.$parent.$parent.objeto.id;
                $scope.objeto.pacienteID = pacienteID;
                $scope.buscarAgendamentosPorPacienteID();
                chamarFuncoes()
            }

            async function acessarProntuarioPaciente() {
                let evento = JSON.parse(localStorage.getItem('evento'))
                await AtendimentoService.buscarAtendimentoPorId(evento.id).success(async (e) => {
                    await ProfissionalService.getOne(e.profissionalID).success((res) => {
                        e['profissionalNome'] = res.nome
                        $scope.editarAtendimento(e)
                    })
                })
                localStorage.removeItem('editandoAtendimento')
                localStorage.removeItem('evento')
            }

            $scope.criarPlanejamentos = function(){
                var agendamentoID = localStorage.getItem('agendamentoID');

                PlanejamentoService.buscarProcedimentoParticularPorAgendamentoID(agendamentoID)
                .then(function onSuccess(response) {
                    var procedimentosParticular = response.data;
                    
                    if(procedimentosParticular.length > 0){
                        PlanejamentoService.criarPlanejamentosBaseadosNoAgendamentoID(agendamentoID)
                        .then(function onSuccess(response) {
                            Utils.apresentarToastSucesso("Planejamento financeiro criado com sucesso!");
                            $(".criarPlanejamentos").hide();
                        }).catch(function onError(response) {
                            Utils.apresentarToastSucesso("Erro ao criar planejamento financeiro.");
                        });
                    }else{
                        Utils.apresentarToastErro("Não existem procedimentos marcados como PARTICULAR para este agendamento.");
                    }
                }).catch(function onError(response) {
                    Utils.apresentarToastErro("Erro ao verificar procedimentos.");
                });

            }

            var verificarPlanejamentoProvado = async function(){
                var agendamentoID = localStorage.getItem('agendamentoID');

                await buscarPlanejamentoAprovadoPorAgendamentoID(agendamentoID);
                
                if($scope.planejamentoAprovado && $scope.planejamentoAprovado.length > 0){
                    $(".criarPlanejamentos").hide();
                }
            }

            $("#atendimento-tab").on("click", function () {
                // verificarPlanejamentoProvado();
            })

            var verificarConvenio = function(){
                var pacienteID = localStorage.getItem('pacienteID');
                PacienteService.getOne(pacienteID).then(
                    function(response){
                        if(response.data.convenioNome){
                            localStorage.setItem('convenioNome', response.data.convenioNome);
                        }
                    }
                );
            }

            init = async function () {
                verificarAcessoAoAtendimento();
                verificarConvenio();
            };

            init();
        }
    ]);