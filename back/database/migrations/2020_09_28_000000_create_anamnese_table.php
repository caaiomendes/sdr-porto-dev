<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnamneseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anamnese', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('pacienteID')->unsigned();
            $table->foreign('pacienteID')->references('id')->on('paciente');

            $table->string('resposta1')->nullable(true);
            $table->string('resposta2')->nullable(true);
            $table->string('resposta3')->nullable(true);
            $table->string('resposta4')->nullable(true);
            $table->string('resposta5')->nullable(true);
            $table->string('resposta6')->nullable(true);
            $table->string('resposta7')->nullable(true);
            $table->string('resposta8')->nullable(true);
            $table->string('resposta9')->nullable(true);
            $table->string('resposta10')->nullable(true);
            $table->string('resposta11')->nullable(true);
            $table->string('resposta12')->nullable(true);
            $table->string('resposta13')->nullable(true);
            $table->string('resposta14')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('anamnese');
    }
}
