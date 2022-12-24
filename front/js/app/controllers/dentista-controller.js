angular.module('principal')
  .controller('DentistaController', ['SalaHorarioService', '$scope', '$localStorage', 'AgendamentoService', '$timeout', 'ProcedimentoService', 'PacienteService', 'ProfissionalService', '$q', 'Utils', '$compile', '$location', 'ClinicaService', 'SalaService', 'AuxClinicaProfissional',
    function (SalaHorarioService, $scope, $localStorage, AgendamentoService, $timeout, ProcedimentoService, PacienteService, ProfissionalService, $q, Utils, $compile, $location, ClinicaService, SalaService, AuxClinicaProfissional) {

      $scope.$storage = $localStorage;
      $scope.objeto = new Object();
      $scope.objetos = new Object();
      $scope.flagEditando = false;
      $scope.pacientesEncontrados = new Object();
      $scope.nomeOuCPF = "";
      $scope.abas = [];
      $scope.disabledButton = true
      $scope.newArray = [];

      // $("#historico-tab").click(function () {
      //   buscarProcedimentos();
      //   buscarProfissionais();
      //   buscarClinicaSelecionada();
      //   buscarDadosClinicaPorId();
      // })


      $scope.preencher = function () {
        $scope.objeto.cpf = "123.456.789-09";
        $scope.objeto.nome = "Nayara Martins";
        $scope.objeto.situacao = "chegou";
        $scope.objeto.email = "nayarads@gmail.com";
        $scope.objeto.telefone = "(11) 9-7364-8452";
        $scope.objeto.convenio = "AMIL";
        $scope.objeto.convenioTipo = "123456789";
        $scope.objeto.data = "24-09-2020";
        $scope.objeto.nascimento = "08-07-1982";
        $scope.objeto.horarioInicio = "16:00";
        $scope.objeto.horarioFim = "17:00";
        $scope.objeto.procedimentoCategoria = "EXAMES";
        $scope.objeto.profissionalID = "9";
        $scope.objeto.pacienteID = "9";
        $scope.objeto.descricao = "Detalhe do procedimento";
        $scope.objeto.situacao = "chegada";
        $scope.objeto.clinicaID = 1;

        $scope.objeto.created_at = Utils.generateDateToDataBase();
        $scope.objeto.updated_at = Utils.generateDateToDataBase();
      }

      $scope.getBoxBackgroundColor = (item) => {
        return item
      }

      $scope.selecionarSala = (item, index) => {
        localStorage.setItem('ngStorage-sala', JSON.stringify(item))
        $scope.abas.forEach((e, i) => {
          if (i == index) {
            $("#tabs-" + i).css({
              'font-weight': 'bold',
              "borderColor": "black", //"#e7eaed",
              "border-bottom-color": "white",
              "background-color": "white",
              "color": "black",
              // 'text-decoration': 'underline'
            });
          } else {
            if (i != index) {
              $("#tabs-" + i).css({
                // 'text-decoration': 'none',
                "color": "black",
                "background-color": e.cor,
                "border-bottom-color": "transparent",
                "borderColor": "transparent",
                'font-weight': 'normal',
              });
            }
          }
        })
        $scope.buscarAgendamentosPorSalaID();
      }

      var prepararTabs = function () {
        $('.nav-tabs a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
        })
      }

      var limpar = function () {
        $scope.objeto = new Object();
        $scope.objeto.situacao = "agendado";
        $scope.objeto.created_at = Utils.generateDateToDataBase();
        $scope.objeto.clinicaID = $scope.$storage.clinica.id;
      }

      $scope.voltar = function () {
        $scope.flagEditando = false;
        $scope.buscarAgendamentosPorSalaID();
        limpar();
        setTimeout(popularCalendario, 1000);
      }

      $scope.buscarPacientes = function () {
        if ($scope.nomeOuCPF.length >= 3) {
          window.clearTimeout(this.timeout);
          this.timeout = window.setTimeout(() => buscarPacientesNoBanco(), 1000);
        }
      }

      var buscarPacientesNoBanco = function () {
        PacienteService.getByName(1, 20, $scope.nomeOuCPF)
          .success(function (response) {
            $scope.pacientesEncontrados = response.paciente;
          })
          .error(function (response) {
            alert("Erro ao buscar paciente. Entre em contato com o Administrador.");
          });
      }

      $scope.selecionarPaciente = function (paciente) {
        $('#escolhaDoPaciente').modal('hide');
        $scope.flagEditando = !$scope.flagEditando;
        $scope.objeto = paciente;
        $scope.objeto.situacao = "agendado";
        $scope.objeto.created_at = Utils.generateDateToDataBase();
        $scope.objeto.clinicaID = $scope.$storage.clinica.id;
        $scope.objeto.pacienteID = paciente.id;
        $scope.objeto.id = null;
        $scope.objeto.flagBloquear = true;


        var dataAgendamentoAno = localStorage.getItem('dataAgendamentoAno');
        var dataAgendamentoMes = localStorage.getItem('dataAgendamentoMes');
        var dataAgendamentoDia = localStorage.getItem('dataAgendamentoDia');

        if (localStorage.getItem('horaAgendamento') && localStorage.getItem('minutoAgendamento')) {
          var hora = localStorage.getItem('horaAgendamento');
          var horaMaisUm = parseInt(hora) + 1;

          if (hora < 10) {
            hora = "0" + hora;
          }
          if (horaMaisUm < 10) {
            horaMaisUm = "0" + horaMaisUm;
          }

          var minuto = localStorage.getItem('minutoAgendamento');
          if (minuto < 10) {
            minuto = "0" + minuto;
          }

          $scope.objeto.horarioInicio = hora + ":" + minuto;
          $scope.objeto.horarioFim = horaMaisUm + ":" + minuto;
        }


        // estiloDosCampos();

        atualizarDataDoAgendamento(dataAgendamentoAno, dataAgendamentoMes, dataAgendamentoDia);

        if ($scope.objeto.nascimento) {
          var parts = $scope.objeto.nascimento.split("-");
          atualizarDataDeNascimento(parts[0], parts[1], parts[2]);
        }

      }

      var atualizarDataDoAgendamento = function (ano, mes, dia) {
        $('#datepicker-data').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 0,
          todayBtn: true,
          todayHighlight: true,
        });

        $('#datepicker-data').datepicker('setDate', new Date(ano, mes, dia));
        $scope.objeto.data = $('[name=data]').val();
      }

      var atualizarDataDeNascimento = function (ano, mes, dia) {
        $('#datepicker-nascimento').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 2,
        });

        $('#datepicker-nascimento').datepicker('setDate', new Date(ano, mes, dia));
      }

      $scope.novo = async function (semDataEHora) {
        $('#escolhaDoPaciente').modal();
        $scope.pacientesEncontrados = new Object();
        $scope.nomeOuCPF = "";
        $scope.objeto.flagBloquear = false;
        buscarProfissionais();

        Inputmask("datetime", {
          inputFormat: "HH:MM",
          placeholder: "_",
        }).mask("#horarioInicio, #horarioFim");

        if (semDataEHora) {
          var moment = $('#calendar').fullCalendar('getDate');

          localStorage.setItem('dataAgendamentoAno', moment._i[0]);
          localStorage.setItem('dataAgendamentoMes', moment._i[1]);
          localStorage.setItem('dataAgendamentoDia', moment._i[2]);

          localStorage.removeItem('horaAgendamento');
          localStorage.removeItem('minutoAgendamento');
        }
        $scope.disabledButton = false;
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
        $scope.objeto.data = Utils.converterDataBRtoUSA($scope.objeto.data);
        $scope.objeto.deleted_at = Utils.generateDateToDataBase();
        var email = JSON.parse(localStorage.getItem('ngStorage-email'));

        if($scope.objeto.comentario){
          $scope.objeto.comentario = $scope.objeto.comentario + ' --> deleted by ' + email;
        }else{
          $scope.objeto.comentario = ' --> deleted by ' + email;
        }
        
        $scope.objeto.situacao = 'finalizado';

        AgendamentoService.delete($scope.objeto)
          .success(function (response) {
            if (response == 1) {
              Utils.mensagemDeSucesso("Exclusão efetuada com sucesso.");
              $scope.flagEditando = false;
              $scope.buscarAgendamentosPorSalaID();

            } else {
              Utils.mensagemDeErro("Houve um erro ao excluir.");
            }
          })
          .error(function (response) {
            Utils.mensagemDeErro("Erro ao excluir. Entre em contato com o Administrador.");
          });
      }

      $scope.salvar = function () {
        if ($scope.objeto.data) {
          let sala = JSON.parse(localStorage.getItem('ngStorage-sala'));
          $scope.objeto.salaId = sala.id;
          $scope.objeto.data = Utils.converterDataUSAtoBR($scope.objeto.data);
          $scope.dataDoAgendamento = $scope.objeto.data;
          $scope.voltarParaDataAgendada = true;
        }

        if ($scope.objeto.id) {
          update();
        } else {
          // ignorando para subir para producao sem a necessidade de criar cliente por aqui
          // prepararCreate();
          createAgendamento();
        }

      }

      var update = function () {
        $scope.objeto.updated_at = Utils.generateDateToDataBase();
        AgendamentoService.update($scope.objeto)
          .success(function (response) {
            if (response) {
              Utils.mensagemDeSucesso("Atualização efetuada com sucesso.");
              $scope.flagEditando = false;
              $scope.buscarAgendamentosPorSalaID();
            } else {
              Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o Administrador.");
            }
          })
          .error(function (response) {
            Utils.mensagemDeErro("Erro ao atualizar. Entre em contato com o Administrador.");
          });
      }

      var verificarNecessidadeDeCriarCliente = function () {

        return $q(function (resolve, reject) {
          if ($scope.objeto.pacienteID) {
            // Utils.mensagemDeSucesso("nao precisa criar cliente");
            resolve("nao precisa criar cliente");
          } else {
            // Utils.mensagemDeErro("precisa criar cliente");
            reject("precisa criar cliente");
          }
        });
      }

      var prepararCreate = function () {
        var promessa = verificarNecessidadeDeCriarCliente();

        promessa.then(function () {
          createAgendamento();
        }, function () {
          //criar cliente primeiro
          var clienteNovo = new Object();
          clienteNovo.nome = $scope.objeto.nome;
          clienteNovo.cpf = $scope.objeto.cpf;
          clienteNovo.nascimento = $scope.objeto.nascimento;
          clienteNovo.email = $scope.objeto.email;
          clienteNovo.telefone = $scope.objeto.telefone;
          clienteNovo.convenioNome = $scope.objeto.convenioNome;
          clienteNovo.convenioNumero = $scope.objeto.convenioNumero;
          clienteNovo.created_at = Utils.generateDateToDataBase();

          if (clienteNovo.nascimento) {
            clienteNovo.nascimento = Utils.converterDataUSAtoBR(clienteNovo.nascimento);
          }

          if (clienteNovo.cpf) {
            clienteNovo.cpf = Utils.formatarCPF(clienteNovo.cpf);
          }

          PacienteService.insert(clienteNovo)
            .success(function (response) {
              $scope.objeto.pacienteID = response;
              //depois inserir agendamento
              createAgendamento();
            })
            .error(function () {
              Utils.mensagemDeErro("Erro ao criar novo cliente.");
            })
        });

      }

      var createAgendamento = function () {
        $scope.objeto['created_at'] = Utils.generateDateToDataBase();
        AgendamentoService.create($scope.objeto)
          .success(function (response) {
            Utils.mensagemDeSucesso("Cadastro efetuado com sucesso!");
            $scope.objeto.id = response;
            $scope.flagEditando = false;
            $scope.buscarAgendamentosPorSalaID();
          })
          .error(function (response) {
            Utils.mensagemDeErro("Erro ao cadastrar. Entre em contato com o Administrador.");
          });
      }

      $scope.buscarAgendamentosPorSalaID = function () {
        AgendamentoService.buscarAgendamentosPorSalaID(JSON.parse(localStorage.getItem('ngStorage-sala')).id)
          .success(function (response) {
            if (response == "erro") {
              Utils.mensagemDeErro("erro");
            } else {
              if (response.length > 0) {
                $scope.objetos = response;
              } else {
                $scope.objetos = new Object();
              }

              $scope.buscado = true;
              organizarResultados();
              popularCalendario();
            }
          })
          .error(function (response) {
            $scope.mensagem = "Erro ao buscar registros.";
            $scope.flagSemConteudo = true;
          });
      }

      var getOne = function (id) {
        AgendamentoService.getOne(id)
          .success(function (response) {
            if (response == "erro") {
              Utils.mensagemDeErro("erro");
            } else {
              $scope.objeto = response;
              buscarDaDosComplementares(response.profissionalID, response.pacienteID);
              $scope.flagEditando = true;
            }
          })
          .error(function (response) {
            $scope.mensagem = "Erro ao buscar registros.";
            $scope.flagSemConteudo = true;
          });
      }

      var buscarDaDosComplementares = function (profissionalID, pacienteID) {
        ProfissionalService.getOne(profissionalID)
          .success(function (response) {
            $scope.objeto.profissionalID = response.id;
          })
          .error(function (response) {
            Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
          });

        PacienteService.getOne(pacienteID)
          .success(function (response) {
            $scope.objeto.cpf = response.cpf;
            $scope.objeto.nome = response.nome;
            $scope.objeto.email = response.email;
            $scope.objeto.telefone = response.telefone;
            $scope.objeto.nascimento = response.nascimento;


            setTimeout(estiloDosCampos, 2000);
          })
          .error(function (response) {
            Utils.mensagemDeErro("Erro ao buscar Paciente");
          });
      }

      var organizarResultados = function () {
        var data = [];

        for (i = 0; i < $scope.objetos.length; i++) {
          var color = '';
          var textColor = 'white';

          if ($scope.objetos[i].situacao == "faltou") {
            color = 'red';
            textColor = 'white';
          }

          if ($scope.objetos[i].situacao == "chegada") {
            color = 'yellow';
            textColor = 'black';
          }

          if ($scope.objetos[i].situacao == "em atendimento") {
            color = 'blue';
            textColor = 'white';
          }

          if ($scope.objetos[i].situacao == "finalizado") {
            color = 'green';
            textColor = 'white';
          }

          var newEvent = {
            title: $scope.objetos[i].nome,
            start: $scope.objetos[i].data + "T" + $scope.objetos[i].horarioInicio + ":00",
            end: $scope.objetos[i].data + "T" + $scope.objetos[i].horarioFim + ":00",
            // color: color, //cor de fundo
            textColor: textColor,
            eventTextColor: textColor,
            backgroundColor: color, //funciona
            extra: $scope.objetos[i] //.id
          }

          data.push(newEvent);
        }

        $scope.eventos = data;
      }

      var tratarAgendamentoCampoData = function () {
        if ($scope.objeto.data) {
          $scope.objeto.data = Utils.converterDataUSAtoBR($scope.objeto.data);
        }


        $('#datepicker-data').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 0,
          todayBtn: true,
          todayHighlight: true,
        });

        $('#datepicker-data').datepicker('setDate', $scope.objeto.data);

      }

      var estiloDosCampos = async function () {
        if ($scope.objeto.nascimento) {
          $scope.objeto.nascimento = Utils.converterDataUSAtoBR($scope.objeto.nascimento);
        }

        if ($scope.objeto.data) {
          $scope.objeto.data = Utils.converterDataUSAtoBR($scope.objeto.data);
        }

        $("#cpf").inputmask("999.999.999-99");

        $('#cpf').trigger('input');

        $("#email").inputmask();
        $("#telefone").inputmask({
          mask: ["(99) 9999-9999", "(99) 99999-9999", ],
          keepStatic: true
        });

        $('#datepicker-data').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 0,
          todayBtn: true,
          todayHighlight: true,
        });
        $('#datepicker-data').datepicker('setDate', $scope.objeto.data);


        $('#datepicker-nascimento').datepicker({
          enableOnReadonly: true,
          autoclose: true,
          format: "dd-mm-yyyy", //formato de saida(para o rest)
          language: "pt-BR",
          startView: 2,
        });
        $('#datepicker-nascimento').datepicker('setDate', $scope.objeto.nascimento);
        $scope.disabledButton = false
        $scope.$apply()

      }

      $scope.validarUsuarioExistente = function (cpf) {
        $scope.objeto.cpf = Utils.formatarCPF(cpf);

        if ($scope.objeto.id == undefined && $scope.objeto.cpf != undefined) {

          PacienteService.validarUsuarioExistente($scope.objeto.cpf)
            .success(function (response) {
              if (response.paciente.length > 0) {
                Utils.mensagemDeSucesso("Cliente existente");
                $scope.objeto.nome = response.paciente[0].nome;
                $scope.objeto.nascimento = response.paciente[0].nascimento;
                $scope.objeto.email = response.paciente[0].email;
                $scope.objeto.telefone = response.paciente[0].telefone;
                $scope.objeto.convenioNome = response.paciente[0].convenioNome;
                $scope.objeto.convenioNumero = response.paciente[0].convenioNumero;
                $scope.objeto.pacienteID = response.paciente[0].id;
                $scope.objeto.cpfDisponivel = true;
              } else {
                Utils.mensagemDeErro("Cliente não localizado");
                $scope.objeto.cpfDisponivel = false;
              }
            })
            .error(function (response) {
              Utils.mensagemDeErro("Erro ao buscar Paciente");
            });
        } else {

        }
      }

      var buscarProcedimentos = function () {
        var storageClinica = JSON.parse(localStorage.getItem('ngStorage-clinica'));
        var clinicaId = storageClinica.id

        ProcedimentoService.getByStatusAndClinica(clinicaId)
          .success(function (response) {
            if (response.procedimento.length > 0) {

              var unique = response.procedimento.reduce(function (a, d) {
                if (a.indexOf(d.categoria) === -1) {
                  a.push(d.categoria);
                }
                return a;
              }, []);

              $scope.procedimentos = unique;
            } else {
              Utils.mensagemDeSucesso("Erro ao fazer a busca de procedimentos");
            }
          })
          .error(function (response) {
            Utils.mensagemDeSucesso("Erro ao fazer a busca de procedimentos");
          });
      }

      var buscarProfissionais = function () {
        AuxClinicaProfissional.getByClinica(JSON.parse(localStorage.getItem('ngStorage-clinica')).id).success((res) => {
          let profissionais = res.aux_clinica_profissional.map(m => m.profissionalId)
          buscarListProfissionais(profissionais)
        })
      }

      var buscarListProfissionais = (listProfissionais) => {
        ProfissionalService.getByList('ativo', listProfissionais)
          .success(function (response) {
            if (response.profissional.length > 0) {
              $scope.profissionais = response.profissional.filter(e => e.tipo == "dentista")
            } else {
              Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
            }
          })
          .error(function (response) {
            Utils.mensagemDeSucesso("Erro ao fazer a busca de profissionais");
          });
      }

      $scope.atualizar = function () {
        popularCalendario();
      }

      var popularCalendario = function () {
        var configuration = {
          selectable: true,
          select: function (info) {
            var ano = info._i[0];
            var mes = parseInt(info._i[1]);
            var dia = info._i[2];

            var hora = info._i[3];
            var minuto = info._i[4];

            localStorage.setItem('dataAgendamentoAno', ano);
            localStorage.setItem('dataAgendamentoMes', mes);
            localStorage.setItem('dataAgendamentoDia', dia);

            localStorage.setItem('horaAgendamento', hora);
            localStorage.setItem('minutoAgendamento', minuto);

            $scope.novo(false);
          },
          eventSources: [{
            events: $scope.eventos,
            color: 'gray', //cor de fundo padrao
            textColor: 'black'
          }, ],
          defaultView: 'agendaDay',
          slotDuration: '00:10:00',
          minTime: $scope.clinicaSelecionada.horarioInicio + ":00",
          maxTime: $scope.clinicaSelecionada.horarioFim + ":00",
          businessHours: [{
            dow: [1, 2, 3, 4, 5, 6],
            start: $scope.clinicaSelecionada.horarioInicio + ":00",
            end: '12:00'
          }, {
            dow: [1, 2, 3, 4, 5, 6],
            start: '13:00',
            end: $scope.clinicaSelecionada.horarioFim + ":00",
          }],
          shadowHours: [{
            dow: [1, 2, 3, 4, 5, 6],
            end: '12:00'
          }, {
            dow: [1, 2, 3, 4, 5, 6],
            start: '13:00',
          }],
          selectConstraint: ["shadowHours", "businessHours"],
          hiddenDays: [0],
          header: {
            left: 'prev,next',
            center: 'title',
            right: 'today, month,agendaWeek,agendaDay'
          },
          // ],
          locale: 'pt-br',
          // defaultDate: '2017-07-12',
          navLinks: true, // can click day/week names to navigate views
          navLinkDayClick: function (date) {
            let data = date._i.split('-');
            data[1] = String(data[1] - 1)
            atualizarNovaData(data)
            $('#calendar').fullCalendar('gotoDate', new Date(data[0], data[1], data[2]))
            $('#calendar').fullCalendar('changeView', 'agendaDay');
          },
          // editable: false,
          eventLimit: true, // allow "more" link when too many events
          // select: function(info) {
          //   Utils.mensagemDeSucesso('clicked ' + new Date(info));
          // },
          eventClick: function (eventObj) {
            if (false) {
              alert(
                'Clicked ' + eventObj.title + '.\n' +
                'Will open ' + eventObj.url + ' in a new tab'
              );

              window.open(eventObj.url);

              return false; // prevents browser from following link in current tab.
            } else {

            }
          },
          agendaEventMinHeight: 50,
          eventRender: function (event, element) {
            // $scope.newArray.push(event.extra.id);
            // console.log($scope.newArray)
            renderEvents(event, element);
          },
          allDaySlot: false
        }

        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar(configuration);

        SalaHorarioService.buscarHorarioPorSala(JSON.parse(localStorage.getItem('ngStorage-sala')).id).success(res => {
          if (res.sala_horario.length > 0) {
            let data = res.sala_horario[0].ultimo_acesso.split('-')
            $('#calendar').fullCalendar('gotoDate', new Date(data[2], data[1], data[0]))
          } else {
            $('#calendar').fullCalendar('gotoDate', new Date());
          }
        })

        $(".fc-right").click(el => {
          if (el.target.outerText == "Hoje") {
            atualizarNovaData()
          }
        })

        $(".fc-button-group").click((el) => {
          var view = $('#calendar').fullCalendar('getView');
          if (el.target.outerText == "" && view.type == "agendaDay") {
            atualizarNovaData()
          }
        })
      }

      async function renderEvents(event, element) {
        element.css("font-size", "1.2em");
        element.css("padding", "5px");
        const eventId = event.extra;
        let res = $scope.objetos.filter(e => e.id == event.extra.id)
        // AgendamentoService.getOne(event.extra.id).success(res => {
        let prof = await novoBuscarDentistaPorAgendamento(res[0].profissionalID);

        let nomeBotao = eventId.situacao == 'agendado' ? 'Chegou' : 'Atender'
        var ehHoje = Utils.compareData(eventId.data, new Date().getFullYear(), Number(new Date().getMonth() + 1), new Date().getDate())
        let buttonDefine = ''
        let emailLogado = localStorage.getItem('ngStorage-email').replace(/"/g, '');

        if (prof.email == emailLogado && ehHoje &&
          eventId.situacao == 'chegada') {
          buttonDefine = `<a href='javascript:void(0)' class='btn btn-success botao-extra extra1' ng-click='metodo1(${eventId.id})'>${nomeBotao}</a>`
        } else if (ehHoje && nomeBotao == 'Chegou') {
          buttonDefine = `<a href='javascript:void(0)' class='btn btn-success botao-extra extra1' ng-click='metodo1(${eventId.id})'>${nomeBotao}</a>`
        }

        $scope.situacaoAtual = eventId.situacao;
        $scope.eventComplet = eventId;
        $scope.voltarParaDataAgendada = true;

        var dataCompletaDoEvento = new Date(eventId.data + 'T' + event.extra.horarioInicio);
        var dataValida = dataCompletaDoEvento >= new Date();

        var mostrarIconeWhatsapp = (event.extra.telefone != '' && event.extra.telefone != undefined) && dataValida;
        var stringWhatsapp = '';

        var dataAbreviada = Utils.getDateArray(dataCompletaDoEvento)[0] + '/' + Utils.getDateArray(dataCompletaDoEvento)[1];
        var horario = Utils.getNumberWithZero(Utils.getDateArray(dataCompletaDoEvento)[3]) + 'h' + Utils.getNumberWithZero(Utils.getDateArray(dataCompletaDoEvento)[4]);

        if(mostrarIconeWhatsapp){
          stringWhatsapp = `<a class="telefone-whatsapp" ng-click="abrirWhatsapp('${event.extra.telefone}', '${event.title}', '${dataAbreviada}', '${horario}')"><i class="mdi mdi-whatsapp"></i></a>`;
        }

        element.html(`
                (${event.extra.horarioInicio} - ${event.extra.horarioFim}) 
                <a class='nomePacienteAgenda' ng-click="irParaProntuario(${eventId.id})">  ${event.title}</a> 
                ${stringWhatsapp}
                <a class='btn btn-light botao-extra extra2' ng-click="metodo2(${eventId.id})"> Visualizar</a>` + `${buttonDefine}`)
        $compile(element)($scope);
        // });
      }

      async function novoBuscarDentistaPorAgendamento(idProfissional) {
        let emailLogado = localStorage.getItem('ngStorage-profissional' + idProfissional)
        if (emailLogado) {
          return JSON.parse(emailLogado);
        } else {
          await ProfissionalService.getOne(idProfissional).success(prof => {
            localStorage.setItem('ngStorage-profissional' + prof.id, JSON.stringify(prof));
          })
          return localStorage.getItem('ngStorage-profissional' + idProfissional);
        }
      }

      function atualizarNovaData(data) {
        let dia = null
        let mes = null
        let ano = null

        if (!data) {
          dia = $('#calendar').fullCalendar('getDate')._i[2]
          mes = $('#calendar').fullCalendar('getDate')._i[1]
          ano = $('#calendar').fullCalendar('getDate')._i[0]
        } else {
          dia = data[2]
          mes = data[1]
          ano = data[0]
        }

        let obj = {
          salaID: JSON.parse(localStorage.getItem('ngStorage-sala')).id,
          ultimo_acesso: Utils.completeData(ano, mes, dia)
        }

        SalaHorarioService.buscarHorarioPorSala(obj.salaID).success(res => {
          if (res.sala_horario.length > 0) {
            obj['id'] = res.sala_horario[0].id
            SalaHorarioService.atualizarHorario(obj).success(res => {})
          } else {
            SalaHorarioService.criarHorario(obj).success(res => {})
          }
        }).error((erro) => {
          console.log("Ocorreu um erro na busca de ultimo acesso:", erro)
        })
      }

      $scope.irParaProntuario = async function (idAgendamento) {
        await AgendamentoService.getOne(idAgendamento).success((res) => {
          PacienteService.getOne(res.pacienteID).success(res => {
            localStorage.setItem('objetoPacienteNavigate', JSON.stringify(res));
            localStorage.setItem('flagEditando', true);
            localStorage.setItem('navigateProntuario', true);
            $location.path('/pacientes');
          })
        })
      }

      $scope.abrirWhatsapp = function(telefone, nome, dataAbreviada, horario){
        if(telefone == '' || telefone == 'null'){
          Utils.mensagemDeErro("Paciente sem número de telefone.");
        }else{
          var telefoneWhatsapp = "55" + telefone.replace(/[()--+]/g,'');
          // telefoneWhatsapp = '5511993650220'; //TODO: remover

          var mensagem = `Olá Sr.(a) ${nome}, tudo bem?☺️%0APassando para lembra-lo(a) de sua consulta, dia ${dataAbreviada} às ${horario}.%0APosso confirmar?%0A%0A🔺 Sua presença é muito importante! Estamos te esperando, caso não confirme esta mensagem, sua consulta estará automaticamente desmarcada.%0A%0AAguardamos a sua presença.`;
          var url = `https://api.whatsapp.com/send?phone=${telefoneWhatsapp}&text=${mensagem}`;
          window.open(url, '_blank').focus();
        }
      }

      $scope.metodo1 = async function (valor1) {
        let situacao = ''
        await AgendamentoService.getOne(valor1).success((res) => {
          situacao = res.situacao
        })

        situacao = situacao == 'agendado' ?
          'chegada' :
          situacao == 'chegada' ?
          'em atendimento' :
          null

        let objetoUpdate = {
          id: valor1,
          situacao: situacao,
          updated_at: Utils.generateDateToDataBase()
        }

        let emailUsuario = localStorage.getItem('ngStorage-email').replace(/"/g, '')

        await ProfissionalService.getByMail(emailUsuario).success(async (e) => {
          await AgendamentoService.getAllByProfissionalID(e.profissional[0].id).success(async (el) => {
            if (situacao == 'chegada') {
              await AgendamentoService.update(objetoUpdate).success(() => {})
              $scope.buscarAgendamentosPorSalaID();
            }
            if (situacao == 'em atendimento') {
              let emAtend = el.agendamento.filter(e => e.situacao === 'em atendimento')
              if (emAtend.length > 0) {
                let idClinica = emAtend[0].clinicaID;
                ClinicaService.getOne(idClinica).success((res) => {
                  PacienteService.getOne(emAtend[0].pacienteID).success((resp) => {
                    SalaService.getOne(emAtend[0].salaId).success(sala => {
                      Utils.mensagemDeErro(
                        `Você já possui um atendimento em aberto! \n 
                        Feche para continuar.\n 
                        Agendamento em aberto: ${Utils.converterDataUSAtoBR(emAtend[0].data)}
                        Clinica em aberto: ${res.nome} - Sala: ${sala.nome}
                        Nome do paciente em aberto: ${resp.nome}
                      `, 6000)
                    })
                  })
                })
              } else {
                await AgendamentoService.update(objetoUpdate).success(() => {
                  AgendamentoService.getOne(valor1).success((res) => {
                    let event = {
                      id: res.id,
                      comentario: res.comentario,
                      pacienteID: res.pacienteID
                    }
                    localStorage.setItem('evento', JSON.stringify(event));
                    localStorage.setItem('flagEditando', true);
                    $location.path('/pacientes');
                  })
                })
              }
            }
          })
        })
      }

      async function buscarSalas(idClinica) {
        await SalaService.buscarSalasPorClinica(idClinica).success(res => {
          $scope.abas = res.salas;
        })
      }

      $scope.metodo2 = function (valor) {
        $scope.disabledButton = true
        $scope.flagEditando = !$scope.flagEditando;
        getOne(valor);
        buscarProfissionais();
        // Utils.mensagemDeSucesso('clicked ' + valor);
        // debugger;
        // Utils.mensagemDeSucesso('clicked ' + eventObj.extra);
      }

      var adicionarBotaoExtra = function () {
        $("<a class='btn btn-success botao-extra'>Chegou</a>").appendTo(".fc-time-grid-event");
      }

      async function buscarDadosClinicaPorId() {
        ClinicaService.getOne($scope.$storage.clinica.id).success((res) => {
          $scope.clinicaSelecionada = res
          popularCalendario();
        })
      }

      var buscarClinicaSelecionada = function () {
        if ($scope.$storage.clinica) {
          $scope.objeto.clinicaID = $scope.$storage.clinica.id;
          $scope.objeto.clinica = $scope.$storage.clinica;
          $scope.objeto.idUsuarioStorage = $scope.$storage.user_id
        } else {
          Utils.mensagemDeErro("Erro ao buscar clínica selecionada.");
        }
      }

      $scope.navegarParaCadastroDePaciente = function () {
        localStorage.setItem('novoPaciente', true);
        localStorage.setItem('novoPacienteNome', $scope.nomeOuCPF);

        $('#escolhaDoPaciente').modal('hide');

        setTimeout(async () => {
          window.location = "base.html#pacientes";
        }, 1000)

      }

      var tratarFluxoNovoPaciente = function () {
        $scope.disabledButton = false
        var novoPaciente = localStorage.getItem('novoPaciente');
        var idDoNovoPaciente = localStorage.getItem('idDoNovoPaciente');
        if (novoPaciente == "true" && idDoNovoPaciente) {
          buscarProfissionais();

          PacienteService.getOne(idDoNovoPaciente)
            .success(function (response) {
              $scope.selecionarPaciente(response);
              localStorage.setItem('novoPaciente', false);
            })
            .error(function (response) {
              Utils.mensagemDeErro("Erro ao buscar Paciente");
            });

          //preencher form com dados do paciente
        }
      }
      acessarPrimeiraClinica = async function () {
        let IdClinica = JSON.parse(localStorage.getItem('ngStorage-clinica')).id
        await buscarSalas(IdClinica);

        if ($scope.abas.length > 0) {

          let sala = JSON.parse(localStorage.getItem('ngStorage-sala'))
          if (sala) {
            let index = $scope.abas.findIndex(s => s.id == sala.id);
            if (index != -1) {
              $scope.selecionarSala(sala, index)
            } else {
              $scope.selecionarSala($scope.abas[0], 0)
            }
          } else {
            $scope.selecionarSala($scope.abas[0], 0)
          }
        }
      }

      init = async function () {
        await buscarDadosClinicaPorId();
        setTimeout(async () => {
          acessarPrimeiraClinica()
        }, 200)
        buscarProcedimentos();
        buscarClinicaSelecionada();
        tratarFluxoNovoPaciente();
      };

      init();
    }
  ]);