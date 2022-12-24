angular
.module('principal')
.factory('AnamneseService', AnamneseService);

function AnamneseService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/anamnese" + "?transform=1"
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/anamnese/" + id + "?transform=1",
            })
        },

        getByPacienteID : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/anamnese?filter=pacienteID,eq," + id + "&transform=1",
            })
        },

        create : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/anamnese" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/anamnese/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (id) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/anamnese/" + id + "?transform=1"
            })
        }

    };
}