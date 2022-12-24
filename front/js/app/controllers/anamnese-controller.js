angular.module('principal')
.controller('AnamneseController', ['$scope', '$localStorage', 'AnamneseService', '$timeout', '$filter', 'Utils',
	function ($scope, $localStorage, AnamneseService, $timeout, $filter, Utils) {

    $scope.$storage = $localStorage;
    // $scope.objeto = new Object();
    $scope.anamnese = new Object();

    $scope.preencher = function(){
        $scope.anamnese.resposta1 = "resposta1";
        $scope.anamnese.resposta2 = "resposta2";
        $scope.anamnese.resposta3 = "sim";
        $scope.anamnese.resposta4 = "resposta4";
        $scope.anamnese.resposta4flag = "ativo";
        $scope.anamnese.resposta5 = "resposta5";
        $scope.anamnese.resposta5flag = "ativo";
        $scope.anamnese.resposta6 = "resposta6";
        $scope.anamnese.resposta6flag = "ativo";
        $scope.anamnese.resposta7 = "resposta7";
        $scope.anamnese.resposta7flag = "ativo";
        $scope.anamnese.resposta8 = "sim";
        $scope.anamnese.resposta9 = "resposta9";
        $scope.anamnese.resposta9flag = "ativo";
        $scope.anamnese.resposta10 = "sim";
        $scope.anamnese.resposta11 = "resposta11";
        $scope.anamnese.resposta11flag = "ativo";
        $scope.anamnese.resposta12 = "resposta12";
        $scope.anamnese.resposta12flag = "ativo";
        $scope.anamnese.resposta13 = "resposta13";
        $scope.anamnese.resposta13flag = "ativo";
        $scope.anamnese.resposta14 = "sim";
    }
    
    $scope.salvar = function(){
        
        if($scope.anamnese.id){
            $scope.anamnese.updated_at = Utils.generateDateToDataBase();
            AnamneseService.update($scope.anamnese)
            .success(function(response){
                if(response){
                    mensagemDeSucesso("Atualização efetuada com sucesso.");
                }else{
                    mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");    
                }
            })
            .error(function(response){
                mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
            });
        }else{
            $scope.anamnese.created_at = Utils.generateDateToDataBase();
            
            AnamneseService.create($scope.anamnese)
            .success(function(response){
                mensagemDeSucesso("Cadastro efetuado com sucesso!");
                $scope.anamnese.id = response;
            })
            .error(function(response){
                mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
            });
        }
    }

    $scope.getOne = function(pacienteID){
        AnamneseService.getByPacienteID(pacienteID)
        .success(function(response){
            if(response && response.anamnese && response.anamnese.length != 0){
                $scope.anamnese = response.anamnese[0]; 
                montarFlagsDaAnamnese();
            }
        })
        .error(function(response){
            mensagemDeErro("Erro ao buscar dados da Anamnese.");
        });
    }

    var montarFlagsDaAnamnese = function(){
        $scope.anamnese.resposta4flag = $scope.anamnese.resposta4 ? "ativo" : "inativo";
        $scope.anamnese.resposta5flag = $scope.anamnese.resposta5 ? "ativo" : "inativo";
        $scope.anamnese.resposta6flag = $scope.anamnese.resposta6 ? "ativo" : "inativo";
        $scope.anamnese.resposta7flag = $scope.anamnese.resposta7 ? "ativo" : "inativo";
        $scope.anamnese.resposta9flag = $scope.anamnese.resposta9 ? "ativo" : "inativo";
        $scope.anamnese.resposta11flag = $scope.anamnese.resposta11 ? "ativo" : "inativo";
        $scope.anamnese.resposta12flag = $scope.anamnese.resposta12 ? "ativo" : "inativo";
        $scope.anamnese.resposta13flag = $scope.anamnese.resposta13 ? "ativo" : "inativo";
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

    init = function() {
        if($scope.$parent.$parent && $scope.$parent.$parent.objeto && $scope.$parent.$parent.objeto.id){
            var pacienteID = $scope.$parent.$parent.objeto.id;
            $scope.anamnese.pacienteID = pacienteID;
            $scope.getOne(pacienteID);
        }
    };
    
	init();
}]);