angular.module('principal')
    .controller('PacienteController', ['$scope', '$localStorage', 'PacienteService', '$location', '$filter', 'Utils', 'AgendamentoService', 'PlanejamentoService',
        function ($scope, $localStorage, PacienteService, $location, $filter, Utils, AgendamentoService, PlanejamentoService) {

            $scope.$storage = $localStorage;
            $scope.objeto = new Object();
            $scope.objetos = new Object();
            $scope.anamnese = new Object();
            $scope.flagEditando = false;
            var page = 1;
            var itemsPerPage = 10;
            var $pagination = $('#pagination-demo');
            $scope.barramento = "";
            $scope.barramento = GLOBAL.barramento;

            $scope.preencher = function () {
                $scope.objeto.created_at = "0000-00-00 00:00:00";
                $scope.objeto.updated_at = "0000-00-00 00:00:00";
                $scope.buscado = false;

                var novoPaciente = localStorage.getItem('novoPaciente');
                if(novoPaciente == "true"){
                    var novoPacienteNome = localStorage.getItem('novoPacienteNome');
                    $scope.objeto.nome = novoPacienteNome;
                }else{
                    $scope.objeto.nome = "Luis Carlos de Morais";
                }

                $scope.objeto.sexo = "masculino";
                $scope.objeto.rg = "41.321.123-23";
                $scope.objeto.cpf = "305.809.118-32";
                $scope.objeto.estadoCivil = "casado";
                $scope.objeto.nascimento = "08-07-1982";
                $scope.objeto.convenioNumero = "1234567834234";
                $scope.objeto.convenioNome = "AMIL DENTAL";
                $scope.objeto.descricao = "Paciente Calmo";
                $scope.objeto.telefone = "(11) 5141-3436";
                $scope.objeto.endereco = "Avenida das Imbaubas, 78 - Itapevi - São Paulo";
                $scope.objeto.email = "cliente@gmail.com";
                $scope.objeto.foto = "2020-03-04-13-40-39.jpg";
            }

            var limpar = function () {
                $scope.objeto = new Object();
                $scope.objeto.cpfDisponivel = false;

                var novoPaciente = localStorage.getItem('novoPaciente');
                if(novoPaciente == "true"){
                    var novoPacienteNome = localStorage.getItem('novoPacienteNome');
                    $scope.objeto.nome = novoPacienteNome;
                }
            }

            $scope.selecionar = async function (selecionado) {
                localStorage.setItem("pacienteID", selecionado.id)
                $scope.objeto = selecionado;
                $scope.flagEditando = true;
                $scope.pessoa = {
                    nome: selecionado.nome
                }

                if ($scope.objeto.cpf) {
                    $scope.objeto.cpfDisponivel = true;
                }

                if ($scope.objeto.telefone) {
                    $scope.objeto.telefoneWhatsapp = "55"+$scope.objeto.telefone.replace(/[()-+]/g,'');
                }

                if ($scope.objeto.nascimento) {
                    $scope.objeto.nascimento = Utils.converterDataUSAtoBR($scope.objeto.nascimento);
                    $scope.pessoa['nascimento'] = selecionado.nascimento;
                    $scope.pessoa['idade'] = calculaIdade(selecionado.nascimento);
                }
                $scope.clinicaSelecionada = JSON.parse(localStorage.getItem('ngStorage-clinica'));
                buscarParcelasVencidas();
            }

            $scope.voltar = function (edit) {
                if (!edit) {
                    $scope.flagEditando = false;
                }
            }

            $scope.novo = function () {
                $scope.flagEditando = true;
                limpar();
                // setTimeout(estiloDosCampos, 2000);
            }

            //somente admin
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
                            efetivarExclusao();
                        } else {

                        }
                    });
            }

            var efetivarExclusao = function () {
                $scope.objeto.busca = $scope.objeto.nome;

                PacienteService.delete($scope.objeto)
                    .success(function (response) {
                        if (response == 1) {
                            Utils.mensagemDeSucesso("Exclusão efetuada com sucesso.");
                            $scope.flagEditando = false;
                            $scope.buscarPacientes();
                        } else {
                            Utils.mensagemDeErro("Houve um erro ao excluir.");
                        }
                    })
                    .error(function (response) {
                        Utils.mensagemDeErro("Erro ao excluir. Entre em contato com o administrador.");
                    });
            }

            $scope.upload = function () {
                var form = $('#form')[0];
                var data = new FormData(form);

                var destino = Utils.getDateArray()[2]+"-"+Utils.getDateArray()[1];
                data.append('destino', destino);

                PacienteService.upload(data)
                    .done(function (response) {
                        if (response.url) {
                            $scope.objeto.foto = response.url;
                            $scope.objeto.urlImagem = urlEhImagem(response.url);
                            $scope.$apply();
                        } else {
                            swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                        }
                    })
                    .fail(function (response) {
                        swal('Não foi possível salvar a imagem, tente novamente. Caso o erro persista, entre em contato com o Administrador.');
                    })
            }

            var urlEhImagem = function (url) {
                var pedacos = url.split(".");
                if (pedacos[1] == "jpg" || pedacos[1] == "jpeg" || pedacos[1] == "png") {
                    return true;
                } else {
                    return false;
                }
            }

            var verSePrecisaVoltarParaAgenda = function(){
                var novoPaciente = localStorage.getItem('novoPaciente');
                if(novoPaciente == "true"){
                    //desligar flag
                    //localStorage.setItem('novoPaciente', false);

                    //guarda id do novo paciente
                    localStorage.setItem('idDoNovoPaciente', $scope.objeto.id);
                    
                    //voltar para agenda 
                    $location.path('/agenda');
                }
            }

            $scope.salvar = function () {
                
                if ($scope.objeto.nascimento) {
                    $scope.objeto.nascimento = Utils.converterDataUSAtoBR($scope.objeto.nascimento);
                }

                $scope.objeto.cpf = Utils.formatarCPF($scope.objeto.cpf);

                $scope.objeto.busca = $scope.objeto.nome;

                if ($scope.objeto.id) {
                    $scope.objeto.updated_at = Utils.generateDateToDataBase();
                    PacienteService.update($scope.objeto)
                        .success(function (response) {
                            if (response) {
                                Utils.mensagemDeSucesso("Atualização efetuada com sucesso.");
                                $scope.flagEditando = false;
                                $scope.buscarPacientes();
                            } else {
                                Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                            }
                        })
                        .error(function (response) {
                            Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o administrador.");
                        });
                } else {
                    $scope.objeto.created_at = Utils.generateDateToDataBase();
                    PacienteService.insert($scope.objeto)
                        .success(function (response) {
                            Utils.mensagemDeSucesso("Cadastro efetuado com sucesso!");
                            $scope.objeto.id = response;
                            $scope.flagEditando = false;
                            $scope.buscarPacientes();
                            verSePrecisaVoltarParaAgenda();
                        })
                        .error(function (response) {
                            Utils.mensagemDeErro("Erro ao cadastrar. Entre em contato com o administrador.");
                        });
                }
            }

            $scope.validarUsuarioExistente = function () {
                if ($scope.objeto.id == undefined && $scope.objeto.cpf != undefined) {
                    $scope.objeto.cpf = Utils.formatarCPF($scope.objeto.cpf);

                    PacienteService.validarUsuarioExistente($scope.objeto.cpf)
                        .success(function (response) {
                            if (response.paciente.length > 0) {
                                Utils.mensagemDeErro("CPF já utilizado");
                                $scope.objeto.cpfDisponivel = false;
                            } else {
                                Utils.mensagemDeSucesso("CPF disponível");
                                $scope.objeto.cpfDisponivel = true;
                            }
                        })
                        .error(function (response) {
                            Utils.mensagemDeSucesso("CPF disponível");
                        });
                } else {

                }
            }

            var tratarNomeDeConvenios = function () {
                $scope.objetos.forEach(objeto => {

                    if (objeto.convenioNome == "UNIMED IN Company" || objeto.convenioNome == "Unimed Odonto" || objeto.convenioNome == "UNIMED" || objeto.convenioNome == "UNIODONTO") {
                        objeto.convenioNome = "UNIMED";
                    }

                    if (objeto.convenioNome == "IPASGO" || objeto.convenioNome == "PRODENT" || objeto.convenioNome == "CUNHA ODONTOLOGIA") {
                        objeto.convenioNome = "INDEFINIDO";
                    }

                    //O que nao cair nas regras acima será METLIFE

                });
            }

            $scope.buscarPacientes = function () {
                if($scope.objeto.busca.length >= 3){
                    window.clearTimeout(this.timeout);
                    this.timeout = window.setTimeout(() => buscarPacientesNoBanco(page), 1000);
                }
            }

            var defaultOpts = {
                first: 'primeiro',
                prev : 'anterior',
                next : 'próximo',
                last: 'último',
                currentPage: page,
                cssStyle: '',
                prev: '<span aria-hidden="true">&laquo;</span>',
                next: '<span aria-hidden="true">&raquo;</span>',
                onPageClick: function (evt, actual_page) {
                    if (actual_page != page) {
                        page = actual_page;
                        buscarPacientesNoBanco(page);
                    }
                }
            };

            var buscarPacientesNoBanco = function (page) {
                
                PacienteService.getByName(page, itemsPerPage, $scope.objeto.busca)
                    .success(function (response) {
                        if (response == "erro") {
                            console.info("erro");
                        } else {
                            if (response.paciente.length > 0) {
                                $scope.objetos = response.paciente;
                                tratarNomeDeConvenios();
                                setTimeout(ordenarTabelas, 2000);

                                var totalPages = Math.ceil(response._results / itemsPerPage);
                                var currentPage = $('#pagination-demo').twbsPagination('getCurrentPage');
                                $('#pagination-demo').twbsPagination('destroy');
                                $('#pagination-demo').twbsPagination($.extend({}, defaultOpts, {
                                    startPage: currentPage,
                                    totalPages: totalPages
                                }));

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

            var estiloDosCampos = function () {
                $("#cpf").inputmask("999.999.999-99");
                $("#email").inputmask();
                $("#telefone").inputmask({
                    mask: ["(99) 9999-9999", "(99) 99999-9999", ],
                    keepStatic: true
                });

                $('#datepicker-nascimento').datepicker({
                    enableOnReadonly: true,
                    autoclose: true,
                    format: "dd-mm-yyyy",
                    language: "pt-BR",
                    startView: 2,
                });

            }

            function calculaIdade(dataNasc) {
                let ic = dataNasc.indexOf('-')
                var dataAtual = new Date();
                var anoAtual = dataAtual.getFullYear();
                var anoNascParts = dataNasc.split(ic > 0 ? '-' : '/');
                var diaNasc = anoNascParts[0];
                var mesNasc = anoNascParts[1];
                var anoNasc = anoNascParts[2];
                var idade = anoAtual - anoNasc;
                var mesAtual = dataAtual.getMonth() + 1;
                if (mesAtual < mesNasc) {
                    idade--;
                } else {
                    if (mesAtual == mesNasc) {
                        if (new Date().getDate() < diaNasc) {
                            idade--;
                        }
                    }
                }
                return idade;
            }

            $scope.mostraDescricao = function (descricao) {
                Utils.mensagemDeSucessoOK(descricao);
            }

            var tratarTipoDeUsuario = function(){
                var tipo = localStorage.getItem('ngStorage-tipo')
                
                if(Utils.isEmpytNullOrUndefined(tipo)){
                    Utils.mensagemDeErro("Erro ao tratar tipo de usuário.");
                    window.location = "index.html";
                }else{
                    tipo = tipo.replace(/"/g, '');

                    if(tipo == "administrador"){
                        $scope.flagAdmin = true;
                    }
                }

            }

            var tratarNavegacao = async function(){
                var novoPaciente = localStorage.getItem('novoPaciente');
                if (localStorage.getItem('flagEditando')) {
                    let evento = JSON.parse(localStorage.getItem('evento'))
                    let pacientes = []

                    if (!localStorage.getItem('navigateProntuario')) {
                        await PacienteService.getAll().success(async (e) => {
                            pacientes = e.paciente
                            await AgendamentoService.getOne(evento.id).success((res) => {
                                let a = e.paciente.filter(e => e.id == res.pacienteID)
                                $scope.selecionar(a[0])
                                $(document).ready(function () {
                                    $('.nav-tabs a[href="#atendimento-tab-content"]').tab('show');
                                });
                            })
                        })
                        localStorage.removeItem('flagEditando')
                        localStorage.setItem('editandoAtendimento', true)
                    } else {
                        $scope.selecionar(JSON.parse(localStorage.getItem('objetoPacienteNavigate')))
                        localStorage.removeItem('navigateProntuario')
                        localStorage.removeItem('flagEditando')
                        localStorage.removeItem('objetoPacienteNavigate')
                    }
                }else if(novoPaciente == "true"){
                    $scope.novo();
                }
            }

            var prepararAbas = function(){
                $('.nav-tabs a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                })
            }

            $scope.mostrandoAbas = function(){
                prepararAbas();
                estiloDosCampos();
            }

            var ghostNavigation = function(){
                PacienteService.getByName(page, itemsPerPage, "michael douglas")
                .success(function (response) {
                    $scope.selecionar(response.paciente[0]);
                    $scope.buscado = true;
                })
                .error(function (response) {
                    $scope.mensagem = "Erro ao buscar registros.";
                    $scope.flagSemConteudo = true;
                });
            }

            var buscarParcelasVencidas = function(){
                let pacienteID = localStorage.getItem('pacienteID');

                PlanejamentoService.buscarParcelasVencidas(pacienteID)
                .success(function (response) {
                    $scope.possuiParcelasVencidas = response;
                    // console.info($scope.possuiParcelasVencidas);
                })
                .error(function (response) {
                    
                });
            }
            
            init = function () {
                tratarTipoDeUsuario();
                tratarNavegacao();
                // ghostNavigation();
            };

            init();
        }
    ]);