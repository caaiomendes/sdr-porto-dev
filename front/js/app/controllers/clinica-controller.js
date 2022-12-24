angular.module('principal')
    .controller('ClinicaController', ['ProcedimentoService', '$scope', '$localStorage', 'ClinicaService', 'SalaService', 'Utils', 'AuxClinicaProfissional', 'ProfissionalService', 'EstoqueService',
        function (ProcedimentoService, $scope, $localStorage, ClinicaService, SalaService, Utils, AuxClinicaProfissional, ProfissionalService, EstoqueService) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.objetos = new Object();
            $scope.flagEditando = false;
            $scope.barramento = "";
            $scope.cores = Utils.gerarCores();
            $scope.salas = new Array();
            $scope.listarClinicas = new Array();
            $scope.objetoSala = {
                cor: "#A52A2A"
            }

            $scope.preencher = function () {
                $scope.objeto.created_at = "0000-00-00 00:00:00";

                $scope.buscado = false;
                $scope.objeto.updated_at = "0000-00-00 00:00:00";
                $scope.objeto.nome = "Broklin";
                $scope.objeto.logo = "2020-03-04-13-40-39.jpg";
                $scope.objeto.email = "broklin@gmail.com";
                $scope.objeto.telefone = "(11) 5141-3436";
                $scope.objeto.endereco = "Avenida das Imbaubas, 78 - Broklin - São Paulo";
                $scope.objeto.horarioInicio = "8:00";
                $scope.objeto.horarioFim = "17:00";
                $scope.objeto.cnpj = "12.324.323.0001-34";
            }

            var prepararTabs = function () {
                $('.nav-tabs a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                })
            }

            $scope.atualizarSala = () => {
                $scope.objetoSala['updated_at'] = Utils.generateDateToDataBase();
                SalaService.atualizar($scope.objetoSala).success((res) => {
                    $scope.closeModalSala();
                })
            }

            $scope.getBoxBackgroundColor = (item) => {
                return item
            }

            $scope.closeModalSala = () => {
                $('#modalNovoConsultorio').modal('toggle');
            }

            $scope.editarSala = (item) => {
                $scope.objetoSala = item;
                $('#modalNovoConsultorio').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }


            $scope.criarSala = async (id) => {
                if ($scope.clinica || id) {
                    $scope.objetoSala['clinicaId'] = $scope.clinica ? $scope.clinica.id : id
                    $scope.objetoSala['created_at'] = Utils.generateDateToDataBase();
                    await SalaService.criarSala($scope.objetoSala).success(async (res) => {
                        if (res) {
                            await $scope.buscarSalas($scope.clinica ? $scope.clinica.id : id)
                        } else {
                            swal('Não foi possível salvar esse item, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                        }
                    })
                } else {
                    var verifyItem = $scope.salas.map(function (item) {
                        return item.nome;
                    }).indexOf($scope.objetoSala.nome);
                    if (verifyItem == -1) {
                        $scope.salas.push($scope.objetoSala);
                    } else {
                        swal('Já existe uma sala com esse nome para essa clínica');
                    }
                }
                $scope.closeModalSala();
            }

            function criarSalaParaNovasClinicas(idClinica) {
                $scope.salas.forEach(async (el) => {
                    el['clinicaId'] = idClinica;
                    el['created_at'] = Utils.generateDateToDataBase();
                    await SalaService.criarSala(el).success(async (res) => {})
                });
                $scope.closeModalSala();
            }

            async function criarProcedimentosPadraoParaNovasClinicas(id) {
                await ProcedimentoService.criarProcedimentosPadraoParaNovasClinicas(id).success((res) => {
                    if(res.trim()=="ok"){
                        mensagemDeSucesso(
                            `Cadastro da clínica efetuado com sucesso!`
                        )
                    }else{
                        mensagemDeErro(
                            `Houve algum problema no cadastro da nova clínica, entre em contato com o Administrador!`
                        )
                    }
                })
            }

            async function criarEstoquePadraoParaNovaClinica(id) {
                await EstoqueService.criarEstoquePadraoParaNovaClinica(id).success((res) => {
                    if(res.trim()=="ok"){
                        
                    }else{
                        mensagemDeErro(
                            `Houve algum problema na geração de estoque da nova clínica, entre em contato com o Administrador!`
                        )
                    }
                })
            }

            $scope.excluirSala = (item) => {
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
                            if (item.id) {
                                SalaService.delete(item.id).success(async (res) => {
                                    await $scope.buscarSalas($scope.clinica.id)
                                })
                            } else {
                                var removeItem = $scope.salas.map(function (item) {
                                    return item.nome;
                                }).indexOf(item.nome);
                                $scope.salas.splice(removeItem, 1);
                                $scope.$apply()
                            }
                        } else {

                        }
                    });
            }

            var limpar = function () {
                $scope.objeto = new Object();
                $scope.objeto.created_at = Utils.generateDateToDataBase();
            }

            $scope.selecionar = async function (selecionado) {
                let item = JSON.stringify(selecionado)
                localStorage.setItem('ngStorage-clinica', item)
                
                $scope.objeto = selecionado;
                $scope.clinica = selecionado;
                $scope.flagEditando = true;
                await $scope.buscarSalas(selecionado.id)
                estiloDosCampos();
                prepararTabs();
            }

            $scope.buscarSalas = async (idClinica) => {
                await SalaService.buscarSalasPorClinica(idClinica).success(res => {
                    $scope.salas = res.salas;
                })
            }

            $scope.selecionarClinicaParaTrabalhar = function (selecionado) {
                $scope.$storage.clinica = selecionado;
                localStorage.setItem('clinicaId', selecionado.id);
                window.location = "base.html#/agenda";
            }

            $scope.voltar = function () {
                $scope.salas = [];
                $scope.clinica = null;
                $scope.flagEditando = false;
                $scope.getAll();
            }

            $scope.novoConsultorio = () => {
                $scope.objetoSala = {};
                $('#modalNovoConsultorio').modal({
                    backdrop: "static",
                    keyboard: false
                })
            }

            $scope.novo = async function () {
                await awaitNovo()
                estiloDosCampos()
                prepararTabs()
            }

            function awaitNovo() {
                $scope.salas = []
                $scope.flagEditando = true;
                localStorage.setItem('ngStorage-clinica', null)
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
                ClinicaService.delete($scope.objeto)
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

                var destino = Utils.getDateArray()[2] + "-" + Utils.getDateArray()[1];
                data.append('destino', destino);

                ClinicaService.upload(data)
                    .done(function (response) {
                        if (response.url) {
                            $scope.objeto.logo = response.url;
                            $scope.$apply();
                        } else {
                            swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                        }
                    })
                    .fail(function (response) {
                        swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                    })
            }

            $scope.salvar = function () {

                if ($scope.objeto.id) {
                    $scope.objeto.updated_at = Utils.generateDateToDataBase();
                    ClinicaService.update($scope.objeto)
                        .success(function (response) {
                            if (response) {
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
                } else {
                    $scope.objeto['created_at'] = Utils.generateDateToDataBase();
                    ClinicaService.insert($scope.objeto)
                        .success(function (response) {
                            $scope.objeto.id = response;
                            $scope.flagEditando = false;
                            $scope.getAll();
                            criarSalaParaNovasClinicas(response)
                            criarProcedimentosPadraoParaNovasClinicas(response)
                            //TODO: habilitar quando aprovado
                            criarEstoquePadraoParaNovaClinica(response);
                            $('#modalNovoConsultorio').modal('toggle');
                        })
                        .error(function (response) {
                            mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
                        });
                }
            }

            $scope.getAll = async function () {
                let admin = localStorage.getItem('ngStorage-tipo').replace(/"/gi, '');
                if(admin == 'administrador'){
                    buscarTodas();
                }else{
                    buscarAssociadas();
                }
            }

            var buscarTodas = function(){
                ClinicaService.getAll()
                .success(function (response) {
                    if (response == "erro") {
                        console.info("erro");
                    } else {
                        if (response.clinica.length > 0) {
                            $scope.objetos = response.clinica;
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

            var buscarAssociadas = async function(){
                let dentista = localStorage.getItem('ngStorage-email').replace(/"/gi, '');
                await ProfissionalService.getByMail(dentista).success(res => {
                    AuxClinicaProfissional.getByIdRelationProfissional(res.profissional[0].id).success((res) => {
                        ClinicaService.getListById(res.aux_clinica_profissional.map(e => e.clinicaId))
                            .success(function (response) {
                                if (response == "erro") {
                                    console.info("erro");
                                } else {
                                    if (response.clinica.length > 0) {
                                        $scope.objetos = response.clinica;
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
                    })
                });
            }

            var ordenarTabelas = function () {
                $('#sortable-table-1').tablesort();
            }

            var mensagemDeSucesso = function (mensagem) {
                swal({
                    title: 'Aviso!',
                    text: mensagem,
                    timer: 6000,
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
                $("#cnpj").inputmask("99.999.999/9999-99");
                $("#email").inputmask();

                $('#timepicker-horarioInicio').datetimepicker({
                    format: 'LT',
                    showClose: true,
                    format: 'HH:mm',
                    autoclose: true,
                    ignoreReadonly: true
                });

                $('#timepicker-horarioFim').datetimepicker({
                    format: 'LT',
                    showClose: true,
                    format: 'HH:mm',
                    autoclose: true,
                    ignoreReadonly: true
                });


                $('#datepicker-popup').datepicker({
                    enableOnReadonly: true,
                    autoclose: true,
                    format: "yyyy-mm-dd"
                });
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