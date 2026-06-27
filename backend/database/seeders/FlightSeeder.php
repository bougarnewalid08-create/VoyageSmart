<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Flight;
use Carbon\Carbon;

class FlightSeeder extends Seeder
{
    public function run(): void
    {
        $airlines = [
            ['name' => 'Royal Air Maroc', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/AT.png'],
            ['name' => 'Emirates', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/EK.png'],
            ['name' => 'Air France', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/AF.png'],
            ['name' => 'Lufthansa', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/LH.png'],
            ['name' => 'Qatar Airways', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/QR.png'],
            ['name' => 'Ryanair', 'logo' => 'https://www.gstatic.com/flights/airline_logos/70px/FR.png'],
        ];

        $airports = [
            ['code' => 'CMN', 'city' => 'Casablanca'],
            ['code' => 'RAK', 'city' => 'Marrakech'],
            ['code' => 'JFK', 'city' => 'New York'],
            ['code' => 'DXB', 'city' => 'Dubai'],
            ['code' => 'CDG', 'city' => 'Paris'],
            ['code' => 'FRA', 'city' => 'Frankfurt'],
            ['code' => 'LHR', 'city' => 'London'],
            ['code' => 'MAD', 'city' => 'Madrid'],
        ];

        $classes = ['Economy', 'Business', 'First'];

        for ($i = 0; $i < 40; $i++) {
            $airline = $airlines[array_rand($airlines)];
            
            $depAirport = $airports[array_rand($airports)];
            do {
                $arrAirport = $airports[array_rand($airports)];
            } while ($depAirport['code'] === $arrAirport['code']);

            $daysFromNow = rand(1, 30);
            $hours = rand(0, 23);
            $minutes = rand(0, 59);
            
            $departureTime = Carbon::now()->addDays($daysFromNow)->setHour($hours)->setMinute($minutes)->setSecond(0);
            
            // Random duration between 2 hours and 14 hours
            $durationMinutes = rand(120, 840);
            $arrivalTime = (clone $departureTime)->addMinutes($durationMinutes);

            $cabinClass = $classes[array_rand($classes)];
            
            // Base price based on duration (represents Economy Class price)
            $basePrice = $durationMinutes * 1.5;
            $price = round($basePrice + rand(-50, 150), 2);

            // Generate deterministic set of occupied seats based on the 70 seats in the airplane layout:
            $allSeats = [];
            // First Class (Rows 1-3, Seats A, B)
            for ($r = 1; $r <= 3; $r++) {
                foreach (['A', 'B'] as $s) {
                    $allSeats[] = "{$r}{$s}";
                }
            }
            // Business Class (Rows 4-7, Seats A, B, C, D)
            for ($r = 4; $r <= 7; $r++) {
                foreach (['A', 'B', 'C', 'D'] as $s) {
                    $allSeats[] = "{$r}{$s}";
                }
            }
            // Economy Class (Rows 8-15, Seats A, B, C, D, E, F)
            for ($r = 8; $r <= 15; $r++) {
                foreach (['A', 'B', 'C', 'D', 'E', 'F'] as $s) {
                    $allSeats[] = "{$r}{$s}";
                }
            }

            // Shuffle and pick a random number of occupied seats (e.g. 15 to 45 seats occupied)
            shuffle($allSeats);
            $numOccupied = rand(15, 45);
            $occupiedSeats = array_slice($allSeats, 0, $numOccupied);
            // Sort occupied seats for cleaner representation
            usort($occupiedSeats, function($a, $b) {
                $rowA = (int)$a;
                $rowB = (int)$b;
                if ($rowA !== $rowB) {
                    return $rowA - $rowB;
                }
                return strcmp(substr($a, -1), substr($b, -1));
            });

            $totalSeats = 70;
            $availableSeats = $totalSeats - $numOccupied;

            Flight::create([
                'airline' => $airline['name'],
                'airline_logo' => $airline['logo'],
                'flight_number' => strtoupper(substr($airline['name'], 0, 2)) . rand(1000, 9999),
                'departure_airport' => $depAirport['code'],
                'arrival_airport' => $arrAirport['code'],
                'departure_city' => $depAirport['city'],
                'arrival_city' => $arrAirport['city'],
                'departure_time' => $departureTime,
                'arrival_time' => $arrivalTime,
                'duration' => $durationMinutes,
                'price' => $price,
                'cabin_class' => $cabinClass,
                'total_seats' => $totalSeats,
                'available_seats' => $availableSeats,
                'occupied_seats' => $occupiedSeats,
                'is_active' => true,
            ]);
        }
    }
}
