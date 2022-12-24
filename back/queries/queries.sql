-- Querie que busca os procecimentos do paciente, baseado na data
select * from odontogramaProcedimento op 
where odontogramaID in (
	select id from odontograma o 
	where agendamentoID = (
		select id from agendamento a 
		where data = '2021-08-10' and pacienteID = (
			select id from paciente p 
			where nome like '%Ramon Matheus Rodrigues Brizuela%'
		)
	)
)

-- Buscar ultimos odontogramaProcedimento
 select prof.nome,  a.`data` ,pr.nome, op.created_at, op.id, op.realizado, op.mostrarRealizado 
-- select DISTINCT (prof.nome)
from odontogramaProcedimento op
join odontograma o on o.id = op.odontogramaID 
join procedimento pr on pr.id = op.procedimentoID
join agendamento a on a.id = o.agendamentoID 
join profissional prof on prof.id = a.profissionalID 
-- where op.odontogramaID in (19856, 19857, 19858)
where op.mostrarRealizado = 0
order by op.id desc

-- Buscar um totalizador dos agendamentos separados pela situação
SELECT situacao, count(situacao)
from agendamento
group by situacao
ORDER by count(situacao)

-- Quantidade de dentistas com atendimentos em andamento
select profissionalID, pr.nome, a.situacao, count(a.situacao) from agendamento a 
inner join profissional as pr on pr.id = a.profissionalID 
where a.situacao = 'em atendimento'
group by profissionalID, situacao
order by count(a.situacao ) DESC 

-- Agendamentos sem odontogramas
select a.id as agendamentoID, pr.apelido as dentista, pac.nome as paciente, a.`data` as data, a.situacao, cli.nome as clinicaNome from agendamento a
left join profissional as pr on pr.id = a.profissionalID 
left join paciente as pac on pac.id = a.pacienteID 
left join clinica as cli on cli.id = a.clinicaID 
left join odontograma as odo on odo.agendamentoID = a.id 
where (comentario = '' or comentario is null)
and odo.agendamentoID is null
