<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOdontogramaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('odontograma', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('atendimentoID')->unsigned();
            $table->foreign('atendimentoID')->references('id')->on('atendimento');

            $table->string('dente')->nullable(true);
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
        Schema::drop('odontograma');
    }
}
