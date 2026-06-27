<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->index('city');
            $table->index('price');
            $table->index('stars');
            $table->index('is_premier');
            $table->index('is_active');
            $table->index('created_at'); // Useful for sorting by newest
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropIndex(['city']);
            $table->dropIndex(['price']);
            $table->dropIndex(['stars']);
            $table->dropIndex(['is_premier']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['created_at']);
        });
    }
};
