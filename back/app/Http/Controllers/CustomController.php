<?php



namespace App\Http\Controllers;



use Illuminate\Http\Request;

use Illuminate\Http\Response;

use App\Http\Controllers\Controller;

use Tymon\JWTAuth\JWTAuth;

use DateTime;

use DB;


class CustomController extends Controller{

    public function __construct(){
        
    }

    public function upload(Request $request){

        if($request->hasFile('files') and $request->file('files')->isValid()){
            $file = $request->file('files'); 
            $destino = $request->input('destino', 'geral');

            $destinationPath = public_path().DIRECTORY_SEPARATOR.'upload/'.$destino;

            //montando o nome
            // date_default_timezone_set('America/Sao_Paulo');
            $name = date("Y-m-d-H-i-s");
            // $extension = $file->guessExtension();
            $path_info = pathinfo($file);
            $extension = $file->getClientOriginalExtension();
            $fullName = $name.".".$extension;
            $rrr = $request->file('files')->move($destinationPath, $fullName);

        
            return response()->json([
                'url' => $destino.'/'.$fullName
            ]);
        }else{
            return response()->json([
                'nada bom' => 'nao mesmo',
            ]);
        }
    }

    public function uploadV2(Request $request){

        if($request->hasFile('files') and $request->file('files')->isValid()){
            $file = $request->file('files'); 
            $destino = $request->input('destino', 'geral');

            $destinationPath = public_path().DIRECTORY_SEPARATOR.'upload/'.$destino;

            //montando o nome
            // date_default_timezone_set('America/Sao_Paulo');
            $name = date("Y-m-d-H-i-s");
            // $extension = $file->guessExtension();
            $path_info = pathinfo($file);
            $extension = $file->getClientOriginalExtension();
            $fullName = $name.".".$extension;
            $rrr = $request->file('files')->move($destinationPath, $fullName);
        
            return response()->json([
                'url' => $fullName
            ]);
        }else{
            return response()->json([
                'nada bom' => 'nao mesmo',
            ]);
        }
    }

