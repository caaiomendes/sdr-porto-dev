

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlanejamentoFinanceiroTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('planejamentoFinanceiro', function (Blueprint $table) {
            $table->engine = "InnoDB";
            $table->increments('id');
            
            $table->integer('agendamento_id')->unsigned();
            $table->foreign('agendamento_id')->references('id')->on('agendamento');

            $table->integer('dentista_id')->unsigned();
            $table->foreign('dentista_id')->references('id')->on('profissional');

            $table->string('status')->nullable(false)->comment('approved or not approved');
            $table->string('desconto')->nullable(false);
            $table->string('notaFiscal')->nullable(false)->comment('se o cliente quer nota fiscal');
            $table->string('recibo')->nullable(false)->comment('se o cliente quer recibo');

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
        Schema::dropIfExists('planejamentoFinanceiro');
    }
}

