angular.module('principal')
.controller('EstoqueController', ['$scope',  'EstoqueService', 'Utils',
	function ($scope, EstoqueService,  Utils) {

    $scope.controles = {
        entidades: [],
        mostrarFormulario : false,
        mostrarTabelas : false,
        ano: null,
        mes: null,
        clinicaID: null,
        ehEditavel: true,
        buscado: false,
        parcelas: [],
        isEditor : false
    };

    $scope.getAll = function () {
        EstoqueService.getAll($scope.controles.clinicaID)
        .success(function(response){
            if(response=="erro"){
                console.info("erro");
            }else{
                if(response.estoque.length>0){
                    $scope.controles.entidades = response.estoque;
                    tratarResponse();
                    $scope.aplicarEstilos();
                }else{
                    $scope.controles.entidades = new Object();
                }

                $scope.buscado = true;
            }
        })
        .error(function(response){
            $scope.mensagem = "Erro ao buscar registros.";
            $scope.flagSemConteudo = true;
        });
    }

    var tratarRequest = function(){
        if($scope.controles.entidade.dataUltimaCompra){
            $scope.controles.entidade.dataUltimaCompra = Utils.converterDataBRtoUSA($scope.controles.entidade.dataUltimaCompra);
        }

        if($scope.controles.entidade.dataVencimento){
            $scope.controles.entidade.dataVencimento = Utils.converterDataBRtoUSA("01-" + $scope.controles.entidade.dataVencimento);
        }
    }

    var tratarResponse = function () {
        for (i = 0; i < $scope.controles.entidades.length; i++) {
            var entidade = $scope.controles.entidades[i];

            entidade.quantidadeSala = parseInt(entidade.quantidadeSala);
            entidade.quantidadeEstoque = parseInt(entidade.quantidadeEstoque);

            if(entidade.dataUltimaCompra){
                entidade.dataUltimaCompra = Utils.converterDataUSAtoBR(entidade.dataUltimaCompra);
            }

            if(entidade.dataVencimento){
                entidade.dataVencimento = Utils.converterDataUSAtoBR(entidade.dataVencimento);
            }

            if(entidade.dataVencimento && entidade.dataVencimento!= '00-00-0000'){
                entidade.dataVencimento = entidade.dataVencimento.replaceAll('01-', '');
                entidade.dataVencimento = entidade.dataVencimento.replaceAll('00-', '');
            }else{
                entidade.dataVencimento = "";
            }

            entidade.limite = parseInt(entidade.limite);

            entidade.quantidadeTotal = entidade.quantidadeEstoque + entidade.quantidadeSala;

            entidade.quantidadeParaComprar = (entidade.limite + 1) - (entidade.quantidadeEstoque + entidade.quantidadeSala);
            if(entidade.quantidadeParaComprar<0){
                entidade.quantidadeParaComprar = 0;
            }

            if( entidade.quantidadeTotal == entidade.limite ){
                entidade.situacao = "Atenção";
            }else if( entidade.quantidadeTotal < entidade.limite ){
                entidade.situacao = "Comprar";
            }else{  
                entidade.situacao = "OK"
            }
        }
        
    }

    $scope.recalcular = function () {
        var entidade = $scope.controles.entidade;

        entidade.quantidadeTotal = entidade.quantidadeEstoque + entidade.quantidadeSala;

        entidade.quantidadeParaComprar = (entidade.limite + 1) - (entidade.quantidadeEstoque + entidade.quantidadeSala);
        if(entidade.quantidadeParaComprar<0){
            entidade.quantidadeParaComprar = 0;
        }

        if( entidade.quantidadeTotal == entidade.limite ){
            entidade.situacao = "Atenção";
        }else if( entidade.quantidadeTotal < entidade.limite ){
            entidade.situacao = "Comprar";
        }else{  
            entidade.situacao = "OK"
        }
    }

    $scope.novo = function () {
        $scope.controles.entidade = new Object();
        $scope.controles.mostrarFormulario = true;
    }

    $scope.voltar = function () {
        $scope.controles.mostrarFormulario = false;
        $scope.getAll();
    }

    $scope.preencher = function () {
        $scope.controles.entidade = {
            "produto": "produto1",
            "marca": "marca1",
            "medida": "caixa",
            "quantidadeEstoque": 10,
            "quantidadeSala": 190,
            "quantidadeParaComprar": 200,
            "limite": 3,
            "dataUltimaCompra": '1982-07-01',
            "ultimoPrecoPago": 1.99
        };

        atualizarData($scope.controles.entidade.dataUltimaCompra);
    }

    var atualizarData = function (data) {
        $('#datepicker').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 2,
        });

        $('#datepicker').datepicker('setDate', Utils.converterDataUSAtoBR(data));
    }

    $scope.aplicarEstilos = function(){
        $('#datepicker').datepicker({
            enableOnReadonly: true,
            autoclose: true,
            format: "dd-mm-yyyy", //formato de saida(para o rest)
            language: "pt-BR",
            startView: 2,
        });

        $('#datepicker-vencimento').datepicker({
            enableOnReadonly: true,
            autoclose: true,
            format: "mm-yyyy", //formato de saida(para o rest)
            language: "pt-BR",
            startView: 2,
            viewMode: "months",
            minViewMode: "months"
        });

        if ($('#sortable-table-1').length) {
            $('#sortable-table-1').tablesort();
        }  

        // $("#limite").inputmask({placeholder: '', mask: "9999"});
        // $("#quantidadeEstoque").inputmask({placeholder: '', mask: "9999"});
        // $("#quantidadeSala").inputmask({placeholder: '', mask: "9999"});
    }

    $scope.salvar = function(){
        tratarRequest();
        
        $scope.controles.entidade.clinicaID = $scope.controles.clinicaID;
        $scope.controles.entidade.userID = $scope.controles.userID;

        if($scope.controles.entidade.id){
            $scope.controles.entidade.updated_at = Utils.generateDateToDataBase();
            EstoqueService.update($scope.controles.entidade)
            .success(function(response){
                if(response && response != "null"){
                    Utils.mensagemDeSucesso("Atualização efetuada com sucesso.");
                    $scope.controles.mostrarFormulario = false;
                    $scope.getAll();
                }else{
                    Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");    
                }
            })
            .error(function(response){
                Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
            });
        }else{
            $scope.controles.entidade.created_at = Utils.generateDateToDataBase();
            EstoqueService.create($scope.controles.entidade)
            .success(function(response){
                Utils.mensagemDeSucesso("Cadastro efetuado com sucesso!");
                $scope.controles.entidade.id = response;
                $scope.controles.mostrarFormulario = false;
                $scope.getAll();
            })
            .error(function(response){
                Utils.mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
            });
        }
    }

    $scope.excluirConfirmacao = function(selecionado){
        $scope.controles.entidade = selecionado;
        swal({
            title: "Tem certeza?",
            text: "Deseja realmente apagar este item?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: {
                confirm : {text:'Sim'},
                cancel : 'Não'
            },
          })
          .then((willDelete) => {
            if (willDelete) {
              excluir();
            } else {
              
            }
        });
    }

    var excluir = function(){
        EstoqueService.delete($scope.controles.entidade.id)
        .success(function(response){
            if(response==1){
                Utils.mensagemDeSucesso("Exclusão efetuada com sucesso.");
                $scope.getAll();
                $scope.controles.mostrarFormulario = false;
            }else{
                Utils.mensagemDeErro("Houve um erro ao excluir.");
            }
        })
        .error(function(response){
            Utils.mensagemDeErro("Erro ao excluir. Entre em contato com o administrador.");
        });
    }

    $scope.selecionar = function(selecionado){
        $scope.controles.entidade = selecionado;
        $scope.controles.mostrarFormulario = true;
    }

    $scope.selecionarClinica = function(){
        localStorage.setItem('ngStorage-clinica', null);
        $scope.mostrarClinicas = true;
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

    $scope.init = function() {
        
        verificarSeTemClinicaSelecionada();

        $scope.controles.clinicaID = $scope.$storage.clinica.id;
        $scope.controles.userID = $scope.$storage.user_id;
        $scope.controles.isEditor = ($scope.$storage.tipo == 'secretaria') || ($scope.$storage.tipo == 'administrador') ;
        $scope.getAll();
    };

    $scope.htmlToCSV = function(html, filename) {
        filename = 'arquivo';
        
        var data = [];
        var rows = document.querySelectorAll("table tr");
                
        for (var i = 0; i < rows.length; i++) {
            console.info("row: " + i);

            var row = [], cols = rows[i].querySelectorAll("td, th");
                    
            for (var j = 0; j < cols.length; j++) {
                console.info("cols: " + 'J: ' + j + '--' + cols[j].innerText);
                if(cols[j].innerText == ''){
                    // cols[j].innerText = '-';
                    row.push("-");
                }else{
                    row.push(cols[j].innerText);
                }
                
            }
                    
            data.push(row.join(",")); 		
        }
    
        downloadCSVFile(data.join("\n"), filename);
    }

    var downloadCSVFile = function(csv, filename) {
        var csv_file, download_link;
    
        csv_file = new Blob(["\uFEFF"+csv], {type: "text/csv"});
    
        download_link = document.createElement("a");
    
        download_link.download = filename;
    
        download_link.href = window.URL.createObjectURL(csv_file);
    
        download_link.style.display = "none";
    
        document.body.appendChild(download_link);
    
        download_link.click();
    }

    var navegavegacaoAutomatica = function(){
        $scope.novo(); 
    }

	$scope.init();
}]);