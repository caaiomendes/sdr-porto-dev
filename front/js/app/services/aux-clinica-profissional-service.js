angular
    .module('principal')
    .factory('AuxClinicaProfissional', AuxClinicaProfissional);

function AuxClinicaProfissional($http) {
    return {

        criar: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/aux_clinica_profissional" + "?transform=1",
                data: objeto
            })
        },

        excluir: function (id) {
            return $http({
                method: "DELETE",
                url: GLOBAL.barramentoGenericov2 + "/aux_clinica_profissional/" + id + "?transform=1",
            })
        },

        getByIdRelationProfissional(id){
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/aux_clinica_profissional?filter=profissionalId,eq," + id + "&transform=1",
            })
        },

        getByProfissional: function (id) {
            return $http({
                method: "get",
                url: GLOBAL.barramentoGenericov2 + "/aux_clinica_profissional?filter=profissionalId,eq," + id + "&transform=1",
            })
        },

        getByClinica: function (id) {
            return $http({
                method: "get",
                url: GLOBAL.barramentoGenericov2 + "/aux_clinica_profissional?filter=clinicaId,eq," + id + "&transform=1",
            })
        },
    };
}