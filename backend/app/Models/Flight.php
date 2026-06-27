<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $fillable = [
        'airline',
        'airline_logo',
        'flight_number',
        'departure_airport',
        'arrival_airport',
        'departure_city',
        'arrival_city',
        'departure_time',
        'arrival_time',
        'duration',
        'price',
        'cabin_class',
        'total_seats',
        'available_seats',
        'occupied_seats',
        'is_active',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'is_active' => 'boolean',
        'occupied_seats' => 'array',
    ];

    /**
     * Calculate seat distribution across classes based on total seats.
     * 
     * Rules:
     * - Economy = 75% of total seats
     * - Business = 20% of total seats
     * - First = 5% of total seats
     * 
     * @param int $totalSeats
     * @return array
     */
    public static function calculateSeatDistribution(int $totalSeats): array
    {
        $economy = (int) round($totalSeats * 0.75);
        $business = (int) round($totalSeats * 0.20);
        $first = $totalSeats - ($economy + $business);

        return [
            'economy' => $economy,
            'business' => $business,
            'first' => $first,
        ];
    }
}
