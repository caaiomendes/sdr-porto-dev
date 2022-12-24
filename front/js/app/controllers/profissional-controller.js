angular.module('principal')
    .controller('ProfissionalController', ['AuxClinicaProfissional', '$scope', '$localStorage', 'ProfissionalService', 'ClinicaService', 'LoginService', '$timeout', 'Utils',
        function (AuxClinicaProfissional, $scope, $localStorage, ProfissionalService, ClinicaService, LoginService, $timeout, Utils) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.objetos = new Object();
            $scope.flagEditando = false;
            $scope.buscado = false;
            var senhaAntiga = "";
            $scope.barramento = "";

            $scope.preencher = function () {
                $scope.objeto.created_at = "1982-07-08 00:00:00";
                $scope.objeto.updated_at = "1982-07-08 10:00:00";
                $scope.objeto.nome = "Josiane Vaz";
                $scope.objeto.foto = "2020-08-31-20-08-25.jpg";
                $scope.objeto.email = "broklin@gmail.com";
                $scope.objeto.telefone = "(11) 5141-3436";
                $scope.objeto.endereco = "Avenida das Imbaubas, 78 - Broklin - São Paulo";
                $scope.objeto.apelido = "Dr.";
                $scope.objeto.rg = "41.321.715-3";
                $scope.objeto.cpf = "305.809.118-44";
                $scope.objeto.sexo = "masculino";
                $scope.objeto.formacao = "Ortodontia";
                $scope.objeto.estadoCivils = "Casado";
                $scope.objeto.dadosBancariosBanco = "Itau";
                $scope.objeto.dadosBancariosAgencia = "3245";
                $scope.objeto.dadosBancariosConta = "12345-456";
                $scope.objeto.CRO = "123456678";
                $scope.objeto.senha = "secreta";
                $scope.objeto.localDeTrabalho = "Morumbi";
                $scope.objeto.situacao = "ativo";
                $scope.objeto.nascimento = "1982-07-08";
                $scope.objeto.tipo = "dentista";
                $scope.objeto.comissao = "10%";
            }

            var limpar = function () {
                $scope.objeto = new Object();
            }

            var prepararForm = async function () {
                await buscarRelacionamentoComClinicas()
                buscarClinicas()
            }

            async function buscarClinicas() {
                await ClinicaService.getAll().success((res) => {
                    $scope.clinica = res.clinica
                    setTimeout(estiloDosCampos, 2000);
                    $('.js-example-basic-multiple').select2();

                    if ($scope.objeto.nascimento) {
                        $scope.objeto.nascimento = Utils.converterDataUSAtoBR($scope.objeto.nascimento);
                    }
                }).error((erro) => {
                    console.info(erro)
                })
            }

            async function buscarRelacionamentoComClinicas() {
                await AuxClinicaProfissional.getByProfissional($scope.objeto.id).success(res => {
                    $scope.objeto.clinicaObjeto = res.aux_clinica_profissional;
                    $scope.objeto.clinica = res.aux_clinica_profissional.map(e => e.clinicaId);
                }).error((erro) => {
                    console.info(erro)
                })
            }

            $scope.selecionar = async function (selecionado) {
                $scope.flagEditando = true;
                $scope.objeto = selecionado;
                // setTimeout(()=>{
                    prepararForm();
                // }, 500)
            }

            $scope.voltar = function () {
                $(".js-example-basic-multiple").select2('destroy'); 
                $scope.flagEditando = false;
                $scope.getAll();
            }

            $scope.novo = async function () {
                $scope.flagEditando = true
                await prepararForm();
                limpar();
            }

            $scope.excluir = function (selecionado) {
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
                            delete2();
                        } else {

                        }
                    });
            }

            var delete2 = function () {
                ProfissionalService.delete($scope.objeto)
                    .success(function (response) {
                        if (response == 1) {
                            mensagemDeSucesso("Exclusão efetuada com sucesso.");
                            $scope.flagEditando = false;
                            $scope.getAll();

                        } else {
                            mensagemDeErro("Houve um erro ao excluir.");
                        }
                    })
                    .error(function (response) {
                        mensagemDeErro("Erro ao excluir. Entre em contato com o administrador.");
                    });
            }

            $scope.upload = function () {
                var form = $('#form')[0];
                var data = new FormData(form);

                var destino = Utils.getDateArray()[2]+"-"+Utils.getDateArray()[1];
                data.append('destino', destino);

                ProfissionalService.upload(data)
                    .done(function (response) {
                        
                        if (response.url) {
                            $scope.objeto.foto = response.url;
                            $scope.$apply();
                        } else {
                            swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                        }
                    })
                    .fail(function (response) {
                        swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                    })
            }

            $scope.salvar = async function () {
                if ($scope.objeto.nascimento) {
                    $scope.objeto.nascimento = Utils.converterDataUSAtoBR($scope.objeto.nascimento);
                }

                if ($scope.objeto.id) {
                    await atualizarProfissional();
                    await removerRelacaoClinicaProfissional($scope.objeto)
                    await criarRelacaoClinicaProfissional($scope.objeto);
                } else {
                    inserir();
                    await criarRelacaoClinicaProfissional($scope.objeto);
                }
            }

            function removerRelacaoClinicaProfissional(objeto) {
                objeto.clinicaObjeto.forEach(element => {
                    AuxClinicaProfissional.excluir(element.id).success(res => {}).error((erro) => {
                        console.info(erro)
                    })
                });
            };

            function criarRelacaoClinicaProfissional(objeto) {
                objeto.clinica.forEach(element => {
                    AuxClinicaProfissional.criar({
                        clinicaId: element,
                        profissionalId: objeto.id
                    }).success(res => {}).error((erro) => {
                        console.info(erro)
                    })
                });
            };

            $scope.modalDeTrocarSenha = function (selecionado) {
                $scope.objeto = selecionado;

                swal("Digita a nova senha:", {
                    content: "input",
                }).then((senha) => {
                    atualizarSenha(senha);
                });
            }

            var atualizarSenha = function (senha) {
                form = {
                    'name': $scope.objeto.nome,
                    'email': $scope.objeto.email,
                    'password': senha,
                    'updated_at': Utils.generateDateToDataBase()
                }

                LoginService.update(form)
                    .then(function (response) {
                        if (response.status == 200) {
                            mensagemDeSucesso("Senha atualizada com sucesso.");
                        }
                    }, function (reason) {
                        mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                    });
            }

            var atualizarProfissional = function () {
                $scope.objeto.updated_at = Utils.generateDateToDataBase();
                ProfissionalService.update($scope.objeto)
                    .success(function (response) {
                        if (response == 0) {
                            mensagemDeSucesso("Nenhuma alteração foi feita.");
                            $scope.flagEditando = false;
                            $scope.getAll();
                        } else if (response == 1) {
                            mensagemDeSucesso("Atualização efetuada com sucesso.");
                            $scope.flagEditando = false;
                            $scope.getAll();
                        } else {
                            mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                        }

                    })
                    .error(function (response) {
                        mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                    });
            }

            var inserir = function () {
                form = {
                    'name': $scope.objeto.nome,
                    'email': $scope.objeto.email,
                    'password': $scope.objeto.senha,
                    'created_at': Utils.generateDateToDataBase()
                }

                var promise = LoginService.signup(form);

                promise.then(function (greeting) {
                    criarProfissional();
                }, function (reason) {
                    mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
                });

            }

            var criarProfissional = function () {
                $scope.objeto.created_at = Utils.generateDateToDataBase();
                ProfissionalService.insert($scope.objeto)
                    .success(function (response) {
                        mensagemDeSucesso("Cadastro efetuado com sucesso!");
                        $scope.objeto.id = response;
                        $scope.flagEditando = false;
                        $scope.getAll();
                    })
                    .error(function (response) {
                        mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
                    });
            }

            $scope.getAll = function () {

                ProfissionalService.getAll()
                    .success(function (response) {
                        if (response == "erro") {
                            console.info("erro");
                        } else {
                            if (response.profissional.length > 0) {
                                $scope.objetos = response.profissional;
                                setTimeout(ordenarTabelas, 2000);
                            } else {
                                $scope.objetos = new Object();
                            }
                            $scope.buscado = true;
                        }
                    })
                    .error(function (response) {
                        $scope.mensagem = "Erro ao buscar registros.";
                        $scope.flagSemConteudo = true;
                    });
            }

            var ordenarTabelas = function () {
                $('#sortable-table-1').tablesort();
            }

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

            var estiloDosCampos = function () {
                //mascaras
                $("#cpf").inputmask("999.999.999-99");

                $("#telefone").inputmask({
                    mask: ["(99) 9999-9999", "(99) 99999-9999", ],
                    keepStatic: true
                });

                $("#email").inputmask();

                //data e time picker
                $('#datepicker-popup-nascimento').datepicker({
                    enableOnReadonly: true,
                    autoclose: true,
                    format: "dd-mm-yyyy",
                    language: "pt-BR",
                    startView: 2,
                });

                //formatacao do checkbox
                $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');
            }

            $scope.isEmpty = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }
                return true;
            };

            init = function () {
                $scope.getAll();
                $scope.barramento = GLOBAL.barramento;
            };

            init();
        }
    ]);