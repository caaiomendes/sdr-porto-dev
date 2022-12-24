angular.module('principal')
    .controller('ArquivoClinicaController', ['$scope', '$localStorage', 'ArquivoClinicaService', '$timeout', '$filter', 'Utils',
        function ($scope, $localStorage, ArquivoClinicaService, $timeout, $filter, Utils) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.objetos = new Object();
            $scope.flagEditando = false;
            $scope.local = new Object();

            $scope.preencher = function () {
                $scope.objeto.pacienteID = "1";
                $scope.objeto.tipo = "radiografia";
                $scope.objeto.nome = "Radiografia XYZ";
                $scope.objeto.url = "2020-10-06-04-17-36.jpg";
                $scope.objeto.descricao = "Nova radiografia dos dentes";
            }

            $scope.novo = function () {
                $scope.flagEditando = true;
                limpar();
            }

            var limpar = function () {
                $scope.objeto = new Object();
            }

            $scope.selecionar = function (selecionado) {
                $scope.objeto = selecionado;
                $scope.flagEditando = true;
            }

            $scope.voltar = function () {
                $scope.flagEditando = false;
                $scope.getAll();
            }

            $scope.getAllByClinicaID = function () {
                let clinica = JSON.parse(localStorage.getItem('ngStorage-clinica'))
                if(clinica)
                ArquivoClinicaService.getAllByClinicaID(clinica.id)
                .success(function(response){
                    if(response=="erro"){
                        console.info("erro");
                    }else{
                        if(response.arquivo_clinica.length>0){
                            $scope.objetos = response.arquivo_clinica;
                            tratarResposta();
                        }else{
                            $scope.objetos = new Object();
                        }

                        $scope.buscado = true;
                    }
                })
                .error(function(response){
                    $scope.mensagem = "Erro ao buscar registros.";
                    $scope.flagSemConteudo = true;
                });
            }

            var tratarResposta = function () {
                for (i = 0; i < $scope.objetos.length; i++) {
                    $scope.objetos[i].urlImagem = urlEhImagem($scope.objetos[i].url);
                }
            }

            $scope.upload = function () {
                var form = $('#form-arquivos')[0];
                var data = new FormData(form);

                var destino = Utils.getDateArray()[2] + "-" + Utils.getDateArray()[1];
                data.append('destino', destino);

                ArquivoClinicaService.upload(data)
                    .done(function (response) {
                        if (response.url) {
                            $scope.objeto.url = response.url;
                            $scope.objeto.urlImagem = urlEhImagem(response.url);
                            $scope.$apply();
                        } else {
                            swal('Não foi possível salvar, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                        }
                    })
                    .fail(function (response) {
                        swal('Não foi possível salvar, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                    })
            }

            var urlEhImagem = function (url) {
                var pedacos = url.trim().split(".");
                if (pedacos[1] == "jpg" || pedacos[1] == "jpeg" || pedacos[1] == "png") {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.salvar = function () {
                let clinica = JSON.parse(localStorage.getItem('ngStorage-clinica'))
                $scope.objeto.clinicaID = clinica.id;
                $scope.objeto.updated_at = Utils.generateDateToDataBase();

                if ($scope.objeto.id) {
                    ArquivoClinicaService.update($scope.objeto)
                        .success(function (response) {
                            if (response) {
                                mensagemDeSucesso("Atualização efetuada com sucesso.");
                                $scope.flagEditando = false;
                                $scope.getAllByClinicaID();
                            } else {
                                mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                            }
                        })
                        .error(function (response) {
                            mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                        });
                } else {
                    $scope.objeto.created_at = Utils.generateDateToDataBase();
                    ArquivoClinicaService.create($scope.objeto)
                        .success(function (response) {
                            mensagemDeSucesso("Cadastro efetuado com sucesso!");
                            $scope.objeto.id = response;
                            $scope.flagEditando = false;
                            $scope.getAllByClinicaID();
                        })
                        .error(function (response) {
                            mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
                        });
                }
            }

            // $scope.getOne = function(pacienteID){
            //     ArquivoClinicaService.getByPacienteID(pacienteID)
            //     .success(function(response){
            //         if(response && response.anamnese && response.anamnese.length != 0){
            //             $scope.objeto = response.anamnese[0]; 
            //         }
            //     })
            //     .error(function(response){
            //         mensagemDeErro("Erro ao buscar dados da Anamnese.");
            //     });
            // }

            var mensagemDeSucesso = function (mensagem) {
                swal({
                    title: 'Aviso!',
                    text: mensagem,
                    timer: 3000,
                    icon: "success",
                    button: false
                }).then(
                    function () {},
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                )
            }

            var mensagemDeErro = function (mensagem) {
                swal({
                    title: 'Aviso!',
                    text: mensagem,
                    timer: 3000,
                    icon: "error",
                    button: false
                }).then(
                    function () {},
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                )
            }

            $scope.excluirConfirmacao = function (selecionado) {
                $scope.objeto = selecionado;
                swal({
                        title: "Tem certeza?",
                        text: "Deseja realmente apagar este item?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                        buttons: {
                            confirm: {
                                text: 'Sim'
                            },
                            cancel: 'Não'
                        },
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            excluir();
                        } else {

                        }
                    });
            }

            var excluir = function () {
                ArquivoClinicaService.delete($scope.objeto.id)
                    .success(function (response) {
                        if (response == 1) {
                            mensagemDeSucesso("Exclusão efetuada com sucesso.");
                            $scope.flagEditando = false;
                            $scope.getAllByPacienteID();

                        } else {
                            mensagemDeErro("Houve um erro ao excluir.");
                        }
                    })
                    .error(function (response) {
                        mensagemDeErro("Erro ao excluir. Entre em contato com o administrador.");
                    });
            }

            $scope.abrirImagem = function (imageURL) {
                swal({
                    icon: GLOBAL.barramento + "/upload/" + imageURL,
                });
            }

            $scope.download = function (file) {
                ArquivoClinicaService.download(GLOBAL.barramentoDownload + "/" + file.url.trim(), file.url.trim());
            }

            init = function () {
                $scope.getAllByClinicaID();
            };

            init();
        }
    ]);