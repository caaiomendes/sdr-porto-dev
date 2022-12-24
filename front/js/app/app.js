var myApp = angular.module('principal',['ngStorage', 'ngRoute', 'pusher-angular', 'luegg.directives']);

var host = window.location.origin;

if(host == "http://127.0.0.1:1111"){
    host = "https://homologacao.sdrporto.com.br";
}

var GLOBAL = {
    barramento : host + "/back/odontologia/public",
    barramentoAPI : host + "/back/odontologia/public/api/v1", //essa é a ideal
    barramentoGenericov2 : host + "/back/odontologia/public/api/v1/generic", //rota com validacao de token
    barramentoDownload : host + "/back/odontologia/public/upload"
}