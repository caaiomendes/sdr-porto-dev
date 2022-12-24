angular
.module('principal')
.factory('ArquivoClinicaService', ArquivoClinicaService);

function ArquivoClinicaService ($http) {
    return {

        getAll : function () {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica" + "?transform=1"
            })
        },

        getOne : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica/" + id + "?transform=1",
            })
        },

        getAllByClinicaID : function (id) {
            return $http({
                method : "GET",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica?filter=clinicaID,eq," + id + "&transform=1",
            })
        },

        create : function (objeto) {
            return $http({
                method : "POST",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica" + "?transform=1",
                data: objeto
            })
        },

        update : function (objeto) {
            return $http({
                method : "PUT",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        delete : function (id) {
            return $http({
                method : "DELETE",
                url : GLOBAL.barramentoGenericov2 + "/arquivo_clinica/" + id + "?transform=1"
            })
        },

        download : function (uri, name) {
            // $.ajax({
            //     url: 'index3.php?url='+GLOBAL.barramento+'/upload/' + file,
            //     type: 'GET',
            //     success: function() {
            //         window.location = 'http://sdrporto.com.br/back/odontologia/index3.php?url='+GLOBAL.barramento+'/upload/' + file;
            //     }
            // });
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
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