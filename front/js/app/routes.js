angular.module('principal') 
.config(function($routeProvider) {
	
	$routeProvider
	// .when('/', {
	// 	templateUrl : "administrador.html",
	// 	controller: 'GeralController'
	// })
	.when('/clinicas', {
		templateUrl : "views/admin-clinicas.html",
		controller: 'ClinicaController'
	})
	.when('/inicio', {
		templateUrl : "views/inicio.html",
		controller: 'GeralController'
	})
	.when('/profissionais', {
		templateUrl : "views/admin-profissionais.html",
		controller: 'ProfissionalController'
	})
	.when('/procedimentos', {
		templateUrl : "views/admin-procedimentos.html",
		controller: 'ProcedimentoController'
	})
	.when('/encaminhamentos', {
		templateUrl : "views/admin-encaminhamentos.html",
		controller: 'EncaminhamentoController'
	})
	.when('/pacientes', {
		templateUrl : "views/admin-pacientes.html",
		controller: 'PacienteController'
	})
	.when('/agenda', {
		templateUrl : "views/agenda.html",
		controller: 'DentistaController'
	})
	.when('/clinicas-escolha', {
		templateUrl : "views/clinicas-escolha.html",
		controller: 'ClinicaController'
	})
	.when('/apoio', {
		templateUrl : "views/apoio.html",
		controller: 'ApoioController'
	})
	.when('/entradas-saidas', {
		templateUrl : "views/entradas-saidas.html",
		controller: 'EntradasSaidasController'
	})
	.when('/admin-acertos', {
		templateUrl : "views/admin-acertos.html",
		controller: 'AcertosController'
	})
	.when('/dentista-acertos', {
		templateUrl : "views/dentista-acertos.html",
		controller: 'AcertosController'
	})
	.when('/estoque', {
		templateUrl : "views/estoque-interna.html",
		controller: 'EstoqueController'
	})
	.when('/404', {
		templateUrl : "views/404.html"
	})
	.otherwise( {
		templateUrl: 'views/404.html'
	});

});