    public function buscarAgendamentos(Request $request){
        $agendamentos = DB::select('SELECT agendamento.id, agendamento.data, agendamento.situacao, paciente.nome, 
        agendamento.horarioInicio, agendamento.horarioFim, clinica.id as clinicaID
        from agendamento 
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN clinica on clinica.id = agendamento.clinicaID
        WHERE agendamento.deleted_at is null
        ');
        return $agendamentos;
    }

    public function buscarAgendamentosPorPacienteID(Request $request, $pacienteID){
        $agendamentos = DB::select("SELECT agendamento.id, agendamento.data, agendamento.situacao, paciente.nome, 
        agendamento.horarioInicio, agendamento.horarioFim, profissional.nome as profissionalNome, profissional.id as profissionalID, agendamento.clinicaID, 
        agendamento.descricao as descricao, agendamento.comentario as comentario
        from agendamento 
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN profissional on profissional.id = agendamento.profissionalID
        WHERE paciente.id = $pacienteID and agendamento.deleted_at is null
        ");
        return $agendamentos;
    }

    public function buscarAgendamentosPorClinicaID(Request $request, $id){
        $agendamentos = DB::select("SELECT agendamento.id, agendamento.data, agendamento.situacao, paciente.nome, 
        agendamento.horarioInicio, agendamento.horarioFim, profissional.nome as profissionalNome, profissional.id as profissionalID, clinica.id as clinicaID
        from agendamento 
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN profissional on profissional.id = agendamento.profissionalID
        JOIN clinica on clinica.id = agendamento.clinicaID
        WHERE clinica.id = $id and agendamento.deleted_at is null
        ");
        return $agendamentos;
    }

    public function buscarAgendamentosPorSalaID(Request $request, $id){
        $agendamentos = DB::select("SELECT agendamento.id, 
        agendamento.data, 
        agendamento.situacao, 
        paciente.nome, 
        paciente.telefone, 
        agendamento.horarioInicio, 
        agendamento.horarioFim, 
        profissional.nome as profissionalNome, 
        profissional.id as profissionalID, 
        salas.id as salaID
        from agendamento
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN profissional on profissional.id = agendamento.profissionalID
        JOIN salas on salas.id = agendamento.salaId
        where salaID = $id and agendamento.deleted_at is null
        ");
        return $agendamentos;
    }

    public function buscarAgendamentosPorClinicaIDEProfissionalID(Request $request, $clinicaID, $profissionalID){
        $agendamentos = DB::select("SELECT agendamento.id, agendamento.data, agendamento.situacao, paciente.nome, 
        agendamento.horarioInicio, agendamento.horarioFim, profissional.nome as profissionalNome, profissional.id as profissionalID, clinica.id as clinicaID
        from agendamento 
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN profissional on profissional.id = agendamento.profissionalID
        JOIN clinica on clinica.id = agendamento.clinicaID
        WHERE clinica.id = $clinicaID and profissional.id = $profissionalID and agendamento.deleted_at is null
        ");
        return $agendamentos;
    }

    public function buscarAgendamentosPorClinicaData(Request $request, $clinicaID, $de, $ate){

        
        $agendamentos = DB::select("SELECT 
            agendamento.id, 
            agendamento.data, 
            agendamento.situacao, 
            paciente.nome, 
            agendamento.horarioInicio, 
            agendamento.horarioFim, 
            profissional.nome as profissionalNome, 
            profissional.id as profissionalID, 
            clinica.id as clinicaID
        from agendamento 
                JOIN paciente on paciente.id 			= agendamento.pacienteID
                JOIN profissional on profissional.id 	= agendamento.profissionalID
                JOIN clinica on clinica.id 				= agendamento.clinicaID
        WHERE 
            clinica.id = $clinicaID 
            and agendamento.data BETWEEN '$de' and '$ate' and agendamento.deleted_at is null ");
        

        
        return $agendamentos;
    }
    
    public function buscarAgendamentosPorSalaIDEData(Request $request, $salaID, $de, $ate){
        $agendamentos = DB::select("SELECT agendamento.id, agendamento.data, agendamento.situacao, paciente.nome, 
        agendamento.horarioInicio, agendamento.horarioFim, profissional.nome as profissionalNome, profissional.id as profissionalID, salas.id as salaID
        from agendamento 
        JOIN paciente on paciente.id = agendamento.pacienteID
        JOIN profissional on profissional.id = agendamento.profissionalID
        JOIN salas on salas.id = agendamento.salaId
        where salaID = $salaID and agendamento.data BETWEEN '$de' and '$ate' and agendamento.deleted_at is null
        ");
        return $agendamentos;
    }
    
    public function findPlanejamentosFinanceiros(Request $request, $pacienteID){
        $resultados = DB::select("SELECT
        pf.id planejamentoID,
        ag.data dataAtendimento,
        ag.id idAgendamento,
        pr.apelido apelidoDoDentista,
        pr.id profissionalID,
        cl.nome nomeDaClinica,
        pf.status status,
        pf.desconto desconto,
        pf.recibo,
        pf.notaFiscal,
        (
            SELECT EXISTS 
            (SELECT 
                vencimento, NOW(), vencimento<NOW() as parcela_vencida from planejamentoPagamento pp 
                where planejamento_id = pf.id and vencimento<NOW()=1 and deleted_at is null and status != 'RECEBIDO'
            ) 
        ) as parcela_vencida,
        (
            SELECT EXISTS (SELECT 
                pagamento from planejamentoPagamento pp 
                where planejamento_id = pf.id and pp.pagamento is null and deleted_at is null
            ) 
                
        ) as parcelas_em_aberto,
        (
            SELECT 
                count(*) from planejamentoPagamento pp 
                where planejamento_id = pf.id and deleted_at is null
             
                
        ) as parcelas_quantidade
        
        from planejamentoFinanceiro pf
        join agendamento as ag on pf.agendamento_id = ag.id
        join profissional pr on ag.profissionalID = pr.id
        join clinica cl on ag.clinicaID = cl.id
        where ag.pacienteID = $pacienteID");
        
        return $resultados;
    }
    
    /* 
        buscar os procedimentos marcados como particular
    */
    public function findProcedimentosByAgendamentoID(Request $request, $agendamentoID){
        $resultados = DB::select("SELECT op.id odontogramaProcedimentoID, op.ativo, pr.nome, pr.categoria, op.valor, op.dentistaExecutorID  
        from odontogramaProcedimento op
        join odontograma o on o.id = op.odontogramaID 
        join agendamento ag on ag.id = o.agendamentoID 
        join procedimento pr on pr.id = op.procedimentoID 
        where odontogramaID in (
        	select id from odontograma o 
        	where agendamentoID = $agendamentoID
        ) and tipo = 'particular' ");
        
        return $resultados;
    }

    /* 
        criar procedimentos marcados como particular baseado no AgendamentoID
    */
    public function criarPlanejamentosBaseadosNoAgendamentoID(Request $request, $agendamentoID){
        $response = DB::insert("INSERT INTO planejamentoFinanceiro (agendamento_id, dentista_id , status , desconto , created_at, notaFiscal, recibo )
        select
        od.agendamentoID as a,
        pr.id as b,
        'nao_aprovado' as c,
        0 as d,
        now() as e,
        '' as f,
        '' as g
        from odontogramaProcedimento op
        join odontograma od on op.odontogramaID = od.id
        join agendamento ag on od.agendamentoID = ag.id
        join profissional pr on ag.profissionalID = pr.id
        
        WHERE NOT EXISTS (
            select id from planejamentoFinanceiro where agendamento_id = od.agendamentoID
        ) and op.tipo = 'particular' and od.agendamentoID = '$agendamentoID' 
        GROUP BY(ag.id);");

        if($response){
            return "ok";
        }else{
            return "nok";
        }
    }

    public function apagarPlanejamentoPagamentosByPlanejamentoID(Request $request, $planejamentoID){
        $response = DB::update("update planejamentoPagamento 
        set deleted_at = NOW()
        where planejamento_id = $planejamentoID;
        ");
        return $response;
    }

    public function salvarModalInlineAcertos(Request $request, $acertoId,$valor,$coluna){
        $response = DB::update("update acertos 
        set $coluna = '$valor'
        where id = $acertoId;
        ");
        return $response;
    }

    public function buscarProcedimentoParticularPorAgendamentoID($agendamentoID){
        $resultados = DB::select("select *
        from odontogramaProcedimento op
        join odontograma od on op.odontogramaID = od.id
        join agendamento ag on od.agendamentoID = ag.id
        join profissional pr on ag.profissionalID = pr.id
        where op.tipo = 'particular' and od.agendamentoID = $agendamentoID;");
        
        return $resultados;
    }

    public function buscarPlanejamentoAprovadoPorAgendamentoID($agendamentoID){
        $resultados = DB::select("select id, agendamento_id, status from planejamentoFinanceiro pf
        where agendamento_id  = $agendamentoID and status = 'aprovado';");
        
        return $resultados;
    }

    public function buscarParcelasVencidas($pacienteID){
        $resultados = DB::select("
            select pp.vencimento, pp.valor, pf.agendamento_id, ag.pacienteID from planejamentoPagamento pp 

            join planejamentoFinanceiro pf on pf.id = pp.planejamento_id
            join agendamento ag ON ag.id = pf.agendamento_id 
            where 
            -- nao excluidos
            pp.deleted_at is null 
            
            -- vencidos
            and pp.vencimento < NOW() 
            
            -- nao foi pago
            and pp.pagamento is null
            
            -- do paciente atual
            and ag.pacienteID = $pacienteID;
        ");

        return $resultados;
    }

    public function criarProcedimentosPadraoParaNovasClinicas(Request $request, $clinicaID){
        $response = DB::insert("INSERT INTO procedimento (created_at, updated_at, nome, valor1, valor2, valor3, valor4, valor5, descricao, categoria, status, codigo, clinicaId)
        SELECT now(), null, nome, valor1, valor2, valor3, valor4, valor5, descricao, categoria, status, codigo, $clinicaID
        FROM procedimento where clinicaId is null;");

        if($response){
            return "ok";
        }else{
            return "nok";
        }
    }

    public function criarEstoquePadraoParaNovaClinica(Request $request, $clinicaID){
        $response = DB::insert("INSERT INTO estoque (
            created_at, 
            produto,
            marca,
            medida,
            quantidadeEstoque,
            quantidadeSala,
            limite,
            dataUltimaCompra,
            dataVencimento,
            ultimoPrecoPago,
            clinicaID,
            userID
            )
        SELECT now(), 
                produto,
                marca,
                medida,
                quantidadeEstoque,
                quantidadeSala,
                limite,
                dataUltimaCompra,
                dataVencimento,
                ultimoPrecoPago,
                $clinicaID,
                userID
        FROM estoque where clinicaId is null;");

        if($response){
            return "ok";
        }else{
            return "nok";
        }
    }

    public function inserirReembolsoDesconto(Request $request,$clinicaID){
        $querie = "INSERT INTO reembolsos_descontos
        (profissionalID, data, nome, motivo, valor, tipo, comissao, clinicaID) 
       VALUES ('$request->profissionalID', '$request->data', '$request->nome', '$request->motivo',
       '$request->valor', '$request->tipo', '$request->comissao', '$clinicaID');";


       $response = DB::insert($querie);
       
       if($response){
           return "ok";
       }else{
           return "nok";
       }

   }

   public function visaoDentista(Request $request,$acertoId){
    $response = DB::update("update $request->tabela 
        set visaoDentista = '$request->acao'
        where id = $acertoId;
        ");
        return $response;
   }

    public function inserirAcerto(Request $request,$clinicaID){
        $querie = "INSERT INTO acertos
        (procedimentoID, valorProcedimento, comissao, pacienteID,numeroGuia,profissionalID,clinicaId,data,tipo,status,forma,financeiroID)
         VALUES( '$request->procedimentoID',  '$request->valor', '$request->comissao', '$request->pacienteID','$request->guia',
        '$request->profissionalID',
        '$clinicaID',
        '$request->data','$request->tipo','$request->status','$request->forma','$request->idTabela');";

        $response = DB::insert($querie);
        
        if($response){
            return "ok";
        }else{
            return "nok";
        }


    }

    public function buscarDetalhesAcertosParticulares(Request $request, $entrada_saidaID){
        $sql = "select *, MONTH(data) as mes, YEAR(data) as ano, pr.nome as nomeProcedimento
        from acertos 
        join procedimento pr on acertos.procedimentoID = pr.id 
        where financeiroID = $entrada_saidaID";
        

        $resultados = DB::select($sql);

        return $resultados;
    }

    public function buscarProcedimentosParticularesParaApoio(Request $request, $clinicaID, $ano, $mes, $dentistaID){
        $string = '';

        if($dentistaID != 'null'){
            $string = ' and ag.profissionalID =' . $dentistaID;
        }

        $sql = " select 
        t2.dataRecebimento
        ,t2.nomePaciente
        ,t2.pacienteID
        ,t2.dentistaComissao
        ,t2.procedimentoID
        ,t2.apelidoDentistaAgendador
        ,t2.idPlanejamento
        ,FORMAT(SUM(t2.valor), 2, 'pt_BR') as valorRecebido
        ,t2.observacoes
        ,t2.dentistaExecutorID
        ,t2.planejamentoPagamentoID
        ,t2.id
        ,t2.statusAcerto
        ,t2.guia
        ,t2.odontogramaProcedimentoID
        ,t2.dente
        from 
            (select DISTINCT
                DATE_FORMAT(pp.pagamento,'%d/%m/%y') as dataRecebimento
                , pa.nome as nomePaciente
                , pa.id as pacienteID
                , pr.comissao as dentistaComissao
                , pr.id as dentistaExecutorID
                , pr.apelido as apelidoDentistaAgendador
                , proc.id as procedimentoID
                , pf.id as idPlanejamento
                ,(pp.valor) as valor
                , pf.observacao_apoio as observacoes
                , pp.id as planejamentoPagamentoID
                , op.id
                , ac.status as statusAcerto
                , op.guia
                , op.id as odontogramaProcedimentoID
                , o.dente
                
            from planejamentoPagamento pp
            join planejamentoFinanceiro as pf on pf.id = pp.planejamento_id 
            join agendamento as ag on ag.id = pf.agendamento_id 
            join paciente as pa on pa.id = ag.pacienteID 
            join profissional as pr on pr.id = ag.profissionalID 
            join odontograma as o on o.agendamentoID = ag.id
            join odontogramaProcedimento as op on op.odontogramaID = o.id
            join procedimento proc on proc.id = op.procedimentoID
            LEFT join acertos ac on ac.financeiroID = op.id

            where 
                pp.status = 'recebido'
                and op.realizado = 1
                AND op.mostrarRealizado = 1
                and pp.pagamento like '$ano-$mes%' 
                and ag.clinicaID = $clinicaID 
                $string
                GROUP BY pp.id
            order by DATE_FORMAT(pp.pagamento,'%d/%m/%y') desc) as t2
        GROUP BY t2.dataRecebimento, t2.idPlanejamento
        order by t2.dataRecebimento desc";

        $resultados = DB::select($sql);
        // dd($sql);

        return $resultados;
    }

    public function buscarProcedimentosConvenioParaApoio(Request $request, $clinicaID, $ano, $mes, $dentistaID){
        $string = '';

        if($dentistaID != 'null'){
            $string = ' and pr.id =' . $dentistaID;
        }
        
        $sql = "select DATE_FORMAT(a.data,'%d/%m/%y') as data, 
        pa.nome as paciente,
        pa.id as pacienteID, 
        pr.apelido as dentista,
        pr.comissao as dentistaComissao,
        pr.id as dentistaID,
        proc.nome as procedimento, 
        proc.id as procedimentoID,
        FORMAT(op.valorConvenio, 2, 'pt_BR') as valor, 
        op.id,
        op.observacao_apoio as observacoes,
        ac.status as statusAcerto,
        op.guia, 
        op.id as odontogramaProcedimentoID,
        o.dente
        from odontogramaProcedimento op
        join odontograma o on o.id = op.odontogramaID 
        join agendamento a on a.id = o.agendamentoID
        LEFT join acertos ac on ac.financeiroID = op.id
        join profissional pr on pr.id = a.profissionalID
        join paciente pa on pa.id = a.pacienteID 
        join procedimento proc on proc.id = op.procedimentoID
        where op.tipo = 'convenio' and a.clinicaID = $clinicaID $string
        AND MONTH(a.data)=$mes
        AND YEAR(a.data)=$ano
        AND op.realizado = 1
        AND op.mostrarRealizado = 1
        ORDER BY DATE_FORMAT(a.data,'%d/%m/%y') DESC, a.horarioInicio DESC";

       // var_dump($sql);
        $resultados = DB::select($sql);

        return $resultados;
    }
    
    public function buscarEntradasSaidasByIdAndData(Request $request, $clinicaID, $ano,$mes){
        
        $sql = "SELECT es.*,pp.forma,pp.planejamento_id,pp.parcela_numero,ac.id as acertoID  FROM entradas_saidas es 
        LEFT JOIN planejamentoPagamento pp on es.chave = pp.id
        LEFT JOIN acertos ac on ac.id = (SELECT id
           FROM acertos
           WHERE financeiroID = es.id
           LIMIT 1)
        where es.clinicaid = $clinicaID and YEAR(es.data) = $ano AND MONTH(es.data)= $mes";

        $resultados = DB::select($sql);
        return $resultados;
    }

    public function buscarAcertosByIdAndData(Request $request, $clinicaID, $ano,$mes){
        $sql = "SELECT a.*,prof.apelido as nomeProf,pr.Nome as nomeProc,pac.Nome as nomePaciente,pac.ConvenioNome as convenio
        FROM acertos a 
        LEFT JOIN procedimento pr on a.procedimentoId = pr.id 
        LEFT JOIN paciente pac on a.pacienteID = pac.id 
        LEFT JOIN profissional prof on a.profissionalID = prof.id 
        where a.clinicaId = $clinicaID and YEAR(a.data) = $ano AND MONTH(a.data) = $mes";

        $resultados = DB::select($sql);
        return $resultados;
    }

    public function buscarReembolsosDescontos(Request $request, $clinicaID, $ano,$mes){
        $sql = "SELECT rd.*,prof.apelido as nomeProf
        FROM reembolsos_descontos rd
        LEFT JOIN profissional prof on rd.profissionalID = prof.id 
        where rd.clinicaId = $clinicaID and YEAR(rd.data) = $ano AND MONTH(rd.data) = $mes";

        $resultados = DB::select($sql);
        return $resultados;
    }

    public function atualizarObservacoesDoApoioParticular(Request $request, $planejamentoFinanceiroID){
        // dd(123);
        
        $sql = "update planejamentoFinanceiro 
        set observacao_apoio = '".$request->request->get('novoValor')."'
        where id = $planejamentoFinanceiroID;
        ";

        $response = DB::update($sql);
        return $response;
    }

    public function atualizarObservacoesDoApoio(Request $request, $odontogramaProcedimentoID){
        
        $sql = "update odontogramaProcedimento 
        set observacao_apoio = '".$request->request->get('novoValor')."'
        where id = $odontogramaProcedimentoID;
        ";

        $response = DB::update($sql);
        return $response;
    }

    public function atualizarGuiaDoApoio(Request $request, $odontogramaProcedimentoID){
        
        $sql = "update odontogramaProcedimento 
        set guia = '".$request->request->get('novoValor')."'
        where id = $odontogramaProcedimentoID;
        ";

        $response = DB::update($sql);
        return $response;
    }

    public function deletarReembolsoDesconto(Request $request,$id){
        $sql = "DELETE FROM reembolsos_descontos WHERE id = '$id'";

        $response = DB::delete($sql);
        return $response;
    }
    public function buscarProcedimentosParticularesPorPlanejamentoFinanceiroID($planejamentoFinanceiroID){
        $resultados = DB::select("select 
            pr.nome as nomeProcedimento,
            pr.id as procedimentoID,

            pro.apelido as dentistaExecutor,
            pro.comissao as dentistaComissao,

            op.dentistaExecutorID,

            ag.pacienteID, 

            op.valor as valorParticular, 
            CONCAT('R$ ', FORMAT(op.valor - op.valor * (pf.desconto/100), 2, 'pt_BR'))  as valorParticularBR, 
            pf.notaFiscal as notaFiscal, 
            pf.recibo as recibo,
            od.dente
            
        from odontogramaProcedimento op
        join odontograma od on od.id = op.odontogramaID
        join agendamento ag on ag.id = od.agendamentoID
        join procedimento pr on pr.id = op.procedimentoID
        join profissional pro on pro.id = op.dentistaExecutorID
        join planejamentoFinanceiro pf on pf.agendamento_id = ag.id
        where op.tipo = 'particular' and pf.id = $planejamentoFinanceiroID;");
        
        return $resultados;
    }

    public function inserirLogDeAuditoria($ip, $username, $acao, $detalhe){

        $querie = "INSERT INTO auditoria
        (username, ip, acao, detalhe, created_at)
        VALUES( '$username','$ip',  '$acao', '$detalhe', now());";

        $response = DB::insert($querie);

        if($response){
            return "ok";
        }else{
            return "nok";
        }
    }
}