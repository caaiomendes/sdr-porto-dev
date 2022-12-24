angular
    .module('principal')
    .factory('HistoricoService', HistoricoService);

function HistoricoService($http) {
    return {

        buscarListaOdontogramasPorAgendamento: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontograma?filter=agendamentoID,in," + ids + "&transform=1"
            })
        },

        buscarListaSituacaoPorOdontograma: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaSituacao?filter=odontogramaID,in," + ids + "&transform=1"
            })
        },

        buscarListaFacetaPorOdontograma: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaFaceta?filter=odontogramaID,in," + ids + "&transform=1"
            })
        },

        buscarListaProcedimentoPorOdontograma: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?filter=odontogramaID,in," + ids + "&transform=1"
            })
        }

    };
}