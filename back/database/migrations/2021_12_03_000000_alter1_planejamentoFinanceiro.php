<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1PlanejamentoFinanceiro extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('planejamentoFinanceiro', function (Blueprint $table) {
            $table->String('observacao_apoio', 255);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('planejamentoFinanceiro', function($table) {
            $table->dropColumn('observacao_apoio');
        });
    }
}
