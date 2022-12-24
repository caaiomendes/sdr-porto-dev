<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter4OdontogramaProcedimento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            $table->double('valor', 8, 2)->nullable(false)->default(0);
            $table->string('ativo')->nullable(false)->default('sim');

            $table->integer('dentistaExecutorID')->nullable(true);
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
            $table->dropColumn('valor');
            $table->dropColumn('ativo');
            $table->dropColumn('dentistaExecutorID');
        });
    }
}
