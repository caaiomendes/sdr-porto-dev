angular
    .module('principal')
    .factory('ExameService', ExameService);

function ExameService($http) {
    return {
        criarExame: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/exame" + "?transform=1",
                data: objeto
            })
        },

        buscarExames: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/exame?transform=1"
            })
        },

        buscarExamesPorSolicitação: (id_solicitacaoExame) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/exame?filter=id_solicitacaoExame,eq," + id_solicitacaoExame + "&transform=1"
            })
        },

        atualizarExame: function (objeto) {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/exame/" + objeto.id +"?transform=1",
                data: objeto
            })
        }
    };
}