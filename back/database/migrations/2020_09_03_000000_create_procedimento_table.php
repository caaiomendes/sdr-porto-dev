<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('procedimento', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('nome'); 
            $table->string('valor1')->comment('baseado na tabela TUSS'); 
            $table->string('valor2')->comment('baseado no plano de saude1');
            $table->string('valor3')->comment('baseado no plano de saude2');
            $table->string('valor4')->comment('baseado no plano de saude3');
            $table->string('valor5')->comment('baseado no plano de saude4');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('procedimento');
    }
}
