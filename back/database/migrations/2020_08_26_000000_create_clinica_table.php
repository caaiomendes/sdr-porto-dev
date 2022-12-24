<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClinicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinica', function (Blueprint $table) {
            $table->engine = "InnoDB";
            
            $table->increments('id');
            $table->rememberToken();
            $table->timestamps();
            
            $table->string('nome');
            $table->string('logo');
            $table->string('email');
            $table->string('telefone');
            $table->string('endereco');
            $table->string('horarioInicio');
            $table->string('horarioFim');
            $table->string('cnpj');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('clinica');
    }
}
