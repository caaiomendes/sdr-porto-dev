<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EntradasSaidas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entradas_saidas', function (Blueprint $table) {
            $table->engine = "InnoDB";
            
            $table->increments('id');
            $table->date('data');
            $table->string('origem', 255);
            $table->string('centro_receita', 255);
            $table->string('centro_custo', 255);
            $table->decimal('valor', 8, 2)->unsigned()->default(0);

            //relacionamentos
            $table->integer('clinicaID')->nullable(false)->unsigned();
            $table->foreign('clinicaID')->references('id')->on('clinica');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::dropIfExists('entradas_saidas');
    }
}
