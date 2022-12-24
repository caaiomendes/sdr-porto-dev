angular
.module('principal')
.factory('LoginService', LoginService);

function LoginService ($q, $window, $http) {
    return {

        getToken : function () {
            return $window.sessionStorage.getItem("token");
        },

        setToken: function (token) {
            $window.sessionStorage.setItem("token", token);
        },

        login : function (form) {
            return $http({
                method : "POST",
                url : GLOBAL.barramento + "/api/v1/signin",
                data: {
                    'email': form.email,
                    'password': form.password
                }
            })
        },

        update : function (form) {
            return $http({
                method : "POST",
                url : GLOBAL.barramento + "/api/v1/update",
                data: {
                    'password': form.password
                }
            })
        },

        signup : function (form) {
            return $http({
                method : "POST",
                url : GLOBAL.barramento + "/api/v1/signup",
                data: {
                    'name': form.name,
                    'email': form.email,
                    'password': form.password,
                    'tipo': 'c'
                }
            })
        },

        validarDisponibilidade : function (form) {
            return $http({
                method : "POST",
                url : GLOBAL.barramento + "/api/v1/validarDisponibilidade",
                data: {
                    'email': form.email
                }
            })
        },

        logout : function (data) {
            $window.sessionStorage.setItem("token", "");
            $q.when();
        },

        identificarUsuarioeIP : function (form) {
            return $http({
                method: "POST",
                url: GLOBAL.barramentoGenericov2 + "/monitor" + "?transform=1",
                data: form
            })
        },

        getIP: () => {
            return $http({
                method: 'GET',
                url: "getMyIP.php"
            })
        },

        

    };
}