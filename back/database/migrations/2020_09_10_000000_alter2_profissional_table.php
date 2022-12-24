<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter2ProfissionalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profissional', function (Blueprint $table) {
            $table->dropColumn('dadosBancarios');
            $table->string('dadosBancariosBanco')->nullable(true);
            $table->string('dadosBancariosAgencia')->nullable(true);
            $table->string('dadosBancariosConta')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profissional', function($table) {
            $table->dropColumn('dadosBancariosBanco');
            $table->dropColumn('dadosBancariosAgencia');
            $table->dropColumn('dadosBancariosConta');
        });
    }
}
