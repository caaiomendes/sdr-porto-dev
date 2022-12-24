angular.module('principal')
    .controller('AcertosController', ['$scope', '$localStorage', 'ProfissionalService', '$q', '$filter', 'Utils', 'AcertosService','Dados', 'PlanejamentoService',
        function ($scope, $localStorage,ProfissionalService, $q, $filter, Utils, AcertosService,Dados, PlanejamentoService) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.barramento = GLOBAL.barramento;
            $scope.controles = {
                mostrarClinicas: false,
                clinicaSelecionada: null,
                ano: new Date().getFullYear(),
                mes: new Date().getMonth() + 1,
                profissionalSelecionado : false,
                userAdmin: false
            }
            $scope.objetos = [];
            $scope.objetos2 = [];

            $scope.acertos = {
                particulares : [],
                convenio : [],
                reembolsos :[],
                descontos :[]
            }

            $scope.objeto.valor = 0;

            $scope.profissionais = [];

            $scope.formasDePagamento = Dados.formasDePagamento();

            var tratarTipoDeUsuario = function(){
                return $q(function(resolve, reject) {
                    var tipo = localStorage.getItem('ngStorage-tipo')
                    if(Utils.isEmpytNullOrUndefined(tipo)){
                        Utils.mensagemDeErro("Erro ao tratar tipo de usuário.");
                        window.location = "index.html";
                        reject();
                    }else{
                        tipo = tipo.replace(/"/g, '');

                        if(tipo == "administrador")$scope.controles.userAdmin = true; else $scope.controles.profissionalSelecionado = $scope.$storage.dentistaID;
                        resolve();
                    }
                });
            }

            zerarValores = function(){
                $scope.acertos.particulares = [];
                $scope.acertos.convenio = [];
                $scope.acertos.reembolsos = [];
                $scope.acertos.descontos = [];
                $scope.acertos.ValorTotalProcParticular = 0;
                $scope.acertos.ValorTotalProcConvenio = 0;
                $scope.acertos.ValorTotalParticular = 0;
                $scope.acertos.ValorTotalConvenio = 0;
                $scope.acertos.ValorTotalGlosados = 0;
                $scope.acertos.ValorTotalProcGlosados = 0;
                $scope.acertos.reembolsos.ValorTotal = 0;
                $scope.acertos.descontos.ValorTotal = 0;
                $scope.acertos.descontos.ValorTotalDescontado = 0;
            }


            calcularValoresResumo = function(){
                $scope.acertos.valorImposto = parseFloat((6.5 / 100) * $scope.acertos.ValorTotalConvenio).toFixed(2);
                let particular = parseFloat($scope.acertos.ValorTotalParticular);
                let convenio = parseFloat($scope.acertos.ValorTotalConvenio);
                let desconto = parseFloat($scope.acertos.descontos.ValorTotalDescontado);
                let reembolso = parseFloat($scope.acertos.reembolsos.ValorTotal);
                let imposto = parseFloat($scope.acertos.valorImposto);

                $scope.acertos.ValorTotalResumo = (particular + convenio + reembolso) - (desconto+imposto);


            }

            carregarProfissionais = function(){
                if($scope.objetos.length > 0){
                    $scope.profissionais = [
                        ...new Map($scope.objetos.map((item) => [item["profissionalID"], item])).values(),
                    ];
                }else if($scope.objetos2.length > 0 ){
                    $scope.profissionais = [
                        ...new Map($scope.objetos2.map((item) => [item["profissionalID"], item])).values(),
                    ];
                }
                if(!$scope.controles.userAdmin){
                    $scope.profissionais = $scope.profissionais.filter(obj => {
                        return parseInt(obj.profissionalID) === parseInt($scope.$storage.dentistaID)
                    })
                    $scope.selecionarProfissional(null,$scope.$storage.dentistaID);
                }
            }

            $scope.selecionarProfissional = function(profissional,id){
                var profissionalID = id != null ? id : profissional.target.id ;
                var acertos = $scope.objetos.filter(obj => {
                    return parseInt(obj.profissionalID) === parseInt(profissionalID)
                })

                var reembolsos_descontos = $scope.objetos2.filter(obj => {
                    return parseInt(obj.profissionalID) === parseInt(profissionalID)
                })

                zerarValores();

                acertos.forEach(function(objeto){
                    if((objeto.visaoDentista == 1 || $scope.controles.userAdmin)){
                        objeto.visaoDentista == 1 ? objeto.visaoDentista = true : objeto.visaoDentista = false;
                        objeto.valor = parseFloat((objeto.comissao / 100) * objeto.valorProcedimento).toFixed(2);
                        if(objeto.tipo == 'Particular'){
                            $scope.acertos.ValorTotalProcParticular = parseFloat(objeto.valorProcedimento) + parseFloat($scope.acertos.ValorTotalProcParticular);
                            $scope.acertos.ValorTotalParticular = parseFloat(objeto.valor) + parseFloat($scope.acertos.ValorTotalParticular);
                            $scope.acertos.ValorTotalParticular = parseFloat($scope.acertos.ValorTotalParticular).toFixed(2);
                            $scope.acertos.ValorTotalProcParticular = parseFloat($scope.acertos.ValorTotalProcParticular).toFixed(2);
                            
                            $scope.acertos.particulares.push(objeto);
                        }else if (objeto.tipo == 'Convenio'){
                            if(objeto.status != 'Glosado'){
                                $scope.acertos.ValorTotalProcConvenio = parseFloat(objeto.valorProcedimento) + parseFloat($scope.acertos.ValorTotalProcConvenio);
                                $scope.acertos.ValorTotalProcConvenio = parseFloat($scope.acertos.ValorTotalProcConvenio).toFixed(2);
                                $scope.acertos.ValorTotalConvenio = parseFloat(objeto.valor) + parseFloat($scope.acertos.ValorTotalConvenio);
                                $scope.acertos.ValorTotalConvenio = parseFloat($scope.acertos.ValorTotalConvenio).toFixed(2);
                            }else if(objeto.status = 'Glosado'){
                                $scope.acertos.ValorTotalGlosados = parseFloat(objeto.valor) + parseFloat($scope.acertos.ValorTotalGlosados);
                                $scope.acertos.ValorTotalGlosados = parseFloat($scope.acertos.ValorTotalGlosados).toFixed(2);
                                $scope.acertos.ValorTotalProcGlosados = parseFloat(objeto.valorProcedimento) + parseFloat($scope.acertos.ValorTotalProcGlosados);
                                $scope.acertos.ValorTotalProcGlosados = parseFloat($scope.acertos.ValorTotalProcGlosados).toFixed(2);
                            }
                            $scope.acertos.convenio.push(objeto);
                        }
                    }
                })

                reembolsos_descontos.forEach(function(objeto){
                    if((objeto.visaoDentista == 1 || $scope.controles.userAdmin)){
                        objeto.visaoDentista == 1 ? objeto.visaoDentista = true : objeto.visaoDentista = false;
                        objeto.valorDescontado = parseFloat((objeto.comissao / 100) * objeto.valor).toFixed(2);
                        if(objeto.tipo == 'reembolso' ){
                            $scope.acertos.reembolsos.ValorTotal = parseFloat(objeto.valor) + parseFloat($scope.acertos.reembolsos.ValorTotal);
                            $scope.acertos.reembolsos.ValorTotal = parseFloat($scope.acertos.reembolsos.ValorTotal).toFixed(2);
                            $scope.acertos.reembolsos.push(objeto);
                        }else if(objeto.tipo == 'desconto'){
                            $scope.acertos.descontos.ValorTotal = parseFloat(objeto.valor) + parseFloat($scope.acertos.descontos.ValorTotal); 
                            $scope.acertos.descontos.ValorTotal = parseFloat($scope.acertos.descontos.ValorTotal).toFixed(2);
                            $scope.acertos.descontos.ValorTotalDescontado = parseFloat(objeto.valorDescontado) + parseFloat($scope.acertos.descontos.ValorTotalDescontado);
                            $scope.acertos.descontos.ValorTotalDescontado = parseFloat($scope.acertos.descontos.ValorTotalDescontado).toFixed(2);
                            $scope.acertos.descontos.push(objeto);
                        }
                    }
                })

                calcularValoresResumo();
                $scope.controles.profissionalSelecionado = profissionalID;


            }


            $scope.trocarDeClinica = function(){
                $scope.controles.clinicaSelecionada = false;
                $scope.controles.mostrarClinicas = true;
                $scope.controles.profissionalSelecionado = false;
                $scope.profissionais = [];
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

            $scope.ocultarItemDentista = function(item){
                item.visaoDentista = !item.visaoDentista;
                let text = "Você deseja realmente " + (item.visaoDentista ? 'ocultar' : 'disponibilizar') + ' este item da visão do Dentista?';
                swal({
                    title: "Tem certeza?",
                    text: text,
                    icon: "warning",
                    buttons: true,
                    buttons: {
                        confirm: 'Sim',
                        cancel: 'Não'
                    },
                })
                .then((willDelete) => {
                    if (willDelete) {
                        item.visaoDentista = !item.visaoDentista;
                        let id = item.id;
                        let acao = item.visaoDentista;
                        let tabela = item.tipo == 'Particular' || item.tipo == 'Convenio' ? 'acertos' : 'reembolsos_descontos';
                        AcertosService.visaoDentista(id,acao,tabela)
                        .success(function(response){
                            Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
                        })
                        .error(function(response){
                            Utils.mensagemDeErro("Erro ao atualizar dados.");
                        });
                    }
                });
            }

            var preencherData = function(){
                $scope.controles.ano = Utils.getDateArray(new Date())[2];
                $scope.controles.mes = parseInt(Utils.getDateArray(new Date())[1]);

                $scope.dataAtual = $scope.controles.mes + '-' + $scope.controles.ano

                // $('#datepickerAcertos').datepicker('update',new Date($scope.controles.ano,$scope.controles.mes,'01'));
            }

            $scope.formatarCampos = function(){
                $(document).ready(function() {
                    $("#valor").inputmask( 'currency',{"autoUnmask": true,
                    radixPoint:",",
                    groupSeparator: ".",
                    allowMinus: false,
                    prefix: 'R$ ',            
                    digits: 2,
                    digitsOptional: false,
                    rightAlign: true,
                    unmaskAsNumber: true
                    });
                    $("#comissaoDesconto").inputmask( 'percentage',{"autoUnmask": true,
                    allowMinus: false,
                    max:100,         
                    rightAlign: true,
                    });
                })
            }

            $scope.abrirModalNovoRegistro = function(){
                configurarFormulario();
                $('#modal-novo-registro').modal('show');
            }

            configurarFormulario = function(){
                $scope.objeto = new Object();
                $scope.objeto.valor = 0;
                $scope.objeto.comissao = 0;
                $scope.objeto.mes = $scope.controles.mes;
                $scope.objeto.ano = $scope.controles.ano;
            }

            salvarModalInline = function(id,valor, coluna){
                AcertosService.salvarModalInline(id,valor, coluna)
                .success(function(response){
                    $scope.selecionarProfissional(null,$scope.controles.profissionalSelecionado);
                    Utils.mensagemDeSucesso("Sucesso ao atualizar dados.");
                })
                .error(function(response){
                    Utils.mensagemDeErro("Erro ao atualizar dados.");
                });
            }

            $scope.salvar = function(){
                var clinicaID = $scope.controles.clinicaSelecionada.id;
                var profissionalID = $scope.controles.profissionalSelecionado;
                if($scope.objeto.tipo == 'particular' || $scope.objeto.tipo == 'convenio'){
                    console.log('INSERIR PARTICULAR');
                    console.log('INSERIR CONVENIO');
                }else if($scope.objeto.tipo == 'reembolso' || $scope.objeto.tipo == 'desconto'){
                    $scope.objeto.data = $scope.objeto.ano + '-' + $scope.objeto.mes + '-' + new Date().getDate();
                    AcertosService.inserirReembolsoDesconto(clinicaID,profissionalID,$scope.objeto).success((response) =>{
                        Utils.mensagemDeSucesso("Sucesso ao inserir dados.");
                        if($scope.objeto.tipo == 'reembolso') $scope.acertos.reembolsos.push($scope.objeto);
                        buscarReembolsosDescontos();
                        $('#modal-novo-registro').modal('hide');

                    })
                    .error(function(response){
                        Utils.mensagemDeErro("Erro ao atualizar dados.");
                    });
                }
                
            }

            $scope.excluir = function(objeto){
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
                        AcertosService.deletarReembolsoDesconto(objeto.id).success((response) =>{
                            buscarReembolsosDescontos();
                        })
                        .error((response) => {
                            console.info(response);
                        })
                    } 
                });
                
            }

            $scope.buscar = function(){
		        $scope.controles.profissionalSelecionado = false;
                $scope.profissionais = [];
                buscarAcertos();
                buscarReembolsosDescontos();
            }

            var buscarAcertos = function(){
                return $q(function(resolve, reject) {
                    var clinicaID = $scope.controles.clinicaSelecionada.id;
                    AcertosService.buscarAcertosByIdAndData(clinicaID, $scope.controles.ano, $scope.controles.mes).success((response) => {
                        $scope.objetos = response;
                        if($scope.objetos.length > 0) carregarProfissionais();                       
                    })
                    .error((response) => {
                        console.info(response);
                        reject();
                    });
                });
            }

            var buscarReembolsosDescontos = function(){
                return $q(function(resolve, reject) {
                    var clinicaID = $scope.controles.clinicaSelecionada.id;
                    AcertosService.buscarReembolsosDescontos(clinicaID, $scope.controles.ano, $scope.controles.mes).success((response) => {
                        $scope.objetos2 = response; 
                        if($scope.controles.profissionalSelecionado)$scope.selecionarProfissional(null,$scope.controles.profissionalSelecionado);
                        if($scope.objetos2.length > 0) carregarProfissionais();
                    })
                    .error((response) => {
                        console.info(response);
                        reject();
                    });
                });
            }

            $scope.abrirModalEditInline = function(event,item){            
                evento = event.target.id;

                if(evento == 'comissao'){
                    template = 
                        (
                            '<input id="itemComissaoModal" type="number" value="'+item.comissao+'" class="form-control" min="1" max="100"><br/>'+
                            '<button type="button" id="btn-salvarComissao" class="btn btn-success" onclick="salvarComissao('+item.id+')">Salvar</button>'+
                            '<p><div class="form-group">'+
                            '<label>Preencha com valor de 1% a 100%</label>'+
                            '</div><p/>'
                        );
                    swal("Preencha com o valor da Comissão:", {
                        buttons: false,
                        content: {
                            element: 'div',
                            attributes: {
                                innerHTML: `${template}`,
                            },
                        },
                    });
                }else if(evento == 'observacoes') {
                    swal("Preencha com as Observações", {
                        content: {
                            element: "input",
                            attributes: {
                            value: item.observacoes != null ? item.observacoes : '',
                            },
                        },
                    }).then((valor) => {
                        if(valor){
                            salvarModalInline(item.id,valor,'observacoes');
                            item.observacoes = valor;
                        }
                    });
                }else {
                    swal("Preencha com as Glosas", {
                        content: {
                            element: "input",
                            attributes: {
                            value: item.glosas != null ? item.glosas : '',
                            },
                        },
                    }).then((valor) => {
                        if(valor){
                            salvarModalInline(item.id,valor,'glosas');
                            item.glosas = valor;
                        }
                    });
                }
            }

            salvarComissao = function(id){
                valor = document.getElementById('itemComissaoModal').value;
                if(valor <= 100 && valor >= 1){
                    salvarModalInline(id,valor,'comissao');
                    $scope.acertos.particulares.filter(x=>x.id===id).length <= 0 ? $scope.acertos.convenio.filter(x=>x.id===id)[0].comissao = valor : $scope.acertos.particulares.filter(x=>x.id===id)[0].comissao = valor;
                    swal.close();
                }
            }

            $scope.init = function () {
                tratarTipoDeUsuario()
                .then(result => verificarSeTemClinicaSelecionada())
                .then(result => preencherData())
                .then(finalResult => {
                    buscarAcertos();
                    buscarReembolsosDescontos();
                });
            };

            $scope.init(); 
        }
    ]);
