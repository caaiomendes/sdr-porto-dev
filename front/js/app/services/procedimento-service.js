angular
.module('principal')
.factory('ProcedimentoService', ProcedimentoService);

function ProcedimentoService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/procedimento" + "?transform=1"
            })
        },

        getOne : function (objeto) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/procedimento/" + objeto.id + "?transform=1",
            })
        },

        //Nao faz mais sentido usar este, pois cada clinica deve buscar o seu
        // getByStatus : function (objeto) {
        //     return $http({
        //         method : "GET",
        //         url : GLOBAL.barramentoGenericov2 + "/procedimento?filter=status,eq,SIM&transform=1",
        //     })
        // },

        getByStatusAndClinica : function (clinicaId) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/procedimento?filter[]=status,eq,SIM" + "&filter[]=clinicaId,eq," + clinicaId + "&transform=1",
            })
        },
        
        getByClinica : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/procedimento?filter=clinicaId,eq,"+id+"&transform=1",
            })
        },

        insert : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/procedimento" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/procedimento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (objeto) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/procedimento/" + objeto.id + "?transform=1"
            })
        },

        criarProcedimentosPadraoParaNovasClinicas: function(clinicaID) {
            return $http({
                method: "POST",
                url: GLOBAL.barramento + "/api/v1/criarProcedimentosPadraoParaNovasClinicas/" + clinicaID ,
            })
        }
        
    };
}