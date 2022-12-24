<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter1AgendamentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('agendamento', function (Blueprint $table) {
            $table->dropColumn('procedimento');            
            $table->integer('procedimentoID')->nullable(false)->unsigned();
            $table->foreign('procedimentoID')->references('id')->on('procedimento');
            
            $table->dropColumn('convenioTipo'); 
            $table->string('convenioNome')->nullable(true);    
            
            $table->string('situacao')->nullable(true);
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('agendamento', function($table) {
            $table->dropColumn('procedimentoID');
            $table->string('procedimento')->nullable(true); 

            $table->dropColumn('convenioNome'); 
            $table->string('convenioTipo')->nullable(true); 

            $table->dropColumn('situacao'); 
        });
    }
}
