

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEstoqueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estoque', function (Blueprint $table) {
            $table->engine = "InnoDB";

            $table->increments('id');
            $table->timestamps();

            $table->string('produto', 255)->nullable(false);
            $table->string('marca', 255)->nullable(true);
            $table->string('medida', 255)->nullable(false);
            $table->integer('quantidadeEstoque')->default(0)->nullable(true);
            $table->integer('quantidadeSala')->default(0)->nullable(true);
            $table->integer('limite')->default(0)->nullable(true);
            $table->date('dataUltimaCompra')->nullable(true);
            $table->date('dataVencimento')->nullable(true);
            $table->decimal('ultimoPrecoPago', 8, 2)->unsigned()->default(0)->nullable(true);

            //relacionamentos
            $table->integer('clinicaID')->nullable(true)->unsigned();
            $table->foreign('clinicaID')->references('id')->on('clinica');

            $table->integer('userID')->nullable(false)->unsigned();
            $table->foreign('userID')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estoque');
    }
}

