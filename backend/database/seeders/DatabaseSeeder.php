<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Test User (Admin)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
                'role' => 'Admin',
            ]
        );

        $this->call([
            HotelSeeder::class,
        ]);

        // Walid Bougarne (User)
        User::firstOrCreate(
            ['email' => 'bougarnewalid08@gmail.com'],
            [
                'name' => 'Walid Bougarne',
                'password' => Hash::make('password'),
                'role' => 'User',
            ]
        );

        // Esca (User)
        User::firstOrCreate(
            ['email' => 'esca@example.com'],
            [
                'name' => 'Esca',
                'password' => Hash::make('password'),
                'role' => 'User',
            ]
        );

        // Run the StaySeeder to add properties and the admin@voyagesmart.com account
        $this->call(StaySeeder::class);

        // Run FlightSeeder
        $this->call(FlightSeeder::class);

        // Run PlanSeeder
        $this->call(PlanSeeder::class);
    }
}
