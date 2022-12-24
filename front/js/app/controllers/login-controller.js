angular.module('principal')
.controller('LoginController', ['$scope', '$document', '$location', '$window', '$filter', 'LoginService', '$rootScope', '$localStorage','$rootScope', 'ProfissionalService','$q', 'Utils',
	function ($scope, $document, $location, $window, $filter, LoginService, $rootScope, $localStorage, $rootScope, ProfissionalService, $q, Utils) {

    $scope.temErro = false;
    $scope.mensagem = "";
    $scope.form = new Object();
    $scope.$storage = $localStorage;
    $scope.flagMostrarLogin = true;

    var preencher = function(){
        $scope.form = {
            "name": "",
            "email": "",
            "password": ""
        };
    }

    // $scope.solicitar = function(){
    // 	console.info("solicitando para:");
    // 	console.info($scope.form);

    // 	LoginService.validarDisponibilidade($scope.form)
    //     .success(function(response, status){
    //         if(status == 406){
    //             console.info("Usuário não disponível");
                
    //             gtag('event', 'login', {
    //                 'event_category' : 'cadastro-indisponivel',
    //                 'event_label' : $scope.form.name
    //             });
    //     	}else if(status ==200){
    //     		cadastrar();
    //     	}else{
    //             console.info("Ouve um erro ao tentar validar disponibilidade. Entre em contato com o Administrador");    
    //         }
    //     })
    //     .error(function(response){
        	
    //     	console.info(response);
    //         console.info("Usuário indisponível:");
    //     });
    // }

    // var cadastrar = function(){

    // 	//validar email

    // 	//validar usuario
    // 	LoginService.signup($scope.form)
    //     .success(function(response, status){
    // 		//console.info("Cadastro efetuado com sucesso, a partir de agora você pode entrar com seu email e senha.");
    //         $scope.flagMostrarLogin = true;
    //         $scope.login();
            
    //         gtag('event', 'login', {
    //             'event_category' : 'cadastro',
    //             'event_label' : $scope.form.name
    //         });
    //     })
    //     .error(function(response){
    //         console.info("Erro ao solicitar cadastro");

    //         gtag('event', 'login', {
    //             'event_category' : 'cadastro-erro',
    //             'event_label' : $scope.form.name
    //         });
    //     });
    // }

    $scope.login = function(){
        LoginService.login($scope.form)
        .success(function(response){

            //TODO: nao era pra ser assim, erro de login tinha que cair em error...
            if(response.status=="error"){
                console.info("Houve um problema ao tentar fazer o login.");
            }else{
                $scope.nome = response.user.name;
                $scope.tipo = response.user.tipo;
                $scope.email = response.user.email;
                $localStorage.nome = response.user.name;
                $localStorage.token = response.token;
                $localStorage.tipo = response.user.tipo;
                $localStorage.user_id = response.user.id;
                $localStorage.email = response.user.email;
                $scope.temErro = false;
                $scope.$storage.usuarioLogado = true;
                
                var objetoGlogal = {
                	"localstorage" : $localStorage,
                	"flagMostrarMenu" : true
                }

                $rootScope.$broadcast('topic', objetoGlogal);

                var promessa = buscarDadosDoProfissional(response.user.email);

                promessa.then(function(tipo) {
                    $scope.$storage.tipo = tipo;

                    var form = {
                        user_id: response.user.id,
                        ip: $scope.ip,
                        email: response.user.email,
                        descricao: response.user.name,
                        created_at:  Utils.generateDateToDataBase()
                    }
                    LoginService.identificarUsuarioeIP(form)
                    .success(function(response){
                        console.info("Monitor - Success");
                        direcionar(tipo);
                    }, function(response) {
                        console.info("Monitor - Fail");
                    });
                    
                    
                }, function(reason) {
                    apresentarMensagem();
                });

                
            }

        })
        .error(function(response){
            $scope.$storage.usuarioLogado = false;
            $scope.temErro = true;
            apresentarMensagem();
        });
    }

    var direcionar = function(tipo){
        if(tipo=="administrador"){
            window.location = "administrador.html#/inicio";
        }else if(tipo=="dentista"){
            window.location = "base.html#/clinicas-escolha";
        }else if(tipo=="secretaria"){
            // window.location = "secretaria.html#/secretaria";
            window.location = "base.html#/clinicas-escolha";
        }else{
            swal({
                title: "Erro ao identificar tipo de usuário :(", 
                text: "Entre em contato com o Administrador.",
                icon: "error",
                className: "mensagem",
                dangerMode: true
            });
            window.location = "index.html";
        }
    }

    var buscarDadosDoProfissional = function(email){

        return $q(function(resolve, reject) {
            ProfissionalService.getByMail(email)
            .success(function(response){
                $scope.$storage.dentistaID = response.profissional[0].id;
                resolve(response.profissional[0].tipo);
            })
            .error(function(response){ 
                reject('erro');
            })
        });
    }

    var limparDadosDeLogin = function(){

     	var objetoGlogal = {
        	"localstorage" : null,
        	"flagMostrarMenu" : null
        }

        $rootScope.$broadcast('topic', objetoGlogal);
        localStorage.setItem("abrirImpressao", false);
    }

    var apresentarMensagem = function(){
        swal({
            title: "Erro ao fazer login :(", 
            text: "Verifique o preenchimento, se o erro persistir entre em contato com o Administrador.",
            icon: "error",
            className: "mensagem",
            dangerMode: true
        });

        // swal({
        //     title: 'Erro ao fazer login',
        //     content: {
        //         element: "p",
        //         attributes: {
        //           class: 'form-control',
        //           val: 'Verifique o preenchimento, se o erro persistir entre em contato com o Administrador.'
        //         },
        //       },
        //     icon: 'warning',
        //     button: {
        //         text: "OK",
        //         value: true,
        //         visible: true,
        //         className: "btn btn-primary"
        //     }
        // }).then(
        //     function() {},
        //     // handling the promise rejection
        //     function(dismiss) {
        //         if (dismiss === 'timer') {
        //             // console.log('I was closed by the timer')
        //         }
        //     }
        // )
    }

    var buscarIP = function(){
        LoginService.getIP()
        .success(function(response){
            // console.info("Monitor - IP - Success");
            $scope.ip = response;
            
        }, function(response) {
            $scope.ip = response;
            console.info("Monitor - IP - Fail");
        });
    }

    init = function() {
        limparDadosDeLogin();
        buscarIP();
        preencher();
    };

	init();
}]);