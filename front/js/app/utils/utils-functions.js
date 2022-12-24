angular
    .module('principal')
    .factory('Utils', Utils);

function Utils($http) {
    return {

        //12345678909 -> 123.456.789-09
        formatarCPF: function (cpf) {
            if (cpf.length == 11) {
                var cpfFormatado = cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9, 11);
                return cpfFormatado;
            } else {
                return cpf;
            }
        },

        mensagemDeErro: function (mensagem, timer) {
            swal({
                title: 'Aviso!',
                text: mensagem,
                timer: timer ? timer : 3000,
                icon: "error",
                button: false
            }).then(
                function () { },
                // handling the promise rejection
                function (dismiss) {
                    if (dismiss === 'timer') {
                        console.log('I was closed by the timer')
                    }
                }
            )
        },

        mensagemDeSucesso: function (mensagem) {
            swal({
                title: 'Aviso!',
                text: mensagem,
                timer: 3000,
                icon: "success",
                button: false
            }).then(
                function () { },
                // handling the promise rejection
                function (dismiss) {
                    if (dismiss === 'timer') {
                        console.log('I was closed by the timer')
                    }
                }
            )
        },

        mensagemDeSucessoOK: function (mensagem) {
            swal({
                text: mensagem,
            }).then(
                function () { },
                // handling the promise rejection
                function (dismiss) {
                }
            )
        },

        resetToastPosition: function() {
            $('.jq-toast-wrap').removeClass('bottom-left bottom-right top-left top-right mid-center'); // to remove previous position class
            $(".jq-toast-wrap").css({
              "top": "",
              "left": "",
              "bottom": "",
              "right": ""
            }); //to remove previous position style
        },

        apresentarToastSucesso: function(mensagem, tempo){
            resetToastPosition();

            if(!mensagem){
                mensagem = 'Sucesso!'
            }

            if(!tempo){
                tempo = mensagem.length * 80;
            }
    
            $.toast({
                heading: 'Informação',
                text: mensagem,
                showHideTransition: 'slide',
                icon: 'success',
                loaderBg: '#f96868',
                position: 'top-right',
                hideAfter: tempo, 
            })
        },

        apresentarToastErro: function(mensagem, tempo){
            resetToastPosition();

            if(!mensagem){
                mensagem = 'Erro!'
            }

            if(!tempo){
                tempo = mensagem.length * 80;
            }
    
            $.toast({
                heading: 'Atenção',
                text: mensagem,
                showHideTransition: 'slide',
                icon: 'warning',
                loaderBg: '#57c7d4',
                position: 'top-right',
                hideAfter: tempo, 
            })
        },

        ///////////////////////////////////////////////////////////////////////////////////////////
        /////  DATAS                ///////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////

        compareData: (compare, ano, mes, dia) => {
            mes = String(mes).length == 1 ? '0' + mes : mes;
            dia = String(dia).length == 1 ? '0' + dia : dia;
            return compare == ano + '-' + mes + '-' + dia;
        },

        completeData: (ano, mes, dia) => {
            mes = String(mes).length == 1 ? mes : mes;
            dia = String(dia).length == 1 ? dia : dia;
            return dia + '-' + mes + '-' + ano;
        },

        //yyyy-mm-dd -> dd-mm-yyyy
        //dd-mm-yyyy -> yyyy-mm-dd
        converterDataUSAtoBR: function (string) {
            var parts = string.split("-");
            return parts[2] + "-" + parts[1] + "-" + parts[0];
        },

        converterDataUSAtoBR_v2: function (string) {
            var parts = string.split("-");
            return parts[2] + "/" + parts[1] + "/" + parts[0];
        },
        
        // 13/12/2017 -> 2017-12-13
        // dd/mm/yyyy -> yyyy-mm-dd
        converterDataBRtoUSA: function (dataBrasil) {
            return "" + dataBrasil.substring(6, 12) + "-" + dataBrasil.substring(3, 5) + "-" + dataBrasil.substring(0, 2);
        },

        //2021-02-17 13:37:36
        //yyyy-mm-dd HH:MM:SS
        generateDateToDataBase(){
            var data = this.getDateArray();
            return data[2] + "-" + data[1] + "-" + data[0] + " " + data[3]  + ":" +  data[4]  + ":" +  data[5]; 
        },

        // Date -> yyyy-mm-dd
        getDateStringFromDate(date){
            var array = this.getDateArray(date);
            return array[2] + "-" + array[1] + "-" + array[0];
        },

        //yyyy-mm-dd -> new Date(...)
        getDateFromString(stringDate){
            var result = stringDate.split('-');
            return new Date(result[0], result[1]-1, result[2]);
        },

        //yyyy-mm-dd -> 3 meses depois (2021-02-25)
        incrementarData(dataString, months){
            var date = this.getDateFromString(dataString);
            var d = date.getDate();
            date.setMonth(date.getMonth() + +months);
            if (date.getDate() != d) {
                date.setDate(0);
            }
            return this.getDateStringFromDate(date);
        },

        //yyyy-mm-dd -> 2 dias depois (2020-01-27)
        incrementarDia(dataString, increment){
            var date = this.getDateFromString(dataString);
            var d = date.getDate();
            date.setDate(date.getDate() + +increment);
            // if (date.getDate() != d) {
            //     date.setDate(0);
            // }
            return this.getDateStringFromDate(date);
        },

        getDateArray(currentDate) {
            var data = currentDate;
            
            if(currentDate==undefined){
                data = new Date();
            }

            dia = data.getDate().toString().padStart(2, '0');
            mes = (data.getMonth() + 1).toString().padStart(2, '0');
            ano = data.getFullYear();
            hora = data.getHours();
            minuto = data.getMinutes();
            segundo = data.getSeconds();

            return new Array(dia, mes, ano, hora, minuto, segundo);
        },

        ///////////////////////////////////////////////////////////////////////////////////////////

        converterValorLiteralEmFloat: function (num) {
            var numero = num.toString().replace(/\./g, '');  //remover pontos de milhar
            numero = numero.toString().replace('R$', '');    //remover cifrão
            numero = numero.replace(/ /g, '');                 //remover espaço em branco
            numero = numero.replace(/,/g, '.');              //trocar virgulas por ponto
            return parseFloat(numero); 					  //converter em float
        },


        isEmpytNullOrUndefined: function (valor) {
            if (typeof (valor) === "undefined" || valor === null || valor == '') {
                return true;
            }

            return false;
        },

        criarFaceDentes: function () {
            return [
                { nome: 'O/I', id: 0 },
                { nome: 'D', id: 1 },
                { nome: 'M', id: 2 },
                { nome: 'V', id: 3 },
                { nome: 'P/L', id: 4 },
            ]
        },

        criarSituacaoDentes: () => {
            return [
                { nome: 'Higido', id: 0 },
                { nome: 'Ausente', id: 1 },
                { nome: 'Cariado', id: 2 },
                { nome: 'Fraturado', id: 3 },
                { nome: 'Incluso', id: 4 },
                { nome: 'Restaurado', id: 5 },
                { nome: 'Suspeito', id: 6 },
            ]
        },

        criarDentes: () => {
            return [
                {nome: '18', id:1 },
                {nome: '17', id:2 },
                {nome: '16', id:3 },
                {nome: '15', id:4 },
                {nome: '14', id:5 },
                {nome: '13', id:6 },
                {nome: '12', id:7 },
                {nome: '11', id:8 },
                {nome: '21', id:9 },
                {nome: '22', id:10 },
                {nome: '23', id:11 },
                {nome: '24', id:12 },
                {nome: '25', id:13 },
                {nome: '26', id:14 },
                {nome: '27', id:15 },
                {nome: '28', id:16 },
                {nome: '55', id:17 },
                {nome: '54', id:18 },
                {nome: '53', id:19 },
                {nome: '52', id:20 },
                {nome: '51', id:21 },
                {nome: '61', id:22 },
                {nome: '62', id:23 },
                {nome: '63', id:24 },
                {nome: '64', id:25 },
                {nome: '65', id:26 },
                {nome: '85', id:27 },
                {nome: '84', id:28 },
                {nome: '83', id:29 },
                {nome: '82', id:30 },
                {nome: '81', id:31 },
                {nome: '71', id:32 },
                {nome: '72', id:33 },
                {nome: '73', id:34 },
                {nome: '74', id:35 },
                {nome: '75', id:36 },
                {nome: '48', id:37 },
                {nome: '47', id:38 },
                {nome: '46', id:39 },
                {nome: '45', id:40 },
                {nome: '44', id:41 },
                {nome: '43', id:42 },
                {nome: '42', id:43 },
                {nome: '41', id:44 },
                {nome: '31', id:45 },
                {nome: '32', id:46 },
                {nome: '33', id:47 },
                {nome: '34', id:48 },
                {nome: '35', id:49 },
                {nome: '36', id:50 },
                {nome: '37', id:51 },
                {nome: '38', id:52 },
                {nome: 'face', id:53 },
                {nome: 'boca toda', id:54 },
                {nome: 'supranumerários', id:55 },
                {nome: 'arcada superior', id:56 },
                {nome: 'arcada inferior', id:57 },
                {nome: 'HASD', id:58 },
                {nome: 'HASE', id:59 },
                {nome: 'HAIE', id:60 },
                {nome: 'HAID', id:61 },
            ]
        },

        gerarCores: () =>{
            return [{
                cod: '#00FFFF',
                nome: 'Cyan'
            },
            {
                cod: '#778899',
                nome: 'Light Slate Gray'
            },
            {
                cod: '#D02090',
                nome: 'Violet Red'
            },
            {
                cod: '#76EE00',
                nome: 'Chartreuse 2'
            },
            {
                cod: '#8B7500',
                nome: 'Gold 4'
            },
            {
                cod: '#FF8247',
                nome: 'Sienna 1'
            },
            {
                cod: '#FF4040',
                nome: 'Brown'
            },
            {
                cod: '#C1FFC1',
                nome: 'DarkSeaGreen1'
            },
            {
                cod: '#BC8F8F',
                nome: 'Rosy Brown'
            },
            {
                cod: '#00FF7F',
                nome: 'Spring Green'
            }
        ]
        },

        posicionarDentes: () => {
            var linhaBase = 0;

            var espacamento = 27;
            var linha1 = linhaBase + espacamento;
            var linha2 = linhaBase + linha1 + espacamento + 10;
            var linha3 = linhaBase + linha2 + espacamento;
            var linha4 = linhaBase + linha3 + espacamento + 20;
            var linha5 = linhaBase + linha4 + espacamento;
            var linha6 = linhaBase + linha5 + espacamento + 10;
            var linha7 = linhaBase + linha6 + espacamento + 10;
            var direita = 250;
            var espacamentoLaranja = 80;

            $("a.dente-58").parent().css('top',linha1 + 'px'); $("a.dente-58").parent().css('left','0px'); $("a.dente-58").css('background-color','#FDC90C'); 
            //arcada superior
            $("a.dente-56").parent().css('top',linha1 + 'px'); $("a.dente-56").parent().css('left', 180 + 'px'); $("a.dente-56").css('background-color','#FDC90C'); 
            $("a.dente-59").parent().css('top',linha1 + 'px'); $("a.dente-59").parent().css('left', 418 + 'px'); $("a.dente-59").css('background-color','#FDC90C'); 

            $("a[value='18']").parent().css('top',linha3 + 'px'); $("a[value='18']").parent().css('left', 0+(espacamento*0) + 'px');
            $("a[value='17']").parent().css('top',linha3 + 'px'); $("a[value='17']").parent().css('left', 0+(espacamento*1) + 'px');
            $("a[value='16']").parent().css('top',linha3 + 'px'); $("a[value='16']").parent().css('left', 0+(espacamento*2) + 'px');
            $("a[value='15']").parent().css('top',linha3 + 'px'); $("a[value='15']").parent().css('left', 0+(espacamento*3) + 'px');
            $("a[value='14']").parent().css('top',linha3 + 'px'); $("a[value='14']").parent().css('left', 0+(espacamento*4) + 'px');
            $("a[value='13']").parent().css('top',linha3 + 'px'); $("a[value='13']").parent().css('left', 0+(espacamento*5) + 'px');
            $("a[value='12']").parent().css('top',linha3 + 'px'); $("a[value='12']").parent().css('left', 0+(espacamento*6) + 'px');
            $("a[value='11']").parent().css('top',linha3 + 'px'); $("a[value='11']").parent().css('left', 0+(espacamento*7) + 'px');

            $("a[value='21']").parent().css('top',linha3 + 'px'); $("a[value='21']").parent().css('left', direita+(espacamento*0) + 'px');
            $("a[value='22']").parent().css('top',linha3 + 'px'); $("a[value='22']").parent().css('left', direita+(espacamento*1) + 'px');
            $("a[value='23']").parent().css('top',linha3 + 'px'); $("a[value='23']").parent().css('left', direita+(espacamento*2) + 'px');
            $("a[value='24']").parent().css('top',linha3 + 'px'); $("a[value='24']").parent().css('left', direita+(espacamento*3) + 'px');
            $("a[value='25']").parent().css('top',linha3 + 'px'); $("a[value='25']").parent().css('left', direita+(espacamento*4) + 'px');
            $("a[value='26']").parent().css('top',linha3 + 'px'); $("a[value='26']").parent().css('left', direita+(espacamento*5) + 'px');
            $("a[value='27']").parent().css('top',linha3 + 'px'); $("a[value='27']").parent().css('left', direita+(espacamento*6) + 'px');
            $("a[value='28']").parent().css('top',linha3 + 'px'); $("a[value='28']").parent().css('left', direita+(espacamento*7) + 'px');

            $("a[value='55']").parent().css('top',linha2 + 'px'); $("a[value='55']").parent().css('left',espacamentoLaranja+(espacamento*0) + 'px');$("a[value='55']").css('background-color','#FA7F27'); 
            $("a[value='54']").parent().css('top',linha2 + 'px'); $("a[value='54']").parent().css('left',espacamentoLaranja+(espacamento*1) + 'px');$("a[value='54']").css('background-color','#FA7F27'); 
            $("a[value='53']").parent().css('top',linha2 + 'px'); $("a[value='53']").parent().css('left',espacamentoLaranja+(espacamento*2) + 'px');$("a[value='53']").css('background-color','#FA7F27'); 
            $("a[value='52']").parent().css('top',linha2 + 'px'); $("a[value='52']").parent().css('left',espacamentoLaranja+(espacamento*3) + 'px');$("a[value='52']").css('background-color','#FA7F27'); 
            $("a[value='51']").parent().css('top',linha2 + 'px'); $("a[value='51']").parent().css('left',espacamentoLaranja+(espacamento*4) + 'px');$("a[value='51']").css('background-color','#FA7F27'); 

            $("a[value='61']").parent().css('top',linha2 + 'px'); $("a[value='61']").parent().css('left', direita+(espacamento*0) + 'px');$("a[value='61']").css('background-color','#FA7F27'); 
            $("a[value='62']").parent().css('top',linha2 + 'px'); $("a[value='62']").parent().css('left', direita+(espacamento*1) + 'px');$("a[value='62']").css('background-color','#FA7F27'); 
            $("a[value='63']").parent().css('top',linha2 + 'px'); $("a[value='63']").parent().css('left', direita+(espacamento*2) + 'px');$("a[value='63']").css('background-color','#FA7F27'); 
            $("a[value='64']").parent().css('top',linha2 + 'px'); $("a[value='64']").parent().css('left', direita+(espacamento*3) + 'px');$("a[value='64']").css('background-color','#FA7F27'); 
            $("a[value='65']").parent().css('top',linha2 + 'px'); $("a[value='65']").parent().css('left', direita+(espacamento*4) + 'px');$("a[value='65']").css('background-color','#FA7F27'); 

            $("a[value='48']").parent().css('top',linha4 + 'px'); $("a[value='48']").parent().css('left', 0+(espacamento*0) + 'px');
            $("a[value='47']").parent().css('top',linha4 + 'px'); $("a[value='47']").parent().css('left', 0+(espacamento*1) + 'px');
            $("a[value='46']").parent().css('top',linha4 + 'px'); $("a[value='46']").parent().css('left', 0+(espacamento*2) + 'px');
            $("a[value='45']").parent().css('top',linha4 + 'px'); $("a[value='45']").parent().css('left', 0+(espacamento*3) + 'px');
            $("a[value='44']").parent().css('top',linha4 + 'px'); $("a[value='44']").parent().css('left', 0+(espacamento*4) + 'px');
            $("a[value='43']").parent().css('top',linha4 + 'px'); $("a[value='43']").parent().css('left', 0+(espacamento*5) + 'px');
            $("a[value='42']").parent().css('top',linha4 + 'px'); $("a[value='42']").parent().css('left', 0+(espacamento*6) + 'px');
            $("a[value='41']").parent().css('top',linha4 + 'px'); $("a[value='41']").parent().css('left', 0+(espacamento*7) + 'px');

            $("a[value='31']").parent().css('top',linha4 + 'px'); $("a[value='31']").parent().css('left', direita+(espacamento*0) + 'px');
            $("a[value='32']").parent().css('top',linha4 + 'px'); $("a[value='32']").parent().css('left', direita+(espacamento*1) + 'px');
            $("a[value='33']").parent().css('top',linha4 + 'px'); $("a[value='33']").parent().css('left', direita+(espacamento*2) + 'px');
            $("a[value='34']").parent().css('top',linha4 + 'px'); $("a[value='34']").parent().css('left', direita+(espacamento*3) + 'px');
            $("a[value='35']").parent().css('top',linha4 + 'px'); $("a[value='35']").parent().css('left', direita+(espacamento*4) + 'px');
            $("a[value='36']").parent().css('top',linha4 + 'px'); $("a[value='36']").parent().css('left', direita+(espacamento*5) + 'px');
            $("a[value='37']").parent().css('top',linha4 + 'px'); $("a[value='37']").parent().css('left', direita+(espacamento*6) + 'px');
            $("a[value='38']").parent().css('top',linha4 + 'px'); $("a[value='38']").parent().css('left', direita+(espacamento*7) + 'px');

            $("a[value='85']").parent().css('top',linha5 + 'px'); $("a[value='85']").parent().css('left',espacamentoLaranja+(espacamento*0) + 'px');$("a[value='85']").css('background-color','#FA7F27');
            $("a[value='84']").parent().css('top',linha5 + 'px'); $("a[value='84']").parent().css('left',espacamentoLaranja+(espacamento*1) + 'px');$("a[value='84']").css('background-color','#FA7F27');
            $("a[value='83']").parent().css('top',linha5 + 'px'); $("a[value='83']").parent().css('left',espacamentoLaranja+(espacamento*2) + 'px');$("a[value='83']").css('background-color','#FA7F27');
            $("a[value='82']").parent().css('top',linha5 + 'px'); $("a[value='82']").parent().css('left',espacamentoLaranja+(espacamento*3) + 'px');$("a[value='82']").css('background-color','#FA7F27');
            $("a[value='81']").parent().css('top',linha5 + 'px'); $("a[value='81']").parent().css('left',espacamentoLaranja+(espacamento*4) + 'px');$("a[value='81']").css('background-color','#FA7F27');

            $("a[value='71']").parent().css('top',linha5 + 'px'); $("a[value='71']").parent().css('left', direita+(espacamento*0) + 'px');$("a[value='71']").css('background-color','#FA7F27');
            $("a[value='72']").parent().css('top',linha5 + 'px'); $("a[value='72']").parent().css('left', direita+(espacamento*1) + 'px');$("a[value='72']").css('background-color','#FA7F27');
            $("a[value='73']").parent().css('top',linha5 + 'px'); $("a[value='73']").parent().css('left', direita+(espacamento*2) + 'px');$("a[value='73']").css('background-color','#FA7F27');
            $("a[value='74']").parent().css('top',linha5 + 'px'); $("a[value='74']").parent().css('left', direita+(espacamento*3) + 'px');$("a[value='74']").css('background-color','#FA7F27');
            $("a[value='75']").parent().css('top',linha5 + 'px'); $("a[value='75']").parent().css('left', direita+(espacamento*4) + 'px');$("a[value='75']").css('background-color','#FA7F27');

            $("a.dente-61").parent().css('top',linha6 + 'px'); $("a.dente-61").parent().css('left','0px');$("a.dente-61").css('background-color','#FDC90C'); 
            //arcada inferior
            $("a.dente-57").parent().css('top',linha6 + 'px'); $("a.dente-57").parent().css('left', 180 + 'px');$("a.dente-57").css('background-color','#FDC90C'); 
            $("a.dente-60").parent().css('top',linha6 + 'px'); $("a.dente-60").parent().css('left', 418 + 'px');$("a.dente-60").css('background-color','#FDC90C'); 

            //face
            // var espacament
            $("a.dente-53").parent().css('top',linha7 + 'px'); $("a.dente-53").parent().css('left', 90 + 'px');$("a.dente-53").css('background-color','#FDC90C'); 
            $("a.dente-54").parent().css('top',linha7 + 'px'); $("a.dente-54").parent().css('left', 150 + -10 + 'px');$("a.dente-54").css('background-color','#FDC90C'); 
            //supra
            $("a.dente-55").parent().css('top',linha7 + 'px'); $("a.dente-55").parent().css('left', 230 + 'px');$("a.dente-55").css('background-color','#FDC90C'); 

            //HORIZONTAL
            var horizontal = document.createElement("SPAN");
            horizontal.id = 'horizontal';
            document.getElementById('odontograma').appendChild(horizontal);
            $("#horizontal").css('background-color', "gray");
            $("#horizontal").css('display', "block");
            $("#horizontal").css('height', 4 + 'px');
            $("#horizontal").css('width', 360 + 'px');
            $("#horizontal").css('position', "absolute");
            $("#horizontal").css('top', "129px");
            $("#horizontal").css('left', "58px");


            //VERTICAL
            var vertical = document.createElement("SPAN");
            vertical.id = 'vertical';
            document.getElementById('odontograma').appendChild(vertical);
            $("#vertical").css('background-color', "gray");
            $("#vertical").css('display', "block");
            $("#vertical").css('width', 4 + 'px');
            $("#vertical").css('height', 140 + 'px');
            $("#vertical").css('position', "absolute");
            $("#vertical").css('top', "60px");
            $("#vertical").css('left', "237px");

        },

        moneyBRtoUSA(valor){
            var retorno = valor.replace(',', '.')
            return retorno;
        },

        moneyUSAtoBR(valor){
            var retorno = valor.replace('.', ',')
            return retorno;
        },

        //number -> string (1234.567 -> R$ 1.234,56)
        formatMoney(number, decPlaces, decSep, thouSep) {
            return number.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        },

        getNumberWithZero(number){
            if(number<10){
                return "0" + number;
            }else{
                return number;
            }
        }

    };
}