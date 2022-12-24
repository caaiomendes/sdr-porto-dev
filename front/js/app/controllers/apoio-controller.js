angular.module('principal')
.controller('ApoioController', ['$scope', 'EntradaSaidaService', 'ApoioService','AcertosService', 'PlanejamentoService', 'Utils', 'Dados', '$compile',
	function ($scope, EntradaSaidaService, ApoioService,AcertosService, PlanejamentoService, Utils, Dados, $compile) {

    $scope.itensParticular = [];
    $scope.itensConvenio = [];
    $scope.controles = {
        mostrarFormulario : false,
        mostrarTabelas : false,
        ano: null,
        mes: null,
        clinicaID: null,
        ehEditavel: true,
        buscado: false,
        parcelas: [],
        userAdmin : false
    };
    $scope.anoMax = 2030;
    $scope.pesquisaParticular = '';
    $scope.pesquisaConvenio = '';

    $scope.buscar = function(){
        buscarProcedimentosParticularesParaApoio();
        buscarProcedimentosConvenioParaApoio();
    }

    var buscarProcedimentosParticularesParaApoio = function(){
        $scope.controles.mesWithZero = Utils.getNumberWithZero($scope.controles.mes);

        
        ApoioService.buscarProcedimentosParticularesParaApoio($scope.controles.clinicaID, $scope.controles.ano, $scope.controles.mesWithZero, $scope.controles.dentistaID)
        .success(function(response){
            $scope.controles.mostrarTabelas = true;
            $scope.itensParticular = response;
            $('[data-toggle="tooltip"]').tooltip();
            $scope.controles.buscado = true;
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao buscar dados.");
            $scope.controles.buscado = true;
        });
    }

    var buscarProcedimentosConvenioParaApoio = function(){
        ApoioService.buscarProcedimentosConvenioParaApoio($scope.controles.clinicaID, $scope.controles.ano, $scope.controles.mes, $scope.controles.dentistaID)
        .success(function(response){
            $scope.controles.mostrarTabelas = true;
            response.forEach(function(item){
                item.statusAcerto = item.statusAcerto == null ? 'Aberto' : item.statusAcerto;
            })
            $scope.itensConvenio = response;
            $('[data-toggle="tooltip"]').tooltip();
            $scope.controles.buscado = true;
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao buscar dados.");
            $scope.controles.buscado = true;
        });
    }

    $scope.mostrarFormulario = function(){
        $scope.controles.mostrarFormulario = true;
        // $scope.buscar();
    }

    $scope.abrirModalGuia = function(item){

        $scope.odontogramaProcedimentoIDSelecionado = item.odontogramaProcedimentoID;

        swal("Preencha com o número da GUIA:", {
            content: {
                element: "input",
                attributes: {
                  value: item.guia,
                },
              },
        }).then((valor) => {
            if(valor){
                salvarGuia(valor);
                item.guia = valor;
            }
        });
    }

    var salvarGuia = function(novoValor){
        var objeto = {
            odontogramaProcedimentoID: $scope.odontogramaProcedimentoIDSelecionado,
            novoValor: novoValor
        }

        ApoioService.atualizarGuiaDoApoio(objeto)
        .success(function(response){
            Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao atualizar dados.");
        });
    }

    $scope.abrirModalProcedimentos = function(item){
        const template = (`<h5>Procedimentos</h5> 
                    <ul class="lista">
                        <li class="item">Consulta odontológica</li>
                        <li class="item">Alveoloplastia</li>
                        <li class="item">Amputação radicular com obturação retrógrada</li>
                    </ul>
                    <h5>Parcelas</h5> 
                    <ol class="lista">
                        <li class="item">R$ 123,45 - 11/12/2021 - Pago</li>
                        <li class="item">R$ 123,45 - 11/12/2021 - Aberto</li>
                        <li class="item">R$ 123,45 - 11/12/2021 - Aberto</li>
                    </ol>
                    `);
        swal({
            className: "apoio-modal",
            content: {
                element: 'div',
                attributes: {
                    innerHTML: `${template}`,
                },
            }
        });
    }

    $scope.abrirModalDetalhesParticular = function(item){
        $scope.controles.itemParticular = item;

        ApoioService.buscarProcedimentosParticularesPorPlanejamentoFinanceiroID(item.idPlanejamento)
        .success(function(response){
            abrirModalDetalhesParticularFase2(item, response);
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao buscar dados.");
        });

        
    }

    var abrirModalDetalhesParticularFase2 = function(item, procedimentos){
        $scope.controles.selecionarTodos = false;

        var procedimentosHTML = ''; 
        var temNotaFiscal;
        var temRecibo;
        var dadosFiscais = ''
        procedimentos.forEach(function(procedimento){
            var nomeDentistaLimit = procedimento.dentistaExecutor.length > 15 ? procedimento.dentistaExecutor.substring(0,15) + '...' : procedimento.dentistaExecutor;
            procedimentosHTML += '<tr><td>'+ procedimento.nomeProcedimento + '</td><td>'+ procedimento.dente + '</td><td data-toggle="tooltip" title="'+ procedimento.dentistaExecutor + '">' + nomeDentistaLimit + '</td><td>'+ procedimento.valorParticularBR + '</td></tr>';
        })
        temNotaFiscal = procedimentos.find(x => x.notaFiscal === "true");
        temRecibo = procedimentos.find(x => x.recibo === "true");
        PlanejamentoService.buscarParcelasPorPlanejamentoID(item.idPlanejamento)
        .success(response => {
            var parcelas = response;
            $scope.controles.parcelas = parcelas;
            parcelasHTML = '';
            var formasDePagamento = Dados.formasDePagamento();
            let valorRecebidoNoMes = 0;

            parcelas.forEach(function(parcela, i) { 
                var nome = parcela.forma ? formasDePagamento[parcela.forma - 1].nome : '';
                var valor = parcela.valor ? Utils.formatMoney(parseFloat(parcela.valor)) : '';
                var status = parcela.status ? parcela.status : '';
                var pagamento = parcela.pagamento ? Utils.converterDataUSAtoBR_v2(parcela.pagamento) : '-';
                var contador = (i+1) ? (i+1) : '';
                var mostrarBotaoAprovar = parcela.status != 'recebido' ? false : true;

                if(status == 'recebido' && (parcela.pagamento && parcela.pagamento.includes($scope.controles.ano+"-"+$scope.controles.mesWithZero)>0)){
                    valorRecebidoNoMes += parseFloat(parcela.valor);
                }

                parcelasHTML += '<tr>'+
                    '<td>' + contador + '</td>'+
                    '<td>'+ nome + '</td>'+
                    '<td>'+ valor + '</td>'+
                    '<td>'+ status + '</td>'+
                    '<td>'+ pagamento + '</td>';
                if($scope.controles.userAdmin){
                    parcelasHTML += '<td class="botoes-aprovacao" >'+
                    '<a href="javascript:void(0)" '+
                        'ng-if="!'+parcela.chave+' && '+ mostrarBotaoAprovar+'" '+
                        'class="link btn-sm btn-success" '+
                        'ng-click="aprovar(\''+parcela.vencimento+'\',\''+item.nomePaciente+'\','+item.dentistaExecutorID+','+parcela.valor+','+parcela.id+','+parcela.forma+')">Aprovar</a>'+
                    '<a href="javascript:void(0)" '+
                        'ng-if="'+parcela.chave+'" '+
                        'class="link btn-sm btn-info" '+
                        '>Aprovado</a>'+  
                    '<a href="javascript:void(0)" '+
                        'ng-if="!'+parcela.chave+' && !'+ mostrarBotaoAprovar+'" '+
                        'class="link btn-sm btn-secondary" '+
                        '>-</a>'+                                                        
                    '<input type="checkbox" '+   
                        'class="aprovacao-check" '+   
                        'name="aprovacao" '+   
                        'data-id="' + parcela.id + '" '+   
                        'id="aprovacao_'+parcela.id+ '" '+   
                        'ng-if="!'+parcela.chave+' && '+ mostrarBotaoAprovar+'" '+
                        'ng-model="parcela.Selected"'+   
                        'ng-change="change(\''+parcela.id+ '\', parcela.Selected)">'+
                '</td></tr>';
                }
                    

                    if(!parcela.chave && mostrarBotaoAprovar){
                        $scope.controles.contadorDeBotoesAprovar++;
                    }

            });


            if(temNotaFiscal){
                dadosFiscais = `
                <div class="dados-fiscais">
                    <h4 class="subtitulo">Dados fiscais</h4>
                    <h6>Nota fiscal solicitada: SIM</h6>
                </div>`;
            }

            if(temRecibo){
                dadosFiscais = `
                <div class="dados-fiscais">
                    <h4 class="subtitulo">Dados fiscais</h4>
                    <h6>Recibo solicitado: SIM</h6>
                </div>`;
            }

            template = 
            (`
                <div class="modal-particular">
                    <h5>Detalhes</h5> 
                    <h4 class="subtitulo">Gerais</h4>
                    <ul class="lista">
                        <li class="item">Data: `+item.dataRecebimento+`</li>
                        <li class="item">Paciente: `+item.nomePaciente+`</li>
                        <li class="item">Dentista: `+item.apelidoDentistaAgendador+`</li>
                        <li class="item">Planejamento: `+item.idPlanejamento+`</li>
                        <li class="item">Valor Recebido no Mês: R$ `+valorRecebidoNoMes+`</li>
                        <li class="item">Observações: `+item.observacoes+`</li>
                    </ul>
                    <h4 class="subtitulo">Procedimentos</h4>
                    <table class="table table-striped table-hover">
                        <th>Procedimento</th>
                        <th>Dente</th>
                        <th>Dentista Executor</th>
                        <th>Valor</th>
                        ` + procedimentosHTML + `
                    </table>
                    <h4 class="subtitulo">Parcelas</h4>
                    <table class="table table-striped table-hover">
                        <tbody>
                        <th>N•</th>
                        <th>Forma</th>
                        <th>Valor</th>
                        <th>Situação</th>
                        <th>Data</th>
                        <th ng-if="`+($scope.controles.userAdmin)+`">
                            Aprovação
                            <input type="checkbox" ng-if="`+($scope.controles.contadorDeBotoesAprovar>0)+`" ng-click="checkAll()" ng-model="controles.selecionarTodos">
                        </th>
                        ` + parcelasHTML + `
                        </tbody>
                        <tfoot>
                        <tr>
                            <th></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td ng-if="`+($scope.controles.userAdmin)+`"></td>
                            <th>
                            
                            </th>
                        </tr>
                        </tfoot>
                    </table>
                    <a href="javascript:void(0)" class="link btn-sm btn-success aprovar-selecionados" ng-click="aprovarSelecionados()">Aprovar selecionados</a>
                    `+ dadosFiscais +`
                </div>
            `);

            swal({
                className: "apoio-modal",
                content: {
                    element: 'div',
                    attributes: {
                        innerHTML: `${template}`,
                    },
                }
            }).then((valor) => {
            });
            
            compilar();
            $('.aprovar-selecionados').hide();

            // $scope.$apply();
            // document.getElementById('grupo-particular').innerHTML = "<input type='text' ng-model='controles.ano'/>";
            // var placeNewElement = angular.element(document.getElementById('grupo-particular'));
    	    // $compile(placeNewElement.contents())($scope);
        })
        .error(response => {
            Utils.mensagemDeErro("Erro ao buscar dados.");
        });
    }

    var compilar = function(){
        // document.getElementById('grupo-particular').innerHTML = "<input type='text' ng-model='controles.ano' ng-click='aprovarSelecionados()'/>";
        // var placeNewElement = angular.element(document.getElementById('aprovarSelecionados'));
    	// $compile(placeNewElement.html())($scope);

        $compile($(".modal-particular").contents())($scope);
    }

    $scope.InserirAcerto = function(item){
        var dataAcerto = new Date();
        item.dataAcerto = dataAcerto.getFullYear() + '-' + (dataAcerto.getMonth()+2) + '-' + dataAcerto.getDate();
        item.tipo = 'Convenio'
        AcertosService.inserirAcerto(item,$scope.controles.clinicaID)
        .success(function(response){
            Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao atualizar dados.");
        });

    }

    $scope.abrirModalDetalhesConvenio = function(item){
        template = 
        (
            `<h5>Detalhes</h5> 
            <ul class="lista">
                <li class="item">Data: `+item.data+`</li>
                <li class="item">Paciente: `+item.paciente+`</li>
                <li class="item">Dentista: `+item.dentista+`</li>
                <li class="item">Procedimento: `+item.procedimento+`</li>
                <li class="item">Valor: R$ `+item.valor+`</li>
                <li class="item">Guia: `+item.guia+`</li>
                <li class="item">Observações: `+item.observacoes+`</li>
            </ul>`
        );

        swal({
            className: "apoio-modal",
            content: {
                element: 'div',
                attributes: {
                    innerHTML: `${template}`,
                },
            }
        });
    }

    $scope.abrirModalObservacoesParticular = function(item){

        $scope.planejamentoFinanceiroIDSelecionado = item.idPlanejamento;
        
  
        swal("Preencha com as observações:", {
            content: {
                element: "input",
                attributes: {
                  value: item.observacoes,
                },
              },
        }).then((valor) => {
            if(valor){
                salvarObservacoesParticular(valor);
                item.observacoes = valor;
            }
        });
        
    }

    $scope.abrirModalObservacoes = function(item){
        // var textarea = document.createElement('textarea');
        // textarea.rows = 6;
        // textarea.className = 'swal-content__textarea';
        
        // Set swal return value every time an onkeyup event is fired in this textarea
        // textarea.onkeyup = function () {
        //     swal.setActionValue({
        //         confirm: this.value
        //     });
        // };

        $scope.odontogramaProcedimentoIDSelecionado = item.odontogramaProcedimentoID;
        
  
        swal("Preencha com as observações:", {
            content: {
                element: "input",
                attributes: {
                  value: item.observacoes,
                },
              },
        }).then((valor) => {
            if(valor){
                salvarObservacoes(valor);
                item.observacoes = valor;
            }
        });
        
    }

    var salvarObservacoes = function(novoValor){
        
        var objeto = {
            odontogramaProcedimentoID: $scope.odontogramaProcedimentoIDSelecionado,
            novoValor: novoValor
        }

        ApoioService.atualizarObservacoesDoApoio(objeto)
        .success(function(response){
            Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao atualizar dados.");
        });
    }

    var salvarObservacoesParticular = function(novoValor){
        
        var objeto = {
            planejamentoFinanceiroID: $scope.planejamentoFinanceiroIDSelecionado,
            novoValor: novoValor
        }

        ApoioService.atualizarObservacoesDoApoioParticular(objeto)
        .success(function(response){
            Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao atualizar dados.");
        });
    }

    var popularDadosIniciais = function(){
        $scope.controles.buscado = false;
        $scope.controles.mostrarFormulario = false;
        $scope.controles.mostrarTabelas = false;
        // $scope.controles.ano = parseInt(Utils.getDateArray(new Date())[2]);
        // $scope.controles.mes = parseInt(Utils.getDateArray(new Date())[1]);

        $scope.controles.ano = parseInt(Utils.getDateArray(new Date())[2]);
        $scope.controles.mes = parseInt(Utils.getDateArray(new Date())[1]);
        
        if($scope.$storage.clinica){
            $scope.controles.clinicaID = $scope.$storage.clinica.id;
        }

        $scope.controles.dentistaID = null;
        $scope.controles.tipo = null;

        if($scope.$storage.tipo){
            $scope.controles.tipo = $scope.$storage.tipo;
        }

        if($scope.controles.tipo == 'dentista' && $scope.$storage.dentistaID){
            $scope.controles.ehEditavel = false;
            $scope.controles.dentistaID = $scope.$storage.dentistaID;
        }

        $scope.buscar();
    }

    $scope.selecionarClinica = function(){
        localStorage.setItem('ngStorage-clinica', null);
        $scope.mostrarClinicas = true;
    }

    $scope.getTotalConvenio = function(){
        var total = 0;
        angular.forEach($scope.itensConvenio, function (detail) {
            total += parseFloat(detail.valor);
        })
        return Utils.formatMoney(total);
    }

    var verificarSeTemClinicaSelecionada = function(){
        let clinica = localStorage.getItem('clinicaId');
        if(!clinica){
            $scope.mostrarClinicas = true;
        }else{
            $scope.clinicaSelecionada = JSON.parse(localStorage.getItem('ngStorage-clinica'));
            $scope.imagem_clinica = $scope.barramento + "/upload/" + $scope.clinicaSelecionada.logo;
            $scope.mostrarClinicas = false;
        }
    }

    $scope.aprovar = function(dataRecebimentoOriginal, nomePaciente, dentistaExecutorID, valorRecebido, chave, forma){
        
        var objeto = {
            "data" : dataRecebimentoOriginal,
            "origem" : nomePaciente,
            "centro_receita" : dentistaExecutorID, //(aqui só tem o ID, preciso do nome),
            "centro_custo" : "",
            "valor" : valorRecebido,
            "chave" : chave,
            "clinicaID" : $scope.clinicaSelecionada.id,
            "formaESmanual" : forma,
            "created_at" : Utils.generateDateToDataBase()
        };

        EntradaSaidaService.create(objeto)
        .success(function(response){
            swal('Aprovação feita com sucesso!');
        })
        .error(function(response){
            console.info(response);
            swal('Erro ao aprovar!');
        })
    }

    $scope.aprovarSelecionados = function(){
        $(".aprovacao-check:checked").each(function(index){
            var key = $( this ).attr('data-id');
            var parcela = buscarParcelaByKey(key);

            var item = $scope.controles.itemParticular;

            $scope.aprovar(parcela.vencimento, item.nomePaciente, item.dentistaExecutorID, parcela.valor, parcela.id);
        });
    }

    $scope.checkAll = function () {
        // $scope.controles.listaFiltradaParticular = $scope.$eval("(itensParticular | filter: pesquisaParticular)");

        console.info($scope.controles.selecionarTodos);
        

        angular.forEach($scope.controles.parcelas, function (item) {

            if(item.status == 'recebido' && !item.chave){
                item.Selected = $scope.controles.selecionarTodos;

                // console.info(item);
                document.getElementById('aprovacao_'+item.id).checked = $scope.controles.selecionarTodos;

                $scope.change(item.id, item.Selected);
            }
        });

        // if($scope.controles.selecionarTodos){
        //     $('.aprovar-selecionados').show();
        // }
        contarSelecionados();
    };  

    $scope.change = function(parcelaID, active){
        parcelaID = parseInt(parcelaID);
        
        if (!active){
            $scope.controles.selecionarTodos = false;
        }

        contarSelecionados();

    };

    var buscarParcelaByKey = function(key){
        var resposta = $scope.controles.parcelas.filter(obj => {
            return parseInt(obj.id) === parseInt(key)
        })

        if(resposta && resposta[0]){
            return resposta[0];
        }else{
            "-";
        }
    }

    var contarSelecionados = function(){
        var cont = 0;

        $(".aprovacao-check:checked").each(function(index){
            cont++;
        });

        if(cont>0){
            $('.aprovar-selecionados').show();

            if(cont == $scope.controles.contadorDeBotoesAprovar){
                $scope.controles.selecionarTodos = true;
            }
        }else{
            $('.aprovar-selecionados').hide();
        }
    }

    tratarTipoDeUsuario = function(){
        var tipo = localStorage.getItem('ngStorage-tipo');
        if(tipo == '"administrador"'){
            $scope.controles.userAdmin = true;
        }
    }

    $scope.init = function() {
        
        tratarTipoDeUsuario();
        popularDadosIniciais();
        verificarSeTemClinicaSelecionada();

        
        
    };

	$scope.init();
}]);