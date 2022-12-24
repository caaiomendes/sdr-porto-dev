<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOdontogramaProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('odontogramaProcedimento', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('odontogramaID')->unsigned();
            $table->foreign('odontogramaID')->references('id')->on('odontograma');

            $table->integer('procedimentoID')->unsigned();
            $table->foreign('procedimentoID')->references('id')->on('procedimento');

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
        Schema::drop('odontogramaProcedimento');
    }
}
