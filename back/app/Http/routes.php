<?php

use App\Conta;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => 'laravel'], function(){

	Route::get('/teste', function() {
	    return '<h1>Teste</h1>';
	});

	//Clear Cache facade value:
	Route::get('/clear-cache', function() {
	    $exitCode = Artisan::call('cache:clear');
	    return '<h1>Cache facade value cleared</h1>';
	});

	//Reoptimized class loader:
	Route::get('/optimize', function() {
	    $exitCode = Artisan::call('optimize');
	    return '<h1>Reoptimized class loader</h1>';
	});

	//Clear Route cache:
	Route::get('/route-cache', function() {
	    $exitCode = Artisan::call('route:cache');
	    return '<h1>Route cache cleared</h1>';
	});

	//Clear View cache:
	Route::get('/view-clear', function() {
	    $exitCode = Artisan::call('view:clear');
	    return '<h1>View cache cleared</h1>';
	});

	//Clear Config cache:
	Route::get('/config-cache', function() {
	    $exitCode = Artisan::call('config:cache');
	    return '<h1>Clear Config cleared</h1>';
	});
});


Route::match(array('GET', 'POST'), '/', function () {
    return view('index');
});

Route::group(['prefix' => 'api', 'middleware' => ['cors']], function() {
    
    Route::get('/', function() { 
        return view('index');
    });

    Route::group(['prefix' => 'v1'], function(){

        Route::get('/', function() { 
            return view('index');
        });
    	
	    Route::post('pusher/auth', ['uses' => 'ChatController@auth']);
	
        Route::resource('messages', 'ChatController');
        
        //generic
        Route::group(['prefix' => 'generic', 'middleware' => ['api', 'throttle:150']], function(){
            Route::get('{complemento}', ['uses' => 'GenericController@getAll']);
            Route::get('{complemento}/{id}', ['uses' => 'GenericController@getOne']);
            Route::get('{complemento}/get/mine', ['uses' => 'GenericController@getMine']);
            Route::post('{complemento}', ['uses' => 'GenericController@create']);
            Route::delete('{complemento}/{id}', ['uses' => 'GenericController@delete']);
            Route::put('{complemento}/{id}', ['uses' => 'GenericController@update']);
        });
        
        
        //authenticated routes  
    	Route::group(['prefix' => 'auth', 'middleware' => ['api', 'throttle:150']], function(){
            Route::get('user',          'JWTController@getUser');
            Route::post('user/update',  'JWTController@update');
            Route::get('online',        'JWTController@isOnline');
            Route::get('getAll',        'JWTController@getAll');
        });
        
        //not authenticated routes
        Route::post('signup', 'JWTController@signUp');
        Route::post('genpass', 'JWTController@genpass');
        Route::post('signin', 'JWTController@signIn');
        Route::post('logout', 'JWTController@logout');
        Route::post('update', 'JWTController@update');
        Route::post('validarDisponibilidade', 'JWTController@validarDisponibilidade');
        
	Route::group(['middleware' => ['throttle:150']], function(){
	        Route::post('upload', 'CustomController@upload');
	        Route::post('uploadV2', 'CustomController@uploadV2');
	        Route::get('buscarAgendamentos', 'CustomController@buscarAgendamentos');
	        Route::get('buscarAgendamentosPorPacienteID/{id}', 'CustomController@buscarAgendamentosPorPacienteID');
	        Route::get('buscarAgendamentosPorClinicaID/{id}', 'CustomController@buscarAgendamentosPorClinicaID');
	        Route::get('buscarAgendamentosPorSalaID/{id}', 'CustomController@buscarAgendamentosPorSalaID');
	        Route::get('buscarAgendamentosPorClinicaIDEProfissionalID/{clinicaID}/{profissionalID}', 'CustomController@buscarAgendamentosPorClinicaIDEProfissionalID');
	        Route::get('buscarAgendamentosPorClinicaData/{clinicaID}/{de}/{ate}', 'CustomController@buscarAgendamentosPorClinicaData');
	        Route::get('buscarAgendamentosPorSalaIDEData/{salaID}/{de}/{ate}', 'CustomController@buscarAgendamentosPorSalaIDEData');
	        Route::get('findPlanejamentosFinanceiros/{pacienteID}', 'CustomController@findPlanejamentosFinanceiros');
	        Route::get('findProcedimentosByAgendamentoID/{agendamentoID}', 'CustomController@findProcedimentosByAgendamentoID');
	        Route::post('criarPlanejamentosBaseadosNoAgendamentoID/{agendamentoID}', 'CustomController@criarPlanejamentosBaseadosNoAgendamentoID');
	        Route::put('apagarPlanejamentoPagamentosByPlanejamentoID/{planejamentoID}', 'CustomController@apagarPlanejamentoPagamentosByPlanejamentoID');
	        Route::get('buscarProcedimentoParticularPorAgendamentoID/{agendamentoID}', 'CustomController@buscarProcedimentoParticularPorAgendamentoID');
	        Route::get('buscarPlanejamentoAprovadoPorAgendamentoID/{agendamentoID}', 'CustomController@buscarPlanejamentoAprovadoPorAgendamentoID');
	        Route::get('buscarParcelasVencidas/{pacienteID}', 'CustomController@buscarParcelasVencidas');
	        Route::get('buscarProcedimentosParticularesParaApoio/{clinicaID}/{ano}/{mes}/{dentistaID}', 'CustomController@buscarProcedimentosParticularesParaApoio');
	        Route::get('buscarProcedimentosConvenioParaApoio/{clinicaID}/{ano}/{mes}/{dentistaID}', 'CustomController@buscarProcedimentosConvenioParaApoio');
	        Route::put('atualizarObservacoesDoApoioParticular/{planejamentoFinanceiroID}', 'CustomController@atualizarObservacoesDoApoioParticular');
	        Route::put('atualizarObservacoesDoApoio/{odontogramaProcedimentoID}', 'CustomController@atualizarObservacoesDoApoio');
	        Route::put('atualizarGuiaDoApoio/{odontogramaProcedimentoID}', 'CustomController@atualizarGuiaDoApoio');
	        Route::get('buscarProcedimentosParticularesPorPlanejamentoFinanceiroID/{planejamentoFinanceiroID}', 'CustomController@buscarProcedimentosParticularesPorPlanejamentoFinanceiroID');
			Route::get('buscarEntradasSaidasByIdAndData/{clinicaID}/{ano}/{mes}','CustomController@buscarEntradasSaidasByIdAndData');
			Route::get('buscarAcertosByIdAndData/{clinicaID}/{ano}/{mes}','CustomController@buscarAcertosByIdAndData');
			Route::get('buscarReembolsosDescontos/{clinicaID}/{ano}/{mes}','CustomController@buscarReembolsosDescontos');
			Route::put('salvarModalInlineAcertos/{acertoId}/{valor}/{coluna}', 'CustomController@salvarModalInlineAcertos');
			Route::post('inserirAcerto/{clinicaID}', 'CustomController@inserirAcerto');
			Route::post('inserirReembolsoDesconto/{clinicaID}', 'CustomController@inserirReembolsoDesconto');
			Route::get('buscarDetalhesAcertosParticulares/{entrada_saidaID}', 'CustomController@buscarDetalhesAcertosParticulares');
			Route::delete('deletarReembolsoDesconto/{id}', 'CustomController@deletarReembolsoDesconto');
			Route::post('criarProcedimentosPadraoParaNovasClinicas/{clinicaID}', 'CustomController@criarProcedimentosPadraoParaNovasClinicas');
	        Route::post('criarEstoquePadraoParaNovaClinica/{clinicaID}', 'CustomController@criarEstoquePadraoParaNovaClinica');
			Route::put('visaoDentista/{acertoId}', 'CustomController@visaoDentista');
	        
			//CONTROLLER FINCANCEIRO
			//TODO: migrar para esta controller os métodos da CustomController
			Route::get('buscarRecebimentosPorPeriodoEClinica/{ano}/{mes}/{clinicaID}', 'FinanceiroController@buscarRecebimentosPorPeriodoEClinica');
			Route::get('buscarParcelasPorPlanejamentoID/{planejamentoID}', 'FinanceiroController@buscarParcelasPorPlanejamentoID');
	});
        
    });
});
