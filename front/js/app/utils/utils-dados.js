angular
    .module('principal')
    .factory('Dados', Dados);

function Dados($http) {
    return {

        criarFaceDentes: function () {
            return [
                { nome: 'O/I', id: 0 },
                { nome: 'D', id: 1 },
                { nome: 'M', id: 2 },
                { nome: 'V', id: 3 },
                { nome: 'P/L', id: 4 },
            ]
        },

        formasDePagamento: function(){
            return [ 
                {"nome": "Crédito à vista", id: 1}, 
                {"nome": "Crédito parcelado", id: 2}, 
                {"nome": "Débito", id: 3}, 
                {"nome": "Dinheiro", id: 4} ,
                {"nome": "Transferência", id: 5}, 
                {"nome": "PIX", id: 6}, 
                {"nome": "Cheque", id: 7},
                {"nome": "Boleto", id: 8}
            ];
        }
    }
}