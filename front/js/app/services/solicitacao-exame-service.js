angular
    .module('principal')
    .factory('SolicitacaoExameService', SolicitacaoExameService);

function SolicitacaoExameService($http) {
    return {
        criarSolicitacao: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/solicitacaoExame" + "?transform=1",
                data: objeto
            })
        },

        atualizarSolicitacao: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/solicitacaoExame/" + objeto.id +"?transform=1",
                data: objeto
            })
        },

        buscarModelo: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/solicitacaoExame?filter=modelo,eq,1&transform=1"
            })
        },

        buscarTodosPorPaciente: (idPaciente) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/solicitacaoExame?filter=id_paciente,eq," + idPaciente + "&transform=1"
            })
        },
    };
}