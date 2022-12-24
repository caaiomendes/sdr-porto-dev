<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterOdontogramaProcedimento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            $table->integer('dentistaSendId')->nullable(true);
            $table->integer('clinicaID')->nullable(true);
            $table->integer('pacienteID')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('odontogramaProcedimento', function($table) {
            $table->dropColumn('dentistaSendId');
            $table->dropColumn('clinicaID');
            $table->dropColumn('pacienteID');
        });
    }
}
