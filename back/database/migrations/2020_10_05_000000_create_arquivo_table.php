<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArquivoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arquivo', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('pacienteID')->unsigned();
            $table->foreign('pacienteID')->references('id')->on('paciente');

            $table->string('tipo')->nullable(true);
            $table->string('nome')->nullable(false);
            $table->string('url')->nullable(false);
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
        Schema::drop('arquivo');
    }
}
