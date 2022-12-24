angular
    .module('principal')
    .factory('AtendimentoService', AtendimentoService);

function AtendimentoService($http) {
    return {

        buscarListaOdontogramasPorListaAgendamento: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontograma?filter=agendamentoID,in," + ids + "&transform=1"
            })
        },

        buscarOdontogramaPorAtendimento: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontograma?filter=agendamentoID,eq," + id + "&transform=1"
            })
        },

        criarOdontogramaPorAtendimento: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/odontograma" + "?transform=1",
                data: objeto

            })
        },

        atualizarOdontograma: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/odontograma/" + objeto.id + "?transform=1",
                data: objeto

            })
        },

        buscarOdontogramaPorId: function (id) {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/odontograma/" + id + "?transform=1",
            })
        },

        ///////////////////////
        buscarProcedimentoPorOdontograma: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?filter=odontogramaID,eq," + id + "&transform=1"
            })
        },

        criarProcedimentoPorOdontograma: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento" + "?transform=1",
                data: objeto

            })
        },

        deleteProcedimentoPorId: function (id) {
            return $http({
                method: "DELETE",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento/" + id + "?transform=1",
            })
        },

        buscarProcedimentoPorListaId: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?filter=odontogramaID,in," + ids + "&transform=1",
            })
        },

        buscarSituacaoPorOdontograma: function (objeto) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaSituacao?filter=odontogramaID,eq," + objeto + "&transform=1"
            })
        },

        criarSituacaoPorOdontograma: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaSituacao" + "?transform=1",
                data: objeto

            })
        },

        deleteSituacaoPorId: function (id) {
            return $http({
                method: "DELETE",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaSituacao/" + id + "?transform=1",
            })
        },
        ///////////////////////

        buscarFacePorOdontograma: function (objeto) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaFaceta?filter=odontogramaID,eq," + objeto + "&transform=1"
            })
        },

        criarFacePorOdontograma: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaFaceta" + "?transform=1",
                data: objeto

            })
        },

        deleteFacePorId: function (id) {
            return $http({
                method: "DELETE",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaFaceta/" + id + "?transform=1",
            })
        },
        ///////////////////////

        buscarAtendimentoPorId: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + id + "?transform=1",
            })
        },
        //////////////////////////////

        buscarAgendamentoPorPaciente: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento?filter=pacienteID,eq," + id + "&transform=1",
            })
        },

        buscarAgendamentoPorId: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + id + "?transform=1",
            })
        },

        atualizarAgendamento: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        buscarTodosProcedimentos: function () {
            return $http({
                method: "get",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?transform=1",
            })
        },

        atualizarComentarioAgendamento: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },
        atualizarOdontogramaProcedimento: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },
        deleteOdontogramaPorId: function (id) {
            return $http({
                method: "DELETE",
                url: GLOBAL.barramentoGenericov2 + "/odontograma/" + id + "?transform=1",
            })
        },
        buscarTodosOdontogramas: function () {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontograma?transform=1",
            })
        },
    };
}