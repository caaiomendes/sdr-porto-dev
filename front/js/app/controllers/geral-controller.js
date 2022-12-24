angular.module('principal')
.controller('GeralController', ['$scope', '$document', '$location', '$window', '$filter', '$rootScope', '$localStorage', 'ProfissionalService','LoginService', 'Utils', 
	function ($scope, $document, $location, $window, $filter, $rootScope, $localStorage, ProfissionalService, LoginService, Utils) {

    $scope.$storage = $localStorage;  
    $scope.$storage.nome = "";
    $scope.$storage.is_chatting = false; 
    $scope.profissionais = [];
    $scope.temMensagem = false;
    
    $scope.models = {
        editando : false,
    };

    $scope.barramento = "";
    
    $scope.logout = function(){
        var objetoGlogal = {
            "localstorage" : null,
            "flagMostrarMenu" : false,
            "usuarioLogado" : false,
            "token" : null
        }

        $rootScope.$broadcast('topic', objetoGlogal);
        window.location = "index.html";
    }

    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active ;
    };

    $scope.chatUser = (user, element) => {
        $scope.$storage.is_chatting = true;
        $scope.$storage.chat_user = user;
        $scope.$storage.caller_foto = '../back/odontologia/public/upload/' + user.foto;

        if($scope.objeto.foto){
            $scope.$storage.destin_foto = $scope.barramento + "/upload/" + $scope.objeto.foto;
        }else{
            $scope.$storage.destin_foto = $scope.barramento + "/upload/images/faces/face33.png";
        }

        //apagar bolinha vermelha
        $(element.currentTarget).find('.temMensagem').hide();

        setTimeout(scrollDown, 1000);
    };

    var buscarFoto = function(){
        ProfissionalService.getByMail($scope.email)
        .success(function(response){
            if(response=="erro"){
                console.info("erro");
            }else{
                if(response.profissional.length>0){
                    $scope.objeto = response.profissional[0];
                    $scope.$storage.nome = $scope.objeto.nome;
                    $scope.$storage.sender_apelido = $scope.objeto.apelido;
                    $scope.objeto.nome = $scope.objeto.nome.split(' ')[0];
                }else{
                }
            }
        })
        .error(function(response){
            $scope.mensagem = "Erro ao buscar registros.";
        });
    }

    var buscarProfissionais = function(){
        ProfissionalService.getAllBySituacao('ativo')
        .success(function (response) {
            if (response.profissional.length > 0) {
                $scope.profissionais = response.profissional;
                removerUsuarioLogado();
                ordenarProfissionais();
            } else {
                Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
            }
        })
        .error(function (response) {
            Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
        });
    }

    var removerUsuarioLogado = function(){
        var emailLogado = $scope.$storage.email;
        $scope.profissionais = $scope.profissionais.filter(function(value, index, arr){ 
            return emailLogado != value.email;
        });
    }

    $scope.modalDeTrocarSenha = function(){
        swal("Digita a nova senha:", {
            content: "input",
        }).then((senha) => {
            if(senha){
                atualizarSenha(senha);
            }
        });
    }

    var atualizarSenha = function(senha){
        form = {
            'password': senha
        }

        LoginService.update(form)
        .then(function(response) {
            if(response.status == 200){
                mensagemDeSucesso("Senha atualizada com sucesso.");
            }
        }, function(reason) {
            mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
        });
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

    $scope.limparAviso = function(){
        $scope.temMensagem = false;
    }

    var tratarRecebimentosDeMensagemNoChat = function(){
        $scope.$on('chat.novaMensagem', function(evt, data) {
            var receiver = data.message.receiver.trim();
            var meuUsuario = $scope.$storage.nome.trim();
            var sender = data.message.username;
            var sender_apelido = data.message.sender_apelido.trim();
            var chatAberto = $('.chat-panel').is(':visible');
            var senderDiferente = $('.chat-panel-title').attr('data-chat-sender') != data.message.sender_apelido.trim();
            
            if(receiver == meuUsuario){
                //colocar a bolinha no icone do chat
                //mas só colocar quando vier de um usuario diferente

                if(chatAberto){
                    if(senderDiferente){
                        colocarBolinhaNoLogoDoChat();
                        colocarBolinhaNoProfissional(sender);
                        notificacaoDeMensagem(sender_apelido);
                    }
                }else{
                    colocarBolinhaNoLogoDoChat();
                    colocarBolinhaNoProfissional(sender);
                    notificacaoDeMensagem(sender_apelido);
                }
            }
        });
    }

    var colocarBolinhaNoLogoDoChat = function(){
        $scope.temMensagem = true;
    }

    var colocarBolinhaNoProfissional = function(sender){
        //colocar a bolinha no profissional que enviou a mensagem
        $('[data-chat-nome]').each(function(item){
            var nome = $( this ).attr('data-chat-nome');
            if(sender == nome){
                //achei o sender
                $(this).find('.temMensagem').show();
            }
        });
    }

    var notificacaoDeMensagem = function(sender_apelido){
        $.toast({
            heading: 'Mensagem recebida',
            text: sender_apelido + ' te enviou uma mensagem no chat.',
            showHideTransition: 'slide',
            icon: 'info',
            loaderBg: '#46c35f',
            position: 'top-right',
            hideAfter: 5000
        })
    }

    var ordenarProfissionais = function(){
        $scope.profissionais.sort((a, b) => a.apelido.localeCompare(b.apelido))
    }

    var scrollDown = () => {        
        //resolve tambem, mas vamos ver a opcao debaixo primeiro
        // var objDiv = document.getElementById("chat-panel-body");
        // objDiv.scrollTop = objDiv.scrollHeight;

        var div = document.getElementById("chat-panel-body");
        $('#' + "chat-panel-body").animate({
            scrollTop: div.scrollHeight - div.clientHeight
        }, 500);
    };

    init = function() {
        //$location.path("/clinicas");
        // $scope.nome = $scope.$storage.nome.split(' ')[0];
        $scope.email = $scope.$storage.email;
        buscarFoto();
        $scope.barramento = GLOBAL.barramento;  
        buscarProfissionais();    
        tratarRecebimentosDeMensagemNoChat();
        
        $scope.tipo = $scope.$storage.tipo;
        // console.info($scope.objeto);
    };

	init();
}]);