angular.module('principal')
    .controller('PdfController', ['$scope', '$rootScope', 'ClinicaService', 'AgendamentoService', 'ProfissionalService', 'PacienteService', 'AtestadoService', 'Utils',
        function ($scope, $rootScope, ClinicaService, AgendamentoService, ProfissionalService, PacienteService, AtestadoService, Utils) {
            $rootScope.$on("emitPrintPdf", function (event, args) {
                buscarDadosParaImpressao(args);
            });

            async function buscarDadosParaImpressao(args){
                if (args.from == 'exames') {
                    $scope.textoAtestado = null;
                    $scope.textoTimbrado = null;
                    $scope.recomendacoesPrescricao = null
                    $scope.listaMedicamentosInseridos = null
                    $scope.especial = false;

                    $scope.cid = args.cid;
                    $scope.titulo = args.titulo
                    $scope.listaExamesInseridos = args.data;
                    $scope.recomendacoesExames = args.recomendacoes;
                }
                if (args.from == 'atestado') {
                    $scope.textoAtestado = true;
                    $scope.especial = false;

                    $scope.cid = args.cid;
                    $scope.textoTimbrado = null
                    $scope.recomendacoesExames = null
                    $scope.listaExamesInseridos = null
                    $scope.recomendacoesPrescricao = null
                    $scope.listaMedicamentosInseridos = null

                    setTimeout(() => {
                        $('#textoAtestado').html(args.data)
                    }, 10);
                    $scope.titulo = args.titulo
                }
                if (args.from == 'timbrado') {
                    $scope.textoTimbrado = true;
                    $scope.especial = false;

                    $scope.cid = null;
                    $scope.textoAtestado = null;
                    $scope.recomendacoesExames = null
                    $scope.listaExamesInseridos = null
                    $scope.recomendacoesPrescricao = null
                    $scope.listaMedicamentosInseridos = null;

                    setTimeout(() => {
                        $('#textoTimbrado').html(args.data)
                    }, 10);
                    $scope.titulo = args.titulo
                }
                if (args.from == 'prescricao') {
                    $scope.textoAtestado = null;
                    $scope.textoTimbrado = null;
                    $scope.textoAtestado = null;
                    $scope.recomendacoesExames = null;
                    $scope.listaExamesInseridos = null;

                    $scope.cid = args.cid;
                    $scope.especial = args.especial;
                    $scope.titulo = args.titulo
                    $scope.recomendacoesPrescricao = args.recomendacoes;
                    $scope.listaMedicamentosInseridos = args.data;
                }

                $scope.dataAtual = new Date()
                var diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
                $scope.diaSemana = diasSemana[$scope.dataAtual.getDay()];
                $scope.dia = $scope.dataAtual.getDate();
                var mesesAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                $scope.mes = mesesAno[$scope.dataAtual.getMonth()]
                $scope.ano = $scope.dataAtual.getFullYear();

                $scope.objetoClinica = {}
                $scope.dentistaObjeto = args.dentista
                $scope.emitidoPor = localStorage.getItem('ngStorage-nome')
                $scope.pacienteNome = ''
                $scope.pacienteCpf = ''
                $scope.pacienteIdade = ''
                $scope.pacienteNascimento = ''
            
            
                await buscarClinica();
            }

            async function buscarClinica() {
                ClinicaService.getOne(localStorage.getItem('clinicaId')).success((res) => {
                    $scope.objetoClinica.logo = res.logo
                    $scope.objetoClinica.nome = res.nome
                    $scope.objetoClinica.endereco = res.endereco
                    $scope.objetoClinica.cnpj = res.cnpj
                    $scope.objetoClinica.tel = res.telefone
                    buscarAgendPacProf()
                })
            }

            async function buscarAgendPacProf() {
                await AgendamentoService.getOne(localStorage.getItem('agendamentoID')).success(async (res) => {
                    // await buscarProfissional(res);
                    await buscarPaciente(res)
                })
            }

            function buscarProfissional(res) {
                ProfissionalService.getOne(res.profissionalID).success((res) => {
                    $scope.dentistaObjeto = res;
                })
            }

            function buscarPaciente(res) {
                PacienteService.getOne(res.pacienteID).success((res) => {
                    $scope.pacienteNome = res.nome
                    $scope.pacienteCpf = res.cpf

                    if( !Utils.isEmpytNullOrUndefined(res.nascimento) ){
                        $scope.pacienteIdade = calculaIdade(Utils.converterDataUSAtoBR(res.nascimento))
                    }else{
                        $scope.pacienteIdade = null;
                    }
                    
                    $scope.pacienteNascimento = convertPtBR(res.nascimento)

                    var nuncaAbriu = localStorage.getItem("abrirImpressao") == null;
                    var naoEstaAberto = localStorage.getItem("abrirImpressao") == "false";

                    if (nuncaAbriu || naoEstaAberto) {
                        localStorage.setItem("abrirImpressao", true); 
                        $scope.openPdf();
                    }
                })
            }

            function convertPtBR(data) {
                let dia = new Date(data).getDate() + 1
                let mes = new Date(data).getMonth()
                var mesesAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                return dia + '/' + mesesAno[mes].substr(0, 3)
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

            $scope.openPdf = async () => {
                setTimeout(() => {
                    var DocumentContainer = document.getElementById('printableAreaPdf');
                    var WindowObject = window.open('', 'PrintWindow', 'width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');

                    WindowObject.document.write('<html><head><title>Print it!</title><link rel="stylesheet" type="text/css" href="css/custom.css"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> </head><body>');
                    WindowObject.document.writeln(DocumentContainer.innerHTML);
                    WindowObject.document.writeln('</body></html>');
                    localStorage.setItem("abrirImpressao", false);
                    
                    
                    setTimeout(() => {
                        WindowObject.document.close();
                        // WindowObject.focus();
                        WindowObject.print();
                        // WindowObject.close();
                        // $scope.closeModalPrescricao()
                    }, 1500)
                    
                    
                }, 800);
                
            }

            init = async function () { };

            init();
        }
    ]);