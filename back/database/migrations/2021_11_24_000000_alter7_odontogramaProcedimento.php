<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter7OdontogramaProcedimento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            $table->String('guia', 255);
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
            $table->dropColumn('guia');
        });
    }
}
