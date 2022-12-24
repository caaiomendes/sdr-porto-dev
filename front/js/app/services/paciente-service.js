angular
.module('principal')
.factory('PacienteService', PacienteService);

function PacienteService ($http) {
    return {

        //TODO: ignorando por questao de performance
        // getAll : function () {
        //     return $http({
        //         method : "GET",
        //         url : GLOBAL.barramentoGenericov2 + "/paciente" + "?transform=1"
        //     })
        // },

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/paciente" + "?transform=1"
            })
        },

        getByPage : function (page, itensPerPage) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/paciente" + "?order=nome&page="+page+","+itensPerPage+"&filter=deleted_at,is&transform=1"
            })
        },

        getByName : function (page, itensPerPage, nome) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/paciente" + "?order=nome&filter=nome,cs,"+nome+"&page="+page+","+itensPerPage+"&transform=1"
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/paciente/" + id + "?transform=1",
            })
        },

        insert : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/paciente" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/paciente/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (objeto) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/paciente/" + objeto.id + "?transform=1"
            })
        },

        validarUsuarioExistente: function(cpf){
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/paciente?filter=cpf,eq," + cpf + "&transform=1",
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