angular
    .module('principal')
    .factory('TimbradoService', TimbradoService);

function TimbradoService($http) {
    return {
        criarTimbrado: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/timbrado" + "?transform=1",
                data: objeto
            })
        },

        buscarTodos: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/timbrado" + "?transform=1"
            })
        },

        buscarTodosPorPaciente: (idPaciente) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/timbrado?filter=id_paciente,eq," + idPaciente + "&transform=1"
            })
        },
    };
}