angular
    .module('principal')
    .factory('SalaService', SalaService);

function SalaService($http) {
    return {

        criarSala: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/salas" + "?transform=1",
                data: objeto
            })
        },
        
        delete : function (id) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/salas/" + id + "?transform=1"
            })
        },

        atualizar: (objeto) => {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/salas/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        buscarSalasPorClinica: function (id){
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/salas?filter=clinicaId,eq,"+ id+"&transform=1"
            })
        },

        getOne: function (id){
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/salas/"+id+"?transform=1"
            })
        }
    };
}