<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Alter5OdontogramaProcedimento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('odontogramaProcedimento', function (Blueprint $table) {
            // $table->double('valor', 8, 2)->nullable(false)->default(0)->change();
            // $table->double('valor', 8, 2)->change();
            $table->decimal('valor',8, 2)->unsigned()->default(0)->change();
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
            $table->decimal('valor',8, 2)->unsigned()->default(0)->change();
        });
    }
}
