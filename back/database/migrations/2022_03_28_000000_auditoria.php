<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Auditoria extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('auditoria', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username', 255);
            $table->string('ip', 255);
            $table->string('acao', 255);
            $table->string('detalhe', 255);
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
        Schema::dropIfExists('auditoria');
    }
}
