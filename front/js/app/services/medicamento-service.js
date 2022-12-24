angular
    .module('principal')
    .factory('MedicamentoService', MedicamentoService);

function MedicamentoService($http) {
    return {
        criarMedicamento: function (objeto) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/medicamento" + "?transform=1",
                data: objeto
            })
        },

        buscarMedicamento: () => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/medicamento?transform=1"
            })
        },

        buscarMedicamentoPorPrescricao: (id) => {
            return $http({
                method: 'GET',
                url: GLOBAL.barramentoGenericov2 + "/medicamento?filter=id_prescricao,eq," + id + "&transform=1"
            })
        },

        updateMedicamento: (objeto) => {
            return $http({
                method: "PUT",
                url: GLOBAL.barramentoGenericov2 + "/medicamento/" + objeto.id + "?transform=1",
                data: objeto
            })
        },

        deleteMedicamento: (id) => {
            return $http({
                method: 'DELETE',
                url: GLOBAL.barramentoGenericov2 + "/medicamento/" + id + "?transform=1"
            })
        }
    };
}