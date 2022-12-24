<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1ArquivoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('arquivo', function (Blueprint $table) {

            $table->dropForeign('arquivo_pacienteid_foreign');
            $table->foreign('pacienteID')
            ->references('id')->on('paciente')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('arquivo', function($table) {
            $table->dropForeign('arquivo_pacienteid_foreign');
        });
    }
}
