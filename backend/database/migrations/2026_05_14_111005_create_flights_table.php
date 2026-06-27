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
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('airline');
            $table->string('airline_logo')->nullable();
            $table->string('flight_number');
            $table->string('departure_airport');
            $table->string('arrival_airport');
            $table->string('departure_city');
            $table->string('arrival_city');
            $table->dateTime('departure_time');
            $table->dateTime('arrival_time');
            $table->integer('duration'); // in minutes
            $table->decimal('price', 10, 2);
            $table->string('cabin_class')->default('Economy'); // Economy, Business, First
            $table->integer('total_seats')->default(150);
            $table->integer('available_seats')->default(150);
            $table->json('occupied_seats')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
