angular.module('principal')
    .controller('EntradasSaidasController', ['$scope', '$localStorage','$compile', 'ApoioService','ProfissionalService','AcertosService', '$q', '$filter', 'Utils', 'EntradaSaidaService','Dados', 'PlanejamentoService',
        function ($scope, $localStorage,$compile, ApoioService,ProfissionalService, AcertosService, $q, $filter, Utils, EntradaSaidaService,Dados, PlanejamentoService) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.barramento = GLOBAL.barramento;
            $scope.controles = {
                mostrarClinicas: false,
                clinicaSelecionada: null,
                ano: new Date().getFullYear(),
                mes: new Date().getMonth() + 1,
                confirmarAcertos: false
            }
            $scope.objetos = [];

            $scope.objeto.valor = 0;

            $scope.receitas = [
                {"key": 2, "value" : "Convênio"},
                // + ...dentistas
            ];

            $scope.formasDePagamento = Dados.formasDePagamento();

            $scope.custos = [
                {"key": 1, "value" : "UNIFORME"},
                {"key": 2, "value" : "SISTEMA DE INFORMÁTICA"},
                {"key": 3, "value" : "SALÁRIOS"},
                {"key": 4, "value" : "PROTÉTICO"},
                {"key": 5, "value" : "PAPELARIA"},
                {"key": 6, "value" : "MAT. LIMPEZA"},
                {"key": 7, "value" : "MARKETING"},
                {"key": 8, "value" : "MANUTENÇÃO"},
                {"key": 9, "value" : "LUZ"},
                {"key": 10, "value" : "INVISALIGN"},
                {"key": 11, "value" : "INTERNET"},
                {"key": 12, "value" : "IMPOSTOS"},
                {"key": 13, "value" : "IMPLANTES"},
                {"key": 14, "value" : "HONORÁRIOS"},
                {"key": 15, "value" : "EXTRAS"},
                {"key": 16, "value" : "EQUIPAMENTOS"},
                {"key": 17, "value" : "DESCARTÁVEIS"},
                {"key": 18, "value" : "DENTAL ORTODONTIA"},
                {"key": 19, "value" : "DENTAL CLÍNICA"},
                {"key": 20, "value" : "CORREIOS"},
                {"key": 21, "value" : "CONTABILIDADE"},
                {"key": 22, "value" : "CONDOMINIO"},
                {"key": 23, "value" : "BOTOX"},
                {"key": 24, "value" : "AUXILIO MORADIA"},
                {"key": 25, "value" : "ALUGUEL"},
                {"key": 26, "value" : "AGUA"},
                {"key": 27, "value" : "ADM. CENTRAL"},
                {"key": 28, "value" : "TELEFONIA"},
                {"key": 29, "value" : "ITERO"},
            ];
            $scope.receitas_valor = 0;
            $scope.custos_valor = 0;
            $scope.controles.filtro = "";

            $scope.excluir = function (selecionado) {
                $scope.objeto = selecionado;
                swal({
                        title: "Tem certeza?",
                        text: "Deseja realmente apagar este item?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                        buttons: {
                            confirm: {
                                text: 'Sim'
                            },
                            cancel: 'Não'
                        },
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            efetivarExclusao();
                        } else {
                            configurarFormulario();
                        }
                    });
            }

            var efetivarExclusao = function () {
                EntradaSaidaService.delete($scope.objeto.id).success((response) => {
                    buscarEntradasESaidas();
                })
                .error((response) => {
                    console.info(response);
                })
            }

            var tratarTipoDeUsuario = function(){
                return $q(function(resolve, reject) {
                    var tipo = localStorage.getItem('ngStorage-tipo')
                    
                    if(Utils.isEmpytNullOrUndefined(tipo)){
                        Utils.mensagemDeErro("Erro ao tratar tipo de usuário.");
                        window.location = "index.html";
                        reject();
                    }else{
                        tipo = tipo.replace(/"/g, '');

                        if(tipo !== "administrador"){
                            Utils.mensagemDeErro("Erro ao acessar este conteúdo.");
                            window.location = "index.html";
                            reject();
                        }else{
                            resolve();
                        }
                    }
                });
            }

            $scope.prepararAbas = function(){
                $('.nav-tabs a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');

                    $scope.controles.mes = $(this)[0].attributes["data-mes"].value;
                    buscarEntradasESaidas()

                })
            }

            $scope.trocarDeClinica = function(){
                $scope.controles.clinicaSelecionada = false;
                $scope.controles.mostrarClinicas = true;
            }

            var verificarSeTemClinicaSelecionada = function(){
                return $q(function(resolve, reject) {
                    $scope.controles.clinicaSelecionada = JSON.parse(localStorage.getItem('ngStorage-clinica'))
                    
                    if(!$scope.controles.clinicaSelecionada){
                        $scope.controles.mostrarClinicas = true;
                        reject();
                    }else{
                        $scope.imagem_clinica = $scope.barramento + "/upload/" + $scope.controles.clinicaSelecionada.logo;
                        $scope.controles.mostrarClinicas = false;
                        $("html").animate({
                            scrollTop: 0
                        }, 500);
                        resolve();
                    }

                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            var buscarDadosIniciais = function(){
                //buscar ano e mes atual
                $scope.controles.anoHoje = parseInt(Utils.getDateArray(new Date())[2]);
                $scope.controles.mesHoje = parseInt(Utils.getDateArray(new Date())[1]);

                $scope.controles.ano = $scope.controles.anoHoje;
                $scope.controles.mes = $scope.controles.mesHoje;

                return $q(function(resolve, reject) {
                    $scope.barramento = GLOBAL.barramento; 
                    ProfissionalService.getBySituacao('ativo')
                    .success((response) => {
                        $scope.profissionais = response.profissional;

                        $scope.profissionais.forEach(element => {
                            $scope.receitas.push({"key": element.id, "value" : element.apelido});
                        });

                        resolve();
                    }).error((response) => reject());
                });
            }

            $scope.abrirModal = function(){
                configurarFormulario();
                $('#modal-novo-registro').modal('show');
            }

            $scope.abrirModalAcertos = function (item) {
                $scope.objetos.procedimentos = [];
                let formasDePagamento = Dados.formasDePagamento();
                let forma = formasDePagamento[item.forma - 1].nome;
                let hoje = new Date();
                $scope.controles.itemParticular = item;
                $scope.controles.itemParticular.dentistaOrigem = $scope.buscarReceitaByKey(item.centro_receita);

                $scope.controles.itemParticular.valorRestanteAcertos = $scope.controles.itemParticular.valor;
        
                if(item.chave){
                    document.getElementById('acertarModal').classList.add('modal-lg');
                    ApoioService.buscarProcedimentosParticularesPorPlanejamentoFinanceiroID(item.planejamento_id)
                    .success(function(response){
                        response.forEach(function(procedimento){
                            procedimento.dentistaExecutorID = procedimento.dentistaExecutorID.toString();
                            procedimento.AcertoMes = hoje.getMonth()+2;
                            procedimento.AcertoAno = hoje.getFullYear();
                            procedimento.parcela_numero = item.parcela_numero+1;
                            procedimento.forma = forma;
                            procedimento.entradaSaidaID = item.id;
                        })
                        
                        $scope.objetos.procedimentos = response;
                        abrirModalAcertosFase2();
                    })
                    .error(function(response){
                        Utils.mensagemDeErro("Erro ao buscar dados.");
                    });
                }else{
                    document.getElementById('acertarModal').classList.remove('modal-lg');
                    $scope.controles.itemParticular.dataAcerto = hoje.getFullYear() + '-' + (hoje.getMonth()+2) + '-' + '1';
                    $scope.controles.itemParticular.dentistaExecutorID = item.centro_receita;
                    $scope.controles.itemParticular.entradaSaidaID = item.id;
                    $scope.controles.itemParticular.tipo = 'Particular'
                    $scope.controles.itemParticular.formaPagamento = forma;
                    $scope.controles.itemParticular.planejamento_id = 'Entrada Manual';
                    abrirModalAcertosFase2();
                }
            
                    
            }

            $scope.abrirModalAcertosDetalhes = function (item) {
                AcertosService.buscarDetalhesAcertosParticulares(item.id).success(function(response){
                    response.forEach(function(procedimento){
                        procedimento.profissionalID = procedimento.profissionalID.toString();
                        procedimento.valorProcedimento = parseFloat(procedimento.valorProcedimento);
                    })
                    $scope.controles.financeiroSelecionado = item;
                    $scope.controles.financeiroSelecionado.detalhesAcertoSelecionado = response;
                    
                    $scope.controles.financeiroSelecionado.dentistaOrigem = $scope.buscarReceitaByKey(item.centro_receita);

                    $('#modal-acertos-detalhes').modal('show');
                }).error(function(response){
                    Utils.mensagemDeErro("Erro ao buscar dados.");
                });
            }


            $scope.salvarAcertos = function (){
                if($scope.objetos.procedimentos.length > 0){
                    $scope.objetos.procedimentos.forEach(function(proc){
                        if(proc.valorAcertos != null){
                            proc.dataAcerto = proc.AcertoAno + '-' + proc.AcertoMes + '-' + '1';
                            proc.tipo = 'Particular';
                            if(proc.forma == 'Crédito parcelado'){
                                proc.forma = proc.forma+'(Parcela Nº: ' + proc.parcela_numero+')';
                            }
                            AcertosService.inserirAcerto(proc,$scope.controles.clinicaSelecionada.id)
                            .success(function(response){
                                Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
                                buscarEntradasESaidas();
                                $('#modal-acertos').modal('hide');
                            })
                            .error(function(response){
                                Utils.mensagemDeErro("Erro ao atualizar dados.");
                            });
                        }
                        
                    })
                }else{
                    AcertosService.inserirAcerto($scope.controles.itemParticular,$scope.controles.clinicaSelecionada.id)
                    .success(function(response){
                        Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
                        buscarEntradasESaidas();
                        $('#modal-acertos').modal('hide');
                    })
                    .error(function(response){
                        Utils.mensagemDeErro("Erro ao atualizar dados.");
                    });
                }
            }

            var abrirModalAcertosFase2 = function(){            
                $('#modal-acertos').modal('show');

            }

            $scope.editar = function(item){
                configurarFormulario(item);
                $('#modal-novo-registro').modal('show');
            }

            $scope.salvar = function(){
                sanitizarRequisicao();

                if($scope.objeto.id){
                    atualizarRegistro();
                }else{
                    criarRegistro();
                }

            }
            
            var criarRegistro = function(){
                EntradaSaidaService.create($scope.objeto).success((response) => {
                    $('#modal-novo-registro').modal('hide');
                    buscarEntradasESaidas();
                    configurarFormulario();
                    mensagemSalvar();
                })
                .error((response) => {
                    console.info(response);
                })
            }

            var atualizarRegistro = function(){
                $scope.objeto.updated_at = Utils.generateDateToDataBase();
                
                EntradaSaidaService.update($scope.objeto).success((response) => {
                    $('#modal-novo-registro').modal('hide');
                    buscarEntradasESaidas();
                    configurarFormulario();
                    mensagemAtualizar();
                })
                .error((response) => {
                    console.info(response);
                })
            }

            var sanitizarRequisicao = function(){
                $scope.objeto.clinicaID = $scope.controles.clinicaSelecionada.id;

                if($scope.objeto.tipo == 'receita'){
                    $scope.objeto.centro_receita = $scope.objeto.centro;
                }else{
                    $scope.objeto.centro_custo = $scope.objeto.centro;
                }

                $scope.objeto.data = Utils.converterDataUSAtoBR($scope.objeto.data);

                $scope.objeto.valor = Utils.moneyBRtoUSA($scope.objeto.valor);
            }

            var mensagemSalvar = function(){
                swal({
                    title: "Muito bem!",
                    text: "Registro criado com sucesso",
                    icon: "success",
                    timer: 3000
                });
            }

            var mensagemAtualizar = function(){
                swal({
                    title: "Muito bem!",
                    text: "Registro atualizado com sucesso",
                    icon: "success",
                    timer: 3000
                });
            }

            $scope.trocarAno = function(hoje){
                if(hoje){
                    ano = parseInt(Utils.getDateArray(new Date())[2]);
                    mes = parseInt(Utils.getDateArray(new Date())[1]);

                    $scope.controles.ano = ano;
                    $scope.controles.mes = mes;
                    
                    selecionarMesAtual();
                }

                buscarEntradasESaidas();
            }

            var buscarEntradasESaidas = function(){
                $scope.custos_valor = 0;
                $scope.receitas_valor = 0;

                return $q(function(resolve, reject) {
                    var clinicaID = $scope.controles.clinicaSelecionada.id;
                    EntradaSaidaService.buscarEntradasSaidasByIdAndData(clinicaID, $scope.controles.ano, $scope.controles.mes).success((response) => {
                        $scope.objetos = response;
                        $scope.recalcularValores();
                        // buscarRecebimentosPorPeriodoEClinica()
                        // .then(result => misturarEntradasManuaiseRecebimentos())
                        // .then(finalResult => {
                        //     resolve();
                        // });

                        
                        
                    })
                    .error((response) => {
                        console.info(response);
                        reject();
                    });
                });
            }

            // var misturarEntradasManuaiseRecebimentos = function(){
            //     return $q(function(resolve, reject) {
            //         resolve();
            //     });
            // }

            //TODO: ver se ainda esta usando este metodo, porque senão, removemos do backend
            // var buscarRecebimentosPorPeriodoEClinica = function(){
            //     return $q(function(resolve, reject) {
            //         var clinicaID = $scope.controles.clinicaSelecionada.id;
            //         EntradaSaidaService.buscarRecebimentosPorPeriodoEClinica($scope.controles.ano, $scope.controles.mes, clinicaID)
            //         .success((response) => {
            //             $scope.recebimentosParticulares = response;
            //             $scope.objetos = $scope.objetos.concat($scope.recebimentosParticulares);
            //             resolve();
            //         })
            //         .error((response) => {
            //             console.info(response);
            //             reject();
            //         });
            //     });
            // }

            var calularReceitas = function(){
                if($scope.controles.filteredItems){
                    let somenteReceitas = $scope.controles.filteredItems.filter((element) => {
                        return element.centro_receita != '';
                    });

                    let receitas_valor = somenteReceitas.reduce(function (previousValue, currentValue) {
                        return parseFloat(previousValue) + parseFloat(currentValue.valor);
                    }, 0);

                    $scope.receitas_valor = receitas_valor;

                    $(".loading-wrapper").hide();

                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }

            var calularCustos = function(){
                if($scope.controles.filteredItems){
                    let somenteCustos = $scope.controles.filteredItems.filter((element) => {
                        return element.centro_custo != '' && element.centro_custo != undefined;
                    });

                    let custos_valor = somenteCustos.reduce(function (previousValue, currentValue) {
                        return parseFloat(previousValue) + parseFloat(currentValue.valor);
                    }, 0);

                    $scope.custos_valor = custos_valor;

                    $(".loading-wrapper").hide();

                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }

            $scope.buscarReceitaByKey = function(key){
                var resposta = $scope.receitas.filter(obj => {
                    // console.info(parseInt(key));
                    // console.info(obj);
                    return parseInt(obj.key) === parseInt(key)
                })

                if(resposta && resposta[0]){
                    // console.info(resposta[0].value);
                    return resposta[0].value;
                }else{
                    "-";
                }
            }

            $scope.buscarFormaPagamentoById = function(objeto){
                objeto.forma = objeto.formaESmanual == '' || objeto.formaESmanual == null ? objeto.forma : objeto.formaESmanual;
                var resposta = $scope.formasDePagamento.filter(obj => {
                    return parseInt(obj.id) === parseInt(objeto.forma)
                })

                if(resposta && resposta[0]){
                    // console.info(resposta[0].value);
                    return resposta[0].nome;
                }else{
                    "-";
                }
            }

            $scope.buscarReceitaByKeyV2 = function(key){
                var resposta = $scope.receitas.filter(obj => {
                    // console.info(parseInt(key));
                    // console.info(obj);
                    return parseInt(obj.key) === parseInt(key)
                })

                if(resposta && resposta[0]){
                    // console.info(resposta[0].value);
                    return resposta[0];
                }else{
                    "-";
                }
            }

            $scope.buscarReceitaByValue = function(value){
                var resposta = $scope.receitas.filter(obj => {
                    return obj.value === value
                })

                if(resposta && resposta[0]){
                    return resposta[0];
                }else{
                    "xxx";
                }
            }

            $scope.buscarCustoByKey = function(key){
                var resposta = $scope.custos.filter(obj => {
                    // console.info(parseInt(key));
                    // console.info(obj);
                    return parseInt(obj.key) === parseInt(key)
                })
                if(resposta && resposta[0]){
                    return resposta[0].value;
                }else{
                    "-";
                }
            }

            var configurarFormulario = function(item){
                return $q(function(resolve, reject){

                    $('#datepicker').datepicker({
                        enableOnReadonly: true,
                        autoclose: true,
                        format: "dd-mm-yyyy", //formato de saida(para o rest)
                        language: "pt-BR",
                        startView: 1,
                        todayHighlight: true,
                        todayBtn: "linked",
                    });

                    if(item){
                        //preencher com os dados do item...
                        // $scope.objeto = item;
                        $scope.objeto = { ...item};
                        $scope.objeto.data = new Date($scope.objeto.data + " 00:00:00");

                        //tipo
                        if($scope.objeto.centro_receita == ""){
                            $scope.objeto.tipo = "custo";
                            $scope.objeto.centro = $scope.objeto.centro_custo;
                        }else{
                            $scope.objeto.tipo = "receita";
                            // $scope.objeto.centroSelecionado = $scope.buscarReceitaByKeyV2($scope.objeto.centro_receita);
                            // $scope.objeto.centro = parseInt($scope.objeto.centro_receita);
                            $scope.objeto.centro = $scope.objeto.centro_receita;
                        }

                        //valor
                        $scope.objeto.valor = $scope.objeto.valor.replaceAll('.', ',');

                    }else{
                        $scope.objeto = new Object();
                        $scope.objeto.origem = "";
                        $scope.objeto.centro_receita = "";
                        $scope.objeto.valor = 0;
                        
                        $scope.objeto.data = new Date();
                    }
                    
                    {
                        //tem que fazer para qualquer cenário
                        //reais
                        Inputmask().mask($("input.reais"));
                        
                        //data
                        $scope.objeto.data = Utils.getDateStringFromDate($scope.objeto.data);
                        $scope.objeto.data = Utils.converterDataUSAtoBR($scope.objeto.data);
                       
                        // $('#datepicker-data').datepicker('setDate', $scope.objeto.data);
                    }

                    resolve('formulario configurado!');
                });
            }

            var selecionarMesAtual = function(){
                var mesAtivo = document.getElementsByClassName("nav-link active");
                Array.from(mesAtivo).forEach(function(mes){
                    mes.classList.remove('active');
                })
                document.getElementById('tab'+$scope.controles.mes).classList.add('active');
            }

            $scope.diferenteDeHoje = function(){
                if( $scope.controles.ano!=$scope.controles.anoHoje || $scope.controles.mes!=$scope.controles.mesHoje ){
                    return true;
                }else{
                    return false;
                }
            }

            $scope.somarValorAcertos = function() {
                let valorTotalAcertos = 0;
                document.getElementsByName('valorAcertos').forEach(function(element){
                    if(element.value != ''){
                        valorTotalAcertos += parseFloat(element.value);
                    }
                })

                
                $scope.controles.itemParticular.valorRestanteAcertos = ($scope.controles.itemParticular.valor - valorTotalAcertos).toFixed(2);
                if(parseFloat($scope.controles.itemParticular.valor) - valorTotalAcertos == 0){
                    $scope.controles.confirmarAcertos = true;
                }else{
                    $scope.controles.confirmarAcertos = false;
                }


            }

            $scope.recalcularValores = function () {
                $(".loading-wrapper").show();
                window.clearTimeout(this.timeout);
                this.timeout = window.setTimeout(() => calularCustos(), 1000);
                this.timeout = window.setTimeout(() => calularReceitas(), 1000);
            }

            $scope.filtrador = function(item){
                //tratar os itens manuais
                if( $scope.controles.filtro == '' ) { return item; }
                if( item.origem.toLowerCase().includes( $scope.controles.filtro.toLowerCase() ) ) { return item; }
                if( item.data.includes($scope.controles.filtro) ) { return item; }
                if( item.valor.includes($scope.controles.filtro) ) { return item; }
                
                var receitaDaTabela = $scope.buscarReceitaByKey( item.centro_receita );
                if( receitaDaTabela && receitaDaTabela.toLowerCase().includes($scope.controles.filtro.toLowerCase()) ){
                    return item;
                }

                var custoDaTabela = $scope.buscarCustoByKey( item.centro_custo );
                if( custoDaTabela && custoDaTabela.toLowerCase().includes($scope.controles.filtro.toLowerCase()) ){
                    return item;
                }

            }

            $scope.init = function () {
                tratarTipoDeUsuario()
                .then(result => verificarSeTemClinicaSelecionada())
                .then(result => buscarDadosIniciais())
                .then(result => selecionarMesAtual())
                .then(result => configurarFormulario())
                .then(finalResult => {
                    buscarEntradasESaidas();
                });
            };

            $scope.init(); 
        }
    ]);