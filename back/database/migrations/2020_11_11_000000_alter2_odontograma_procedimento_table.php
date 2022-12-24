<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter2OdontogramaProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            $table->boolean('realizado')->nullable(true);


            $table->integer('dentistaID')->unsigned();
            $table->foreign('dentistaID')
            ->references('id')->on('profissional')
            ->onDelete('cascade');
        });

        //este
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('odontogramaProcedimento', function($table) {
            $table->dropColumn('realizado');
            $table->dropForeign('odontograma_procedimento_dentistaid_foreign');
        });
    }
}
