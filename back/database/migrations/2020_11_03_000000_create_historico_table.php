<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHistoricoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('historico', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('atendimentoID')->unsigned();
            $table->foreign('atendimentoID')->references('id')->on('atendimento');
            
            $table->integer('agendamentoID')->unsigned();
            $table->foreign('agendamentoID')->references('id')->on('agendamento');

            $table->string('acao')->nullable(false);
            $table->string('descricao')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('historico');
    }
}
