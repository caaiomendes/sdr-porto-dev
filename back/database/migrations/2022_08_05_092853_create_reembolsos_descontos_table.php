

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReembolsosdescontosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reembolsos_descontos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('profissionalID')->unsigned();
            $table->date('data');
            $table->string('nome', 45);
            $table->string('motivo', 255);
            $table->decimal('valor', 8, 2)->unsigned();
            $table->string('tipo', 15);
            $table->integer('comissao');
            $table->integer('clinicaID');
            $table->timestamps();
            $table->index(["profissionalID"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reembolsos_descontos');
    }
}

