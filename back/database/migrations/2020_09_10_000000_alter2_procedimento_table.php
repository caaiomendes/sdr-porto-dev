<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter2ProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('procedimento', function (Blueprint $table) {
            

            $table->string('descricao')->nullable(true)->change();
            $table->string('categoria')->nullable(true)->change();
            $table->string('status')->nullable(true)->change();
            $table->string('codigo')->nullable(true)->change();
            $table->string('valor1')->nullable(true)->change();
            $table->string('valor2')->nullable(true)->change();
            $table->string('valor3')->nullable(true)->change();
            $table->string('valor4')->nullable(true)->change();
            $table->string('valor5')->nullable(true)->change();
            $table->string('created_at')->nullable(true)->change();
            $table->string('updated_at')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('procedimento', function($table) {
            $table->string('descricao')->nullable(false)->change();
            $table->string('categoria')->nullable(false)->change();
            $table->string('status')->nullable(false)->change();
            $table->string('codigo')->nullable(false)->change();
            $table->string('valor1')->nullable(false)->change();
            $table->string('valor2')->nullable(false)->change();
            $table->string('valor3')->nullable(false)->change();
            $table->string('valor4')->nullable(false)->change();
            $table->string('valor5')->nullable(false)->change();
            $table->string('created_at')->nullable(false)->change();
            $table->string('updated_at')->nullable(false)->change();
        });
    }
}
