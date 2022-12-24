angular
.module('principal')
.factory('EntradaSaidaService', EntradaSaidaService);

function EntradaSaidaService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/entradas_saidas?transform=1"
            })
        },

        buscarEntradasSaidasByIdAndData : function (clinicaID, ano, mes) {
            return $http({
                method : "GET",
                url: GLOBAL.barramento + "/api/v1/buscarEntradasSaidasByIdAndData/" + clinicaID + "/"+ano+"/"+mes,
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/entradas_saidas/"+id+"?transform=1"
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/entradas_saidas/"+objeto.id,
                data: objeto
            })
        },

        create : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/entradas_saidas",
                data: objeto
            })
        },

        delete : function (id) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/entradas_saidas/"+id,
            })
        },

        buscarRecebimentosPorPeriodoEClinica: function(ano, mes, clinicaID) {
            return $http({
                method : "GET",
                url: GLOBAL.barramento + "/api/v1/buscarRecebimentosPorPeriodoEClinica/" + ano + "/" + mes + "/" + clinicaID
            })
        }
    };
}