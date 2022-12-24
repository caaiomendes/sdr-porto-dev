<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;

class FinanceiroController extends Controller{

    public function __construct(){
        
    }

    public function buscarRecebimentosPorPeriodoEClinica(Request $request, $ano, $mes, $clinicaID){

        $sql = "select 
            'particular' as 'tipo',
            pr.apelido as centro_receita, 
            pa.nome as origem, 
            pp.pagamento as data, 
            FORMAT(pp.valor, 2, 'pt_BR') as valor

            from planejamentoPagamento pp
            
            join planejamentoFinanceiro pf on pf.id = pp.planejamento_id 
            join agendamento ag on ag.id = pf.agendamento_id 
            join profissional as pr on pr.id = ag.profissionalID
            join paciente as pa on pa.id = ag.pacienteID 
        
            where pp.pagamento like '$ano-$mes%' and ag.clinicaID = $clinicaID

            order by DATE_FORMAT(pp.pagamento,'%d/%m/%y') desc;";

        $resultados = DB::select($sql);

        return $resultados;
    }

    public function buscarParcelasPorPlanejamentoID($planejamentoID){

        $sql = "select DISTINCT pp.*, es.chave from planejamentoPagamento pp 
        left join entradas_saidas as es on es.chave = pp.id
        where pp.planejamento_id = $planejamentoID";

        $resultados = DB::select($sql);

        return $resultados;
    }
    
}