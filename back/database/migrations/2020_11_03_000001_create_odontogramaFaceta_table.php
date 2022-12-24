<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOdontogramafacetaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('odontogramaFaceta', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('odontogramaID')->unsigned();
            $table->foreign('odontogramaID')->references('id')->on('odontograma');

            $table->string('faceta')->nullable(true);
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
        Schema::drop('odontogramaFaceta');
    }
}
