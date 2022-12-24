angular
.module('principal')
.factory('EstoqueService', EstoqueService);

function EstoqueService ($http) {
    return {

        getAll : function (clinicaID) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/estoque" + "?transform=1&filter=clinicaID,eq," + clinicaID
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/estoque/" + id + "?transform=1",
            })
        },

        create : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/estoque" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/estoque/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (id) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/estoque/" + id + "?transform=1"
            })
        },

        criarEstoquePadraoParaNovaClinica : function (clinicaID) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoAPI + "/criarEstoquePadraoParaNovaClinica/" + clinicaID
            })
        },

    };
}