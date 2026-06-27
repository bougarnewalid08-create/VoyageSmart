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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('duration'); 
            $table->json('stops'); 
            $table->decimal('price', 10, 2);
            $table->text('image');
            $table->string('theme'); 
            $table->string('budget_level')->default('Premium'); 
            $table->json('activities')->nullable(); 
            $table->integer('max_travelers')->default(4);
            $table->foreignId('hotel_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('stay_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('flight_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
