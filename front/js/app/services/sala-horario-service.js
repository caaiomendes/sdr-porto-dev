angular
    .module('principal')
    .factory('SalaHorarioService', SalaHorarioService);

function SalaHorarioService($http) {
    return {
        criarHorario: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/sala_horario" + "?transform=1",
                data: objeto
            })
        },

        atualizarHorario: function (objeto) {
            return $http({
                method: "PUT",
                url : GLOBAL.barramentoGenericov2 + "/sala_horario/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        buscarHorarioPorSala: function (idSala) {
            return $http({
                method: "GET",
                url: GLOBAL.barramentoGenericov2 + "/sala_horario?filter=salaID,eq," + idSala + "&transform=1",
            })
        }
    };
}