angular
.module('principal')
.factory('ApoioService', ApoioService);

function ApoioService ($http) {
    return {

        buscarProcedimentosParticularesParaApoio : function (clinicaID, ano, mes, dentistaID) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoAPI + "/buscarProcedimentosParticularesParaApoio/"+clinicaID+"/"+ano+"/"+mes+"/"+dentistaID
            })
        },

        buscarProcedimentosConvenioParaApoio : function (clinicaID, ano, mes, dentistaID) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoAPI + "/buscarProcedimentosConvenioParaApoio/"+clinicaID+"/"+ano+"/"+mes+"/"+dentistaID
            })
        },

        atualizarObservacoesDoApoio : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoAPI + "/atualizarObservacoesDoApoio/"+objeto.odontogramaProcedimentoID,
                data: objeto
            })
        },

        atualizarObservacoesDoApoioParticular : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoAPI + "/atualizarObservacoesDoApoioParticular/"+objeto.planejamentoFinanceiroID,
                data: objeto
            })
        },

        atualizarGuiaDoApoio : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoAPI + "/atualizarGuiaDoApoio/"+objeto.odontogramaProcedimentoID,
                data: objeto
            })
        },

        buscarProcedimentosParticularesPorPlanejamentoFinanceiroID : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoAPI + "/buscarProcedimentosParticularesPorPlanejamentoFinanceiroID/"+id,
            })
        },
    };
}