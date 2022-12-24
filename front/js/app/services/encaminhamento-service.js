angular
    .module('principal')
    .factory('EncaminhamentoService', EncaminhamentoService);

function EncaminhamentoService($http) {
    return {

        getByDentista: function (id) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?filter=dentistaID,eq," + id + "&transform=1"
            })
        },

        getByClinica: function (ids) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento?filter=clinicaID,in," + ids + "&transform=1"
            })
        },

        getAll: function () {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/odontogramaProcedimento"+"?transform=1"
            })
        },
    };
}