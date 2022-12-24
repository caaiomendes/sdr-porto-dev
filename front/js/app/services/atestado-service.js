angular
    .module('principal')
    .factory('AtestadoService', AtestadoService);

function AtestadoService($http) {
    return {
        criarAtestado: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/atestado" + "?transform=1",
                data: objeto
            })
        },

        buscarTodos: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/atestado" + "?transform=1"
            })
        },

        buscarTodosPorPaciente: (idPaciente) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/atestado?filter=id_paciente,eq," + idPaciente + "&transform=1"
            })
        },
    };
}