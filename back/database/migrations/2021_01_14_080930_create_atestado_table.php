

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAtestadoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('atestado', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_agendamento');
            $table->integer('id_paciente');
            $table->string('titulo', 255);
            $table->integer('dentistaId');
            $table->string('cid', 255);
            $table->string('hora_inicio', 255);
            $table->string('hora_fim', 255);
            $table->integer('dias_repouso');
            $table->string('data_atendimento', 255);
            $table->string('data_emissao', 255);
            $table->string('atividade', 255);
            $table->string('texto', 10000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('atestado');
    }
}

