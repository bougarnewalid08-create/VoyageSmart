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
        Schema::create('stays', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Location
            $table->string('location'); // Santorini, Oia...
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Property details
            $table->string('property_type'); // villa, apartment...
            $table->integer('guests')->default(1);
            $table->integer('bedrooms')->default(1);
            $table->integer('beds')->nullable();
            $table->integer('bathrooms')->default(1);
            $table->integer('area')->nullable(); // m²

            // Pricing
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('cleaning_fee', 10, 2)->nullable();
            $table->string('currency')->default('USD');

            // Status / flags
            $table->boolean('is_superhost')->default(false);
            $table->boolean('is_highly_rated')->default(false);
            $table->boolean('is_active')->default(true);

            // Data storage (needed for UI)
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);

            // Host
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stays');
    }
};
