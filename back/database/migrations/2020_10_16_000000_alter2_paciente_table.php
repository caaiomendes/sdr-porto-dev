<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter2PacienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('paciente', function (Blueprint $table) {
            $table->datetime('updated_at')->nullable(true)->change();
            $table->string('nome')->nullable(true)->change();
            $table->string('sexo')->nullable(true)->change();
            $table->string('cpf')->nullable(true)->change();
            $table->string('rg')->nullable(true)->change();
            $table->string('estadoCivil')->nullable(true)->change();
            $table->date('nascimento')->nullable(true)->change();
            $table->string('convenioNome')->nullable(true)->change();
            $table->string('convenioNumero')->nullable(true)->change();
            $table->string('telefone')->nullable(true)->change();
            $table->string('endereco')->nullable(true)->change();
            $table->string('email')->nullable(true)->change();
            $table->string('foto')->nullable(true)->change();
            $table->string('descricao')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('paciente', function($table) {
            $table->datetime('updated_at')->nullable(false)->change();
            $table->string('nome')->nullable(false)->change();
            $table->string('sexo')->nullable(false)->change();
            $table->string('cpf')->nullable(false)->change();
            $table->string('rg')->nullable(false)->change();
            $table->string('estadoCivil')->nullable(false)->change();
            $table->date('nascimento')->nullable(false)->change();
            $table->string('convenioNome')->nullable(false)->change();
            $table->string('convenioNumero')->nullable(false)->change();
            $table->string('telefone')->nullable(false)->change();
            $table->string('endereco')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
            $table->string('foto')->nullable(false)->change();
            $table->string('descricao')->nullable(false)->change();
        });
    }
}
