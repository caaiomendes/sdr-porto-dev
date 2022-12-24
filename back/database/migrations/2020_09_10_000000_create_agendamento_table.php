<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAgendamentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agendamento', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('profissionalID')->unsigned();
            $table->integer('pacienteID')->unsigned();

            $table->foreign('profissionalID')->references('id')->on('profissional');
            $table->foreign('pacienteID')->references('id')->on('paciente');

            $table->date('data');
            $table->string('horarioInicio')->comment('11:22');
            $table->string('horarioFim')->comment('11:22')->nullable(true);
            $table->string('convenio')->nullable(true);
            $table->string('convenioTipo')->comment('particular ou convênio')->nullable(true); 
            $table->string('descricao')->nullable(true);
            $table->string('procedimento')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('agendamento');
    }
}
