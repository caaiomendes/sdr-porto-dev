angular
.module('principal')
.factory('PlanejamentoService', PlanejamentoService);

function PlanejamentoService ($http) {
    return {

        getAll: function () {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro" + "?transform=1"
            })
        },

        getOne: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro/" + id + "?transform=1",
            })
        },

        //TODO: remover hardcode
        getAllByPacienteID: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/findPlanejamentosFinanceiros/" + id,
            })
        },

        create: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro" + "?transform=1",
                data: objeto
            })
        },

        update: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        atualizarDesconto:  function(objeto){
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro/" + objeto.planejamentoID + "?transform=1",
                data: objeto
            })
        },

        atualizarStatus:  function(objeto){
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoFinanceiro/" + objeto.planejamentoID + "?transform=1",
                data: objeto
            })
        },

        findProcedimentosByAgendamentoID: function (agendamentoID) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/findProcedimentosByAgendamentoID/" + agendamentoID,
            })
        },

        atualizarProcedimentoAtivo:  function(objeto, id){
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento/" + id + "?transform=1",
                data: objeto
            })
        },

        criarPlanejamentosBaseadosNoAgendamentoID: function (agendamentoID) {
            return $http({
                method: "POST",
                url: GLOBAL.barramento + "/api/v1/criarPlanejamentosBaseadosNoAgendamentoID/" + agendamentoID,
            })
        },

        apagarPlanejamentoPagamentosByPlanejamentoID: function(agendamentoID){
            return $http({
                method: "PUT",
                url: GLOBAL.barramento + "/api/v1/apagarPlanejamentoPagamentosByPlanejamentoID/" + agendamentoID,
            })
        },

        apagarParcela: function(objeto){
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoPagamento/" + objeto.id,
                data: objeto
            })
        },

        inserirParcela: function(objeto){
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoPagamento" + "?transform=1",
                data: objeto
            })
        },

        atualizarParcela: function(objeto){
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoPagamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        buscarParcelas: function(planejamentoID){
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/planejamentoPagamento?filter[]=planejamento_id,eq," + planejamentoID + "&filter[]=deleted_at,is&transform=1",
            })
        },

        buscarParcelasPorPlanejamentoID: function(planejamentoID){
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarParcelasPorPlanejamentoID/" + planejamentoID ,
            })
        },

        buscarProcedimentoParticularPorAgendamentoID: function(agendamentoID){
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarProcedimentoParticularPorAgendamentoID/" + agendamentoID ,
            })
        },
        
        buscarPlanejamentoAprovadoPorAgendamentoID: function(agendamentoID){
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarPlanejamentoAprovadoPorAgendamentoID/" + agendamentoID ,
            })
        },

        buscarParcelasVencidas: function(pacienteID){
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarParcelasVencidas/" + pacienteID ,
            })
        }
    };
}