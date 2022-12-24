use sdrporto_homologacao;
select DATE_FORMAT(a.data,'%d/%m/%Y') as data, pa.nome as paciente, pr.apelido as dentista, proc.nome as procedimento, op.valor, op.observacao_apoio as observacoes, op.guia, op.id as odontogramaProcedimentoID
from odontogramaProcedimento op
join odontograma o on o.id = op.odontogramaID 
join agendamento a on a.id = o.agendamentoID
join profissional pr on pr.id = op.dentistaID 
join paciente pa on pa.id = a.pacienteID 
join procedimento proc on proc.id = op.procedimentoID
where op.tipo = 'convenio' and a.clinicaID = 33
AND MONTH(a.data)=9
AND YEAR(a.data)=2021
AND op.realizado = 1
ORDER BY a.data