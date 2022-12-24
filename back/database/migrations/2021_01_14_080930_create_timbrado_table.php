

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimbradoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timbrado', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_agendamento');
            $table->integer('id_paciente');
            $table->integer('dentistaID');
            $table->string('titulo', 255);
            $table->string('texto', 10000);
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
        Schema::dropIfExists('timbrado');
    }
}

