<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1ProcedimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('procedimento', function (Blueprint $table) {
            $table->string('descricao')->comment('descricao do procedimento');
            $table->string('categoria')->comment('categoria do procedimento');
            $table->string('status')->comment('status do procedimento');
            $table->string('codigo')->comment('codigo do procedimento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('procedimento', function($table) {
            $table->dropColumn('descricao');
            $table->dropColumn('categoria');
            $table->dropColumn('status');
            $table->dropColumn('codigo');
        });
    }
}
