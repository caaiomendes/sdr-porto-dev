

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAcertosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('acertos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('procedimentoID', 255);
            $table->string('forma', 255);
            $table->decimal('valorProcedimento', 8, 2)->unsigned();
            $table->string('comissao', 255);
            $table->integer('pacienteID');
            $table->string('numeroGuia', 255);
            $table->string('glosas', 255);
            $table->integer('profissionalID');
            $table->string('clinicaId', 45);
            $table->date('data');
            $table->string('tipo', 15);
            $table->string('status', 15);
            $table->string('observacoes', 255);
            $table->integer('financeiroID');
            $table->timestamps();
            $table->index(["id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('acertos');
    }
}

