<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePacienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paciente', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('nome'); 
            $table->string('sexo')->comment('masculino ou feminino');
            $table->string('cpf'); 
            $table->string('rg');
            $table->string('estadoCivil');
            $table->date('nascimento');
            $table->string('convenioNome');
            $table->string('convenioNumero');
            $table->string('telefone'); 
            $table->string('endereco');
            $table->string('email');
            $table->string('foto');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('paciente');
    }
}
