<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1OdontogramaProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            $table->string('tipo')->nullable(true);
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
            $table->dropColumn('tipo');
        });
    }
}
