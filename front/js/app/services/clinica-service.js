angular
.module('principal')
.factory('ClinicaService', ClinicaService);

function ClinicaService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/clinica" + "?order=nome&transform=1&"
            })
        },

        getOne : function (objeto) {
            let id = objeto.id ? objeto.id : objeto
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/clinica/" + id + "?transform=1",
            })
        },

        insert : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/clinica" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/clinica/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        getListById: function (ids) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/clinica?filter=id,in," + ids + "&transform=1",
            })
        },

        delete : function (objeto) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/clinica/" + objeto.id + "?transform=1"
            })
        },

        upload : function(data) {
            return $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: GLOBAL.barramento + "/api/v1/upload",
                data: data,
                processData: false, // impedir que o jQuery tranforma a "data" em querystring
                contentType: false, // desabilitar o cabecalho "Content-Type"
                cache: false, // desabilitar o "cache"
                timeout: 600000, // definir um tempo limite (opcional)
                // manipular o sucesso da requisicao
                success: function (data) {
                    //console.log(data);
                    // reativar o botAo de "submit"
                },
                // manipular erros da requisicao
                error: function (e) {
                    console.log(e);
                    // reativar o botao de "submit"
                }
            });
        }

    };
}