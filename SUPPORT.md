## lembrar
deu certo usar o cliente URL(não funciona mais... fica em loop... novidade agora em outro dominio funciona!)
nao posso deixar voltar a porcentagem da evolucao
estou esquecendo as coisas que estou fazendo
criei uma rota generica, batendo em uma controller generica
fiz um if na api.php que soh aceita request vindo do ip do integrator

deu certo!!! aleluia!
bloqueio com token, rota segura, nao da pra acessar via browser nem via Curl

preciso agora deixar as rotas genericas

# Diferenças entre ambientes
- FRONTEND = app.js

# Geração de Migração
    Documentação: https://github.com/aljorhythm/sql-to-laravel-migrations/blob/master/retrieve_and_convert.php
    Arquivo: geracaoDeMigrations/retrieve_and_convert.php
    Execução: 
# Apoio
    #Executar metodo angularjs via console
    angular.element($('#clinicas')).scope().preencher();

    #Limpar cache de rotas
    php artisan route:clear

    #Pegar mensagens entre tags
    git log --pretty=oneline tagA...tagB
    git log --pretty=oneline v0.5.0...v0.6.0

    #Truncate tables
    TRUNCATE TABLE waisoc_odontologia.paciente;
    TRUNCATE TABLE waisoc_odontologia.arquivo;
    TRUNCATE TABLE waisoc_odontologia.agendamento;

    #limpar cache local
    composer dump-autoload

    #copiar artefato entre servidores
    scp odontologia-backend.zip sdrporto@sdrporto.com.br:/home/sdrporto/www
    scp Downloads.zip sdrporto@sdrporto.com.br:/home/sdrporto/www/downloads.zip

#contar arquivo:
    ls ~/www/lotes_imagens/lote1 | wc -l // 154
    ls ~/www/lotes_imagens/lote2 | wc -l // 154

#copiar arquivos: 
    cp -v ~/www/lotes_imagens/lote1/*.* ~/web/backend.sdrporto.com.br/odontologia/public/upload/
    cp -v ~/www/lotes_imagens/lote2/*.* ~/web/backend.sdrporto.com.br/odontologia/public/upload/

#diferença entre pastas:
    diff -q ~/www/lotes_imagens/lote1 ~/web/backend.sdrporto.com.br/odontologia/public/upload/
    diff -q ~/www/lotes_imagens/lote-linux-dia5-verificar ~/web/backend.sdrporto.com.br/odontologia/public/upload/
    diff -uq ~/www/lotes_imagens/lote-linux-dia5-verificar ~/web/backend.sdrporto.com.br/odontologia/public/upload/
            
#arquivos identicos:
    diff -rs ~/www/lotes_imagens/lote1 ~/web/backend.sdrporto.com.br/odontologia/public/upload/ | egrep '^Files .+ and .+ are identical$'

#find file
    find /home/username/ -name "*.err"
    find ~/web/backend.sdrporto.com.br/odontologia/public/upload/ -name "*Falciforme*"
    find . -type f ! -iname "*_bak"
    find . -type f ! -iname "rx*"


    find ~ -type f -name '*pdf'
    find www/back/odontologia/public/upload/ -type f -name '*pdf'
    find www/back/odontologia/public/upload/ -type f -name 'RX*'


    ls | wc -l
    ls www/back/odontologia/public/upload/ | wc -l 
    11530 no total

    www/back/odontologia/public/upload/RX 2- ADILSON SOUZA TEIXEIRA.pdf

    RX 1 -ADILSON SOUZA TEIXEIRA.pdf
    RX 1 -ADILSON SOUZA TEIXEIRA.pdf

    mv "/home/sdrporto/www/back/odontologia/public/upload/RX 1 -ADILSON SOUZA TEIXEIRA.pdf"

#download via CURL
    curl -OL <url>

#buscar pacientes com arquivos corrompidos
    select a.pacienteID, p.nome, a.url , t.url FROM sdrporto_sistema.TEMP t 
    left join arquivo a on t.url = a.url
    left join paciente p on a.pacienteID = p.id 
    order by a.url desc;
    curl -OL <url>



sed -i -e 's/\r$//' /path/to/file

sed -i -e 's/\r$//' "Panora??mica Bianca.png"


erro
http://sdrporto.com.br/back/odontologia/public/upload/Panor%C3%A2mica%20Bianca.png
http://sdrporto.com.br/back/odontologia/public/upload/Panora%CC%82mica%20Bianca.png

Panorâmica%20Bianca.png
Panorâmica%20Bianca.png

Errada:
Panorâmica%20Bianca.png
encodeURIComponent(â);
Certa
Panorâmica%20Bianca.png
encodeURIComponent("â");

"Panorâmica%20Bianca.png" == "Panorâmica%20Bianca.png"
"Panorâmica%20Bianca.png" == "Panorâmica%20Bianca.png"


converter de 
"%C3%A2" para "a%CC%82"
    
== GET querie
    // DB::enableQueryLog();
    // code...
    // $queries = DB::getQueryLog();
    // print_r($queries);

# Fazer carga de procedimentos em Clinica nova
    INSERT INTO procedimento (created_at, updated_at, nome, valor1, valor2, valor3, valor4, valor5, descricao, categoria, status, codigo, clinicaId)
    SELECT now(), null, nome, valor1, valor2, valor3, valor4, valor5, descricao, categoria, status, codigo, 59 
        FROM procedimento where clinicaId is null;

# Como usar o GIT para listar os arquivos alterados na branch
    `git diff --name-only master`

# API.php cors
    //header('Access-Control-Allow-Origin: *');

# Login cors
    index.php
    <?php
    // header('Access-Control-Allow-Origin: *');  
    // header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

# CORS LeMBRAR
         /*
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'])
            ->header('Access-Control-Allow-Credentials', 'false')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    }*/

    public function handle($request, Closure $next)
    {
        return $next($request);

    }

# Correção de agendamento em aberto
https://github.com/williansmartins/odontologia/issues/272

# MIlestone atual
https://github.com/williansmartins/odontologia/milestone/4

# remover commit antigo, mas remove todos os acima
git reset --hard fd4dfa66cad5aecf9c7a3ba20973153a28df2152(hash antes do commit errado)
git push origin master --force

# Command line para pegar os tokens do log
````
https://stackoverflow.com/questions/71652649/how-get-only-token-using-sed-grep-or-awk/71652685#71652685
sed -nE 's/.*token=([^[:space:]]+).*/\1/p' file
sed -nE 's/.*token=([^[:space:]]+).*/\1/p' sslaccesslog_dev.sdrporto.com.br_3_28_2022 > saida.txt


# Erro no servidor, retornando text/html ao inves de application/json
o problema era uma linha em branco no inicio do public/index.php