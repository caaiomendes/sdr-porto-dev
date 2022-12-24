angular
    .module('principal')
    .factory('PrescricaoService', PrescricaoService);

function PrescricaoService($http) {
    return {
        criarPrescricao: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/prescricao" + "?transform=1",
                data: objeto
            })
        },

        buscarTodosPorPaciente: (id) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/prescricao?filter=id_paciente,eq,"+ id+"&transform=1"
            })
        },

        buscarModelo: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/prescricao?filter=modelo,eq,1&transform=1"
            })
        },

        updateModelo: (objeto) => {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/prescricao/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        deleteModelo: (id) => {
            return $http({
                method: 'DELETE',
                url : GLOBAL.barramentoGenericov2 + "/prescricao/" + id + "?transform=1"
            })
        }
    };
}