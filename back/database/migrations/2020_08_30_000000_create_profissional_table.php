<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfissionalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profissional', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('nome'); 
            $table->string('tipo')->comment('admin, dentista ou secretaria'); 
            $table->string('apelido');
            $table->string('sexo')->comment('masculino ou feminino');
            $table->string('cpf'); 
            $table->string('rg');
            $table->string('estadoCivil');
            $table->date('nascimento');
            $table->string('formacao');
            $table->string('telefone'); 
            $table->string('endereco');
            $table->string('email');
            $table->string('CRO');
            $table->string('dadosBancarios');
            $table->string('situacao')->comment('ativo, inativo, desligado');
            $table->string('permissoes'); 
            // $table->string('perfil')->comment('ativo, inativo, desligado');
            $table->string('localDeTrabalho');
            $table->string('comissao');
            // ja definido na tabela de user
            // $table->string('usuario'); 
            // $table->string('senha');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('profissional');
    }
}
