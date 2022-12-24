angular
.module('principal')
.factory('AcertosService', AcertosService);

function AcertosService ($http) {
    return {

        buscarAcertosByIdAndData  : function (clinicaID, ano, mes) {
            return $http({
                method : "GET",
                url: GLOBAL.barramento + "/api/v1/buscarAcertosByIdAndData/" + clinicaID + "/"+ano+"/"+mes,
            })
        },

        buscarReembolsosDescontos  : function (clinicaID, ano, mes) {
            return $http({
                method : "GET",
                url: GLOBAL.barramento + "/api/v1/buscarReembolsosDescontos/" + clinicaID + "/"+ano+"/"+mes,
            })
        },

        salvarModalInline  : function (id,valor, coluna) {
            return $http({
                method : "PUT",
                url: GLOBAL.barramento + "/api/v1/salvarModalInlineAcertos/" + id + "/"+valor+"/"+coluna,
            })
        },

        inserirAcerto  : function(item,clinicaID){
            return $http({
                method : "POST",
                url: GLOBAL.barramento + "/api/v1/inserirAcerto/" + clinicaID,
                data: {
                    'data'  : item.dataAcerto,
                    'valor' : item.valor == null ? item.valorAcertos : item.valor,
                    'guia'  : item.guia,
                    'tipo'      : item.tipo,
                    'procedimentoID' : item.procedimentoID == null ? item.origem + '(Incluido Manualmente)' : item.procedimentoID,
                    'comissao' : item.dentistaComissao,
                    'pacienteID' : item.pacienteID,
                    'status' : item.statusAcerto,
                    'profissionalID' : item.dentistaID == null ? item.dentistaExecutorID : item.dentistaID,
                    'forma' : item.formaPagamento == null ? item.forma : item.formaPagamento,
                    'idTabela' : item.odontogramaProcedimentoID == null ? item.entradaSaidaID : item.odontogramaProcedimentoID,
                }
            })
        },

        inserirReembolsoDesconto  : function(clinicaID,profissionalID,objeto){
            return $http({
                method : "POST",
                url: GLOBAL.barramento + "/api/v1/inserirReembolsoDesconto/" + clinicaID,
                data: {
                    'data'  : objeto.data,
                    'valor' : objeto.valor,
                    'motivo'  : objeto.motivo,
                    'profissionalID'      : profissionalID,
                    'nome' : objeto.nome,
                    'comissao' : objeto.comissao,
                    'tipo' : objeto.tipo
                }
            })
        },
        deletarReembolsoDesconto  : function(id){
            return $http({
                method : "DELETE",
                url: GLOBAL.barramento + "/api/v1/deletarReembolsoDesconto/" + id,
            })
        },

        visaoDentista  : function(id,acao,tabela){
            return $http({
                method : "PUT",
                url: GLOBAL.barramento + "/api/v1/visaoDentista/" + id,
                data: {
                    'tabela'  : tabela,
                    'acao' : acao
                }
            })
        },

        buscarDetalhesAcertosParticulares  : function(entrada_saidaID){
            return $http({
                method : "GET",
                url: GLOBAL.barramento + "/api/v1/buscarDetalhesAcertosParticulares/" + entrada_saidaID,
            })
        },
    };
}