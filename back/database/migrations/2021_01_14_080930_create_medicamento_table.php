

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMedicamentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicamento', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_prescricao');
            $table->string('tipo_uso', 255);
            $table->string('nomeMedicamento', 255);
            $table->string('apresentacao', 255);
            $table->string('posologia', 255);
            $table->string('duracao', 255);
            $table->string('descricao', 255);
            $table->string('grupo_uso', 255);
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
        Schema::dropIfExists('medicamento');
    }
}

