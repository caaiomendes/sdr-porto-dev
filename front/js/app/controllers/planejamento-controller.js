angular.module('principal')
.controller('PlanejamentoController', ['$scope', '$localStorage', 'PlanejamentoService', 'ProfissionalService', 'Utils', 
	function ($scope, $localStorage, PlanejamentoService, ProfissionalService, Utils) {

    $scope.$storage = $localStorage;
    $scope.objeto = new Object();
    $scope.planejamentos = null;
    $scope.dentistas = [];
    $scope.comboDentistas = {};
    $scope.planejamentoSelecionado = new Object();
    $scope.totalBruto = 123;
    $scope.parcelas = [];
    $scope.formasDePagamento = [ 
        {"nome": "Crédito à vista", id: 1}, 
        {"nome": "Crédito parcelado", id: 2}, 
        {"nome": "Débito", id: 3}, 
        {"nome": "Dinheiro", id: 4} ,
        {"nome": "Transferência", id: 5}, 
        {"nome": "PIX", id: 6}, 
        {"nome": "Cheque", id: 7},
        {"nome": "Boleto", id: 8}
    ];

    var contadorDeParcelas = 0;
    $scope.parcelasPagas = 0;

    $("#planejamento-tab").on("click", function () {
        buscarPlanejamentos();
    })

    var buscarPlanejamentos = function(){
        PlanejamentoService.getAllByPacienteID(localStorage.pacienteID)
        .success(function (response) {
            // console.info(response);
            $scope.planejamentos = response;
            setTimeout(tratarRetornoPlanejamentos, 1000);
        })
        .error(function (response) {
            $scope.mensagem = "Erro ao buscar registros.";
            $scope.flagSemConteudo = true;
        });
    }

    var tratarRetornoPlanejamentos = function(){
        $(".porcentagem").inputmask({
            'alias': 'decimal',
            'mask': "99"
        });

        tratarCoresDoPlanejamento();
        
        //????
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    var tratarCoresDoPlanejamento = function(){
        for(i=0; i<$scope.planejamentos.length; i++){
            var planejamento = $scope.planejamentos[i];
            
            if(planejamento.status == 'nao_aprovado'){
                planejamento.statusLabel = 'Não aprovado';
                planejamento.statusColor = 'badge-primary';
            }else{
                planejamento.statusLabel = 'Pendente';
                planejamento.statusColor = 'badge-warning';

                if(planejamento.parcela_vencida == 1){
                    planejamento.statusLabel = 'Vencido';
                    planejamento.statusColor = 'badge-danger';
                }else if(planejamento.parcelas_em_aberto != 1 && planejamento.parcelas_quantidade > 0){
                    planejamento.statusLabel = 'Pago';
                    planejamento.statusColor = 'badge-success';
                }
            }
        }
    }

    var buscarDentistas = function(){
        ProfissionalService.getBySituacao('ativo')
        .success(function (response) {
            $scope.dentistas = response.profissional;
            $scope.comboDentistas = {
                selecionado: null,
                availableOptions: $scope.dentistas 
            };
            ordenarProfissionais();
        })
        .error(function (response) {
            $scope.mensagem = "Erro ao buscar registros.";
        });
    }

    var ordenarProfissionais = function(){
        $scope.comboDentistas.availableOptions.sort((a, b) => a.apelido.localeCompare(b.apelido))
    }

    $scope.selecionarPlanejamento = function($event, planejamento){
        $scope.parcelasPagas = 0;

        var planejamentoEstaAberto = $event.currentTarget.ariaExpanded;
        if(planejamentoEstaAberto == 'false'){
            $scope.planejamentoSelecionado = planejamento;
            $scope.buscarProcedimentos();
        }
    }

    $scope.atualizarDesconto = function () {
        calcularValorBrutoELiquido();

        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => atualizarStatus(), 1000);
    }

    $scope.atualizarStatus = function () {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => atualizarStatus(), 1000);
    }

    $scope.atualizarStatusDeAprovacao = function(){

        if($scope.planejamentoSelecionado.status == 'aprovado'){
            //criar novo item de pagamento
            if(checkDentistaSelecionado()){
                $scope.adicionarParcela();
                window.clearTimeout(this.timeout);
                this.timeout = window.setTimeout(() => atualizarStatus(), 1000);
            }else{
                Utils.apresentarToastErro("Selecione o Dentista executor de todos os procedimentos ativos.");
                $scope.planejamentoSelecionado.status = 'nao_aprovado';
            }
        }else{
            //apagar todas as parcelas do banco
            apagarTodasAsParcelas();
            window.clearTimeout(this.timeout);
            this.timeout = window.setTimeout(() => atualizarStatus(), 1000);
        }
    
    }

    var apagarTodasAsParcelas = function(){
        PlanejamentoService.apagarPlanejamentoPagamentosByPlanejamentoID($scope.planejamentoSelecionado.planejamentoID)
        .success(function (response) {
            Utils.apresentarToastSucesso("Parcelas removidas!", 5000);

            //apagar todas as parcelas localmente
            $scope.parcelas = [];
        })
            .error(function (response) {
            Utils.apresentarToastErro("Erro ao atualizar dados. Entre em contato com o Administrador.");
        });
    }

    var removerParcelaDoBanco = function(objeto){
        objeto.deleted_at = Utils.generateDateToDataBase();

        PlanejamentoService.apagarParcela(objeto)
        .success(function (response) {
            Utils.apresentarToastSucesso("Sucesso ao remover parcela!", 5000);
            tratarCoresDoPlanejamento();
        })
            .error(function (response) {
            Utils.apresentarToastErro("Erro ao remover parcela. Entre em contato com o Administrador.");
        });
    }

    $scope.atualizarRecibo = function(){
        if( $scope.planejamentoSelecionado.notaFiscal=='true' ){
            $scope.planejamentoSelecionado.recibo = 'false';
            var mensagem = 'Somente pode ser escolhido RECIBO ou NOTA FISCAL. Os 2 não podem ser escolhidos simultâneamente.';
            Utils.apresentarToastErro(mensagem);
        }else{
            atualizarStatus();
        }
    }

    $scope.atualizarNotaFiscal = function(){
        if( $scope.planejamentoSelecionado.recibo=='true' ){
            $scope.planejamentoSelecionado.notaFiscal='false'
            var mensagem = 'Somente pode ser escolhido RECIBO ou NOTA FISCAL. Os 2 não podem ser escolhidos simultâneamente.';
            Utils.apresentarToastErro(mensagem);
        }else{
            atualizarStatus();
        }
    }
    
    var atualizarStatus = function(){
        $scope.planejamentoSelecionado.updated_at = Utils.generateDateToDataBase();

        PlanejamentoService.atualizarStatus($scope.planejamentoSelecionado)
          .success(function (response) {
            tratarRetornoPlanejamentos();
        })
          .error(function (response) {
            Utils.apresentarToastErro("Erro ao atualizar dados. Entre em contato com o Administrador.");
        });
    }

    $scope.buscarProcedimentos = function(){
        var agendamentoID = $scope.planejamentoSelecionado.idAgendamento;
        $scope.parcelas = [];

        PlanejamentoService.findProcedimentosByAgendamentoID(agendamentoID)
          .success(function (response) {
            $scope.planejamentoSelecionado.procedimentos = response;
            tratarRetornoProcedimentos();
        })
          .error(function (response) {
            Utils.apresentarToastErro("Erro ao atualizar dados. Entre em contato com o Administrador.");
        });
    }

    var calcularValorBrutoELiquido = function(){
        var procedimentos = $scope.planejamentoSelecionado.procedimentos;
        $scope.totalBruto = 0;

        for(i=0; i<procedimentos.length; i++){
            if(procedimentos[i].ativo=='sim'){
                $scope.totalBruto += parseFloat(procedimentos[i].valor);
            }

        }

        $scope.totalLiquido = $scope.totalBruto - ($scope.totalBruto * $scope.planejamentoSelecionado.desconto/100);
        $scope.totalLiquido = Math.round($scope.totalLiquido * 100) / 100;
        $scope.planejamentoSelecionado.totalLiquido = $scope.totalLiquido;
    }

    var tratarRetornoProcedimentos = function(){
        var procedimentos = $scope.planejamentoSelecionado.procedimentos;
        $scope.totalBruto = 0;

        for(i=0; i<procedimentos.length; i++){
            //para ja vir com o dentista 
            if(procedimentos[i].dentistaExecutorID){
                procedimentos[i].dentistaSelecionado = new Object();
                procedimentos[i].dentistaSelecionado.id = procedimentos[i].dentistaExecutorID;
            }

            //tratar valor
            if(procedimentos[i].valor){
                procedimentos[i].valorBR = Utils.moneyUSAtoBR("" + procedimentos[i].valor);
            }
        }

        if($scope.planejamentoSelecionado.status == 'aprovado'){
            buscarParcelas();
        }

        calcularValorBrutoELiquido();

    }
    
    $scope.formatarCampoMonetario = function(){
        Inputmask().mask($("input.reais"));
    }
    
    $scope.formatarParcelas = function(){
        $scope.formatarCampoMonetario();
        Inputmask().mask($("input.vencimento_campo"));
    }
    
    $scope.atualizarValorDoProcedimento = function (procedimento) {
        procedimento.valor = Utils.moneyBRtoUSA(procedimento.valorBR);

        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => atualizarValorDoProcedimento2(procedimento), 1000);
    }

    var atualizarValorDoProcedimento2 = function (procedimento) {
        var id = procedimento.odontogramaProcedimentoID;

        var objeto = {
            valor: procedimento.valorBR
        }

        atualizarOdontogramaProcedimento(objeto, id, false);
    }

    $scope.atualizarDentistaDoProcedimento = function(procedimento) {
        
        if(procedimento && procedimento.dentistaSelecionado){
            var id = procedimento.odontogramaProcedimentoID;

            var objeto = {
                dentistaExecutorID: procedimento.dentistaSelecionado.id
            }
    
            atualizarOdontogramaProcedimento(objeto, id, true);
        }
    }

    $scope.atualizarProcedimentoAtivo = function (procedimento) {
        var id = procedimento.odontogramaProcedimentoID;

        var objeto = {
            ativo: procedimento.ativo,
        }

        atualizarOdontogramaProcedimento(objeto, id, false);
    }

    var atualizarOdontogramaProcedimento = function (objeto, id, atualizarComboDeDentista) {
        objeto.updated_at = Utils.generateDateToDataBase();
        //objeto.valor = Utils.moneyBRtoUSA(objeto.valor);

        PlanejamentoService.atualizarProcedimentoAtivo(objeto, id)
            .success(function (response) {
                if(!atualizarComboDeDentista){
                    tratarRetornoProcedimentos();
                }
        })
          .error(function (response) {
            Utils.apresentarToastErro("Erro ao atualizar dados. Entre em contato com o Administrador.");
        });
    }

    $scope.adicionarParcela = function(){
        // $scope.flagCalculando = true;
        // var parcela_numero = $scope.parcelas.length + 1;
        $scope.pagamentoSelecionado = $scope.formasDePagamento[0];

        var parcela = {
            "planejamento_id": $scope.planejamentoSelecionado.planejamentoID,
            "parcela_numero": 0,
            // "formaObject": $scope.formasDePagamento[0],
            "valor": 0,
            "data": null,
            "status": "pendente",
            // "vencimento" : Utils.incrementarData($scope.planejamentoSelecionado.dataAtendimento, $scope.parcelas.length),
            // "vencimentoBR" : new Date(),
            "created_at" : Utils.generateDateToDataBase(),
        }

        $scope.parcelas.push(parcela);
        distribuirValorLiquidoNasParcelas();
        Inputmask().mask($("input.vencimento_campo"));
        tratarCoresDoPlanejamento();
    }

    $scope.salvarParcelas = function(){
        for(let i=0; i<$scope.parcelas.length; i++){
            var parcela = $scope.parcelas[i];
            // console.info("salvar a parcela:" + i + ", com o id:" + parcela.id);
            $scope.salvarParcelaIndividual(parcela);
        }
    }

    $scope.salvarParcelaIndividual = function(parcela){

        verificarVencimentoDasParcelas();

        if(parcela.id){
            atualizarParcelaIndividual(parcela);
        }else{
            inserirParcela(parcela);
        }
    }

    // var salvarParcela = function(parcela){
    //     if(parcela.id){
    //         $scope.atualizarParcelaLazy(parcela);
    //     }else{
    //         inserirParcela(parcela);
    //     }
    // }

    var atualizarParcelaIndividual = function(parcela){
        if(parcela.vencimentoBR){
            parcela.vencimento = Utils.converterDataBRtoUSA(parcela.vencimentoBR);
        }

        parcela.valor = Utils.moneyBRtoUSA(parcela.valorBR);
        parcela.updated_at = Utils.generateDateToDataBase();

        PlanejamentoService.atualizarParcela(parcela)
        .success(function(response){
            Utils.apresentarToastSucesso("Sucesso ao atualizar a parcela.");
            tratarCoresDoPlanejamento();
        })
        .error(function(response){
            Utils.apresentarToastErro("Erro ao atualizar parcela.");
        });
    }

    var atualizarParcela = function(parcela){
        verificarSeValoresDasParcelasBatemComValorLiquido();
        atualizarDataDeVencimento(parcela);

        // Get your promise and callbacks
        const { resolve, reject, promise } = flatPromise();

        if(parcela.id){
            //trocar vencimentoBR para vencimento
            // precisa antes mudar para USA
            if(parcela.vencimentoBR){
                parcela.vencimento = Utils.converterDataBRtoUSA(parcela.vencimentoBR);
            }

            parcela.valor = Utils.moneyBRtoUSA(parcela.valorBR);
            parcela.updated_at = Utils.generateDateToDataBase();
    
            PlanejamentoService.atualizarParcela(parcela)
            .success(function(response){
                // Utils.apresentarToastSucesso("Sucesso ao atualizar a parcela.");
                verificarSeValoresDasParcelasBatemComValorLiquido();
                verificarVencimentoDasParcelas();
                resolve('done!');
            })
            .error(function(response){
                console.info(response);
                Utils.apresentarToastErro("Erro ao atualizar parcela.");
                reject('erro');
            });
        }else{
            reject('erro');
        }

        

        return promise;
    }

    var atualizarDataDeVencimento = function(parcela){
        var formaDePagamentoId = parcela.forma;
        
        //SE Boleto / Dinheiro / Transf. / Pix / Cheque = hoje
        if(formaDePagamentoId == 8 || formaDePagamentoId == 4 || formaDePagamentoId == 5 || formaDePagamentoId == 6 || formaDePagamentoId == 7 ){
            var novaData = Utils.getDateStringFromDate(new Date());
            atribuirDataDeVencimento(parcela, novaData);
        //SE Débito = hoje + 1 dia
        }else if( formaDePagamentoId == 3 ){
            var novaData = Utils.incrementarDia(Utils.getDateStringFromDate(new Date()), 1);
            atribuirDataDeVencimento(parcela, novaData);
        //SE Crédito à vista = hoje + 30dias    
        }else if( formaDePagamentoId == 1 ){
            var novaData = Utils.incrementarData(Utils.getDateStringFromDate(new Date()), 1);
            atribuirDataDeVencimento(parcela, novaData);
        //SE Crédito parcelado = hoje + (30 dias x número da parcela)    
        }else if( formaDePagamentoId == 2 && parcela.parcela_numero){
            // parcela.parcela_numero = "1";
            var novaData = Utils.incrementarData(Utils.getDateStringFromDate(new Date()), parseInt(parcela.parcela_numero));
            atribuirDataDeVencimento(parcela, novaData);
        }

    }

    var atribuirDataDeVencimento = function(parcela, novaData){
        parcela.vencimento = novaData; //yyyy-mm-dd
        parcela.vencimentoBR = Utils.converterDataUSAtoBR(novaData);
        Inputmask().mask($("input.vencimento_campo"));
    }

    /* Serve para atualizar varios campos
        forma de pagamento
        valor
        data
    */
    // $scope.atualizarParcelaLazy = function(parcela){
    //     window.clearTimeout(this.timeout);
    //     this.timeout = window.setTimeout(() => atualizarParcela(parcela)
    //     .then( response => Utils.apresentarToastSucesso("Recebimento efetivado!", 5000) )
    //     .catch(err => console.error('rejected with', err)), 1000);
    // }

    var inserirParcela = function(parcela){
        parcela.valor = Utils.moneyBRtoUSA(parcela.valorBR);
        console.info(parcela.valor);

        PlanejamentoService.inserirParcela(parcela)
        .success(function(response){
            parcela.id = response;
            Utils.apresentarToastSucesso("Sucesso ao gravar a parcela.");
        })
        .error(function(response){
            console.info(response);
            Utils.apresentarToastErro("Erro ao gravar parcela.");
        });
    }

    $scope.removerParcela = function(item){
        removerParcelaDoBanco(item);

        var index = $scope.parcelas.indexOf(item);
        $scope.parcelas.splice(index, 1);  
        distribuirValorLiquidoNasParcelas();
    }

    var distribuirValorLiquidoNasParcelas = function(){
        var valorDaParcela = $scope.totalLiquido / $scope.parcelas.length;
        valorDaParcela = Math.round(valorDaParcela * 100) / 100;

        for(i=0; i<$scope.parcelas.length; i++){
            if($scope.parcelas[i]){
                // salvarParcela($scope.parcelas[i]);
                $scope.parcelas[i].valorBR = Utils.moneyUSAtoBR("" + valorDaParcela);
            }
        }

        verificarSeValoresDasParcelasBatemComValorLiquido();

        // setTimeout($scope.formatarParcelas, 3000);
    }

    var buscarParcelas = function(){
        PlanejamentoService.buscarParcelas($scope.planejamentoSelecionado.planejamentoID)
        .success(function(response){
            $scope.parcelas = response.planejamentoPagamento;
            tratarRetornoDasParcelas();
            verificarSeValoresDasParcelasBatemComValorLiquido();
            verificarVencimentoDasParcelas();
        })
        .error(function(response){
            console.info(response);
            Utils.apresentarToastErro("Erro ao gravar parcela.");
        });
    }

    var tratarRetornoDasParcelas = function(){
        $scope.parcelasPagas = 0;

        for(let i=0; i<$scope.parcelas.length; i++){
            let parcela = $scope.parcelas[i];

            if($scope.parcelas[i]){
                parcela.valorBR = Utils.moneyUSAtoBR(parcela.valor);
                parcela.vencimentoBR = Utils.converterDataUSAtoBR(parcela.vencimento);

                if(parcela.pagamento){
                    $scope.parcelasPagas++;
                }
            }
        }
    }

    var verificarSeValoresDasParcelasBatemComValorLiquido = function(){
        $scope.somaDasParcelas = 0;
        $scope.avisoSobreValor = false;

        for(i=0; i<$scope.parcelas.length; i++){
            if($scope.parcelas[i]){
                var valorLimpo = $scope.parcelas[i].valorBR;

                if(typeof valorLimpo === "string" ){
                    valorLimpo = $scope.parcelas[i].valorBR.replace('R$', '');
                    valorLimpo = valorLimpo.replace('.00', '');
                    valorLimpo = Utils.moneyBRtoUSA(valorLimpo);
                }

                $scope.somaDasParcelas += parseFloat(valorLimpo);
            }
        }

        if($scope.totalLiquido != $scope.somaDasParcelas.toFixed(2)){
            $scope.avisoSobreValor = true;
        }
    }

    $scope.receber = function(parcela){
        $scope.parcelaSelecionada = parcela;
        let forma = $scope.formasDePagamento[parcela.forma - 1].nome;

        swal({
            title: "Tem certeza?",
            text: "Deseja confirmar o recebimento desta parcela? \n \n Forma: " + forma + " \n Vencimento: " + parcela.vencimentoBR + " \n Valor R$ " + parcela.valorBR + "",
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
        .then((confirmacao) => {
            if (confirmacao) {
                receberEfetivar();
            } else {

            }
        });
    }

    var receberEfetivar = async function(){
        $scope.parcelaSelecionada.status = 'recebido';
        $scope.parcelaSelecionada.pagamento = Utils.generateDateToDataBase();

        // const result = await atualizarParcela($scope.parcelaSelecionada)
        atualizarParcela($scope.parcelaSelecionada)
        .then( response => {
            $scope.parcelasPagas++;
            Utils.apresentarToastSucesso("Recebimento efetivado!", 5000);
         })
        .catch(err => console.error('rejected with', err));
        // console.log(result);
    }

    var flatPromise = function() {

        let resolve, reject;
    
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
    
        return { promise, resolve, reject };
    }

    var verificarVencimentoDasParcelas = function(){

        for(let i=0; i<$scope.parcelas.length; i++){
            var parcelaAtual = $scope.parcelas[i];

            parcelaAtual.jaVenceu = false;
            $scope.parcelas[i].jaVenceu = false;

            if(parcelaAtual.vencimento && Utils.getDateFromString(parcelaAtual.vencimento) < new Date()){
                parcelaAtual.jaVenceu = true;
                $scope.parcelas[i].jaVenceu = true;
            }
        }

    }

    $scope.mudancaDeValor = function(){
        verificarSeValoresDasParcelasBatemComValorLiquido();
    }

    $scope.selecionarFormaDePagamento = function(parcela){
        alterarFormaOuNumeroDaParcela(parcela);
    }

    $scope.selecionarNumeroDaParcela = function(parcela){
        alterarFormaOuNumeroDaParcela(parcela);
    }
    
    var alterarFormaOuNumeroDaParcela = function (parcela){
        if(parcela.forma != 2){
            parcela.parcela_numero = "";
        }
        atualizarDataDeVencimento(parcela);
    }

    var checkDentistaSelecionado = function(){
        // planejamentoSelecionado.procedimentos
        let procedimentos = $scope.planejamentoSelecionado.procedimentos;
        let quantidadeDeDentistasNaoSelecionado = 0;

        for(i=0; i<procedimentos.length; i++){
            if(procedimentos[i].ativo=='sim' && procedimentos[i].dentistaSelecionado==null){
                quantidadeDeDentistasNaoSelecionado++;
            }
        }

        return quantidadeDeDentistasNaoSelecionado == 0;
    }

    init = function() {
        buscarDentistas();
        //$("#planejamento-tab").trigger( "click" );
        // console.info("init planejamento");
    };
    
	init();
}]);
