angular.module('principal')
.config(function($httpProvider, $provide) {

	//todo: habilitando cache por enquanto, por questao de performance
	$provide.factory('preventTemplateCache', function($injector) {
		return {
		  'request': function(config) {
		    if (config.url.indexOf('views') !== -1) {
		      config.url = config.url + '?t=' + Math.random();
		    }
		    return config;
		  }
		}
	})


	$provide.factory('TokenHttpInterceptor', function($q, $location, $localStorage, $injector) {
	return {
	    request : function(config) {
	        var apiPattern = /\/public\//;

	        config.params = config.params || {};

	        if ($localStorage.token && apiPattern.test(config.url)) {
	            config.params.token = $localStorage.token;
	        }
	        return config || $q.when(config);
	    },

	    response: function(response){
            if(response.data && response.data.message && (response.data.message=="Token has expired" || response.data.message=="Faça login novamente")){
                swal("Sessão encerrada, entre novamente para continuar acessando o sistema.")
				.then((value) => {
					window.location = "index.html";
				});
            }
	    	return response;
	    },

	    responseError: function (response) {
			if(response.data && response.data.message && (response.data.message=="Token has expired" || response.data.message=="Faça login novamente")){
				swal("Sessão encerrada, entre novamente para continuar acessando o sistema.")
				.then((value) => {
					window.location = "index.html";
				});
            }
	    	return $q.reject(response);
        }

	  };
	});

	$httpProvider.interceptors.push('TokenHttpInterceptor');
	$httpProvider.interceptors.push('preventTemplateCache');
})