

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSolicitacaoExameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solicitacaoExame', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_agendamento');
            $table->integer('id_paciente');
            $table->string('titulo', 255);
            $table->integer('dentistaID');
            $table->string('cid', 255);
            $table->string('recomendacoes', 255);
            $table->tinyInteger('modelo');
            $table->string('nomeModelo', 255);
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
        Schema::dropIfExists('solicitacaoExame');
    }
}

