

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlanejamentoPagamentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('planejamentoPagamento', function (Blueprint $table) {
            $table->engine = "InnoDB";
            $table->increments('id');
            
            $table->integer('planejamento_id')->unsigned();
            $table->foreign('planejamento_id')->references('id')->on('planejamentoFinanceiro');

            $table->string('forma')->nullable(false)->comment('credit, debit, pix, ...');
            $table->integer('parcela_numero')->nullable(false)->comment('1, 2, 3, ...');
            $table->string('status')->nullable(false)->comment('pago, vencido, aberto, ...');
            $table->date('vencimento')->nullable(false);
            $table->date('pagamento')->nullable(true);
            $table->double('valor')->nullable(true);
            $table->datetime('deleted_at')->nullable(true);

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
        Schema::dropIfExists('planejamentoPagamento');
    }
}

