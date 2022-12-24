angular
.module('principal')
.factory('ProfissionalService', ProfissionalService);

function ProfissionalService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional" + "?transform=1"
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional/" + id + "?transform=1",
            })
        },
        
        getByMail : function (email) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional?filter=email,eq," + email + "&transform=1",
            })
        },

        getBySituacao : function (situacao) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional?filter[]=situacao,eq," + situacao + "&filter[]=tipo,eq,dentista&satisfy=all&transform=1",
            })
        },

        getAllBySituacao : function (situacao) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional?filter[]=situacao,eq," + situacao + "&transform=1",
            })
        },

        getByList : function (situacao, idsClinica) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/profissional?filter=id,in,"+idsClinica+"&transform=1",
            })
        },

        insert : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/profissional" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/profissional/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (objeto) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/profissional/" + objeto.id + "?transform=1"
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