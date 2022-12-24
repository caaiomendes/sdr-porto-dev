<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAtendimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('atendimento', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('agendamentoID')->unsigned();
            $table->foreign('agendamentoID')->references('id')->on('agendamento');

            $table->string('inicio')->nullable(true);
            $table->string('fim')->nullable(true);
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
        Schema::drop('atendimento');
    }
}
