<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterMonitor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('monitor', function (Blueprint $table) {
            $table->string('email')->nullable(false);
            $table->string('descricao')->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('monitor', function($table) {
            $table->dropColumn('email');
            $table->dropColumn('descricao');
        });
    }
}
