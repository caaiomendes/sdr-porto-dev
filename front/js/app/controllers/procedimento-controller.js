angular.module('principal')
.controller('ProcedimentoController', ['$scope', '$localStorage', 'ProcedimentoService', '$timeout','ClinicaService', 'Utils',
	function ($scope, $localStorage, ProcedimentoService, $timeout, ClinicaService, Utils) {

    $scope.$storage = $localStorage;
    $scope.objeto = new Object();
    $scope.objetos = new Object();
    $scope.flagEditando = false;
    $scope.clinica = [];
    
    $scope.preencher = function(){
        $scope.objeto.created_at = "0000-00-00 00:00:00";
        $scope.objeto.updated_at = "0000-00-00 00:00:00";
        $scope.buscado = false;
        
        $scope.objeto.nome = "Restauração";
        $scope.objeto.categoria = "Categoria1";
        $scope.objeto.descricao = "Descrição1";
        $scope.objeto.status = "status1";
        $scope.objeto.codigo = "112233";
        $scope.objeto.valor1 = "123";
        $scope.objeto.valor2 = "456";
        $scope.objeto.valor3 = "789";
        $scope.objeto.valor4 = "222";
        $scope.objeto.valor5 = "333";
    }

    var limpar = function(){
        $scope.objeto = new Object();
    }

    $scope.selecionar = async function(selecionado){
        $scope.objeto = selecionado;
        $scope.flagEditando = true;
        await ClinicaService.getAll().success((res) => {
            $scope.clinica = res.clinica
        }).error((erro) => {
            console.info(erro)
        })
        setTimeout(estiloDosCampos, 1000);
    }

    $scope.voltar = function(){
        $scope.flagEditando = false;
        $scope.getAll();
    }

    $scope.novo = function(){
        $scope.flagEditando = true;
        limpar();
        setTimeout(estiloDosCampos, 1000);
    }

    $scope.excluir = function(selecionado){
        $scope.objeto = selecionado;
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
              delete2();
            } else {
              
            }
        });
    }

    var delete2 = function(){
        ProcedimentoService.delete($scope.objeto)
        .success(function(response){
            if(response==1){
                mensagemDeSucesso("Exclusão efetuada com sucesso.");
                $scope.flagEditando = false;
                $scope.getAll();

            }else{
                mensagemDeErro("Houve um erro ao excluir.");
            }
        })
        .error(function(response){
            mensagemDeErro("Erro ao excluir. Entre em contato com o Administrador.");
        });
    }

    $scope.salvar = function(){

        if($scope.objeto.id){
            $scope.objeto.updated_at = Utils.generateDateToDataBase();
            ProcedimentoService.update($scope.objeto)
            .success(function(response){
                if(response){
                    mensagemDeSucesso("Atualização efetuada com sucesso.");
                    $scope.flagEditando = false;
                    $scope.getAll();
                }else{
                    mensagemDeErro("Erro ao atualizar. Entre em contato com o Administrador.");    
                }
            })
            .error(function(response){
                mensagemDeErro("Erro ao atualizar. Entre em contato com o Administrador.");
            });
        }else{
            $scope.objeto['clinicaId'] = JSON.parse(localStorage.getItem('ngStorage-clinica')).id
            $scope.objeto['created_at'] = Utils.generateDateToDataBase();
            ProcedimentoService.insert($scope.objeto)
            .success(function(response){
                mensagemDeSucesso("Cadastro efetuado com sucesso!");
                $scope.objeto.id = response;
                $scope.flagEditando = false;
                $scope.getAll();
            })
            .error(function(response){
                mensagemDeErro("Erro ao cadastrar. Entre em contato com o Administrador.");
            });
        }
    }

    $scope.getAll = function(){
        let idClinica = JSON.parse(localStorage.getItem('ngStorage-clinica'));
        if(idClinica){
            ProcedimentoService.getByClinica(idClinica.id)
            .success(function(response){
                if(response=="erro"){
                    console.info("erro");
                }else{
                    if(response.procedimento.length>0){
                        $scope.objetos = response.procedimento;
                        setTimeout(ordenarTabelas, 2000);
                    }else{
                        $scope.objetos = new Object();
                    }
                    
                    $scope.buscado = true;
                }
            })
            .error(function(response){
                $scope.mensagem = "Erro ao buscar registros.";
                $scope.flagSemConteudo = true;
            });
        }
    }

    var ordenarTabelas = function(){
        $('#sortable-table-1').tablesort();
    }

    var mensagemDeSucesso = function(mensagem){
        swal({
            title: 'Aviso!',
            text: mensagem,
            timer: 3000,
            icon: "success",
            button: false
          }).then(
            function() {},
            // handling the promise rejection
            function(dismiss) {
              if (dismiss === 'timer') {
                console.log('I was closed by the timer')
              }
            }
          )
    }

    var mensagemDeErro = function(mensagem){
        swal({
            title: 'Aviso!',
            text: mensagem,
            timer: 3000,
            icon: "error",
            button: false
          }).then(
            function() {},
            // handling the promise rejection
            function(dismiss) {
              if (dismiss === 'timer') {
                console.log('I was closed by the timer')
              }
            }
          )
    }

    var estiloDosCampos = function(){

        $("#valor1").inputmask('decimal', {
            "autoUnmask": true,
            // 'digits': 2,
            'prefix': ' R$ ',
        });
        $("#valor2").inputmask('decimal', {
            "autoUnmask": true,
            // 'digits': 2,
            'prefix': ' R$ ',
        });
        $("#valor3").inputmask('decimal', {
            "autoUnmask": true,
            // 'digits': 2,
            'prefix': ' R$ ',
        });
        $("#valor4").inputmask('decimal', {
            "autoUnmask": true,
            // 'digits': 2,
            'prefix': ' R$ ',
        });
        $("#valor5").inputmask('decimal', {
            "autoUnmask": true,
            // 'digits': 2,
            'prefix': ' R$ ',
        });
    }

    init = function() {
        $scope.getAll();
        $scope.objetos = []
    };
    
	init();
}]);