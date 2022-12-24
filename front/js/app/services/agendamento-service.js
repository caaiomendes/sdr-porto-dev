angular
    .module('principal')
    .factory('AgendamentoService', AgendamentoService);

function AgendamentoService($http, Utils) {
    return {

        getAll1: function () {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento" + "?transform=1"
            })
        },

        getAll: function () {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAgendamentos"
            })
        },

        buscarAgendamentosPorPacienteID: function (pacienteID) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAgendamentosPorPacienteID/" + pacienteID
            })
        },

        buscarAgendamentosPorClinicaIDEProfissionalID: function (clinicaId, profissionalId) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAgendamentosPorClinicaIDEProfissionalID/" + clinicaId + "/" + profissionalId
            })
        },

        buscarAgendamentosPorClinicaID: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAgendamentosPorClinicaID/" + id
            })
        },

        buscarAgendamentosPorSalaID: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAgendamentosPorSalaID/" + id
            })
        },

        getAllByPacienteID: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento?filter=pacienteID,eq," + id + "&transform=1",
            })
        },

        getAllByProfissionalID: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento?filter[]=profissionalID,eq," + id + "&filter[]=deleted_at,is&transform=1",
            })
        },

        getOne: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + id + "?transform=1",
            })
        },

        create: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/agendamento" + "?transform=1",
                data: objeto
            })
        },

        update: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/agendamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        }

    };
}
