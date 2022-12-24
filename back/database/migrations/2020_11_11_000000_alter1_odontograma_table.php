<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1OdontogramaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontograma', function (Blueprint $table) {
            $table->renameColumn('atendimentoID', 'agendamentoID');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('odontograma', function($table) {
            $table->renameColumn('agendamentoID', 'atendimentoID');
        });
    }
}
