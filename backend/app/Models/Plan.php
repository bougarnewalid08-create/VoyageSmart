<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'duration',
        'stops',
        'price',
        'image',
        'theme',
        'budget_level',
        'activities',
        'is_active',
        'hotel_id',
        'stay_id',
        'flight_id',
        'max_travelers',
    ];

    protected $casts = [
        'stops' => 'array',
        'activities' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'food_expense',
        'gas_expense',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function stay()
    {
        return $this->belongsTo(Stay::class);
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function getFoodExpenseAttribute()
    {
        preg_match('/\d+/', $this->duration, $matches);
        $days = isset($matches[0]) ? (int)$matches[0] : 1;
        
        $rate = 35; // default
        if ($this->budget_level === 'Essential') {
            $rate = 20;
        } elseif ($this->budget_level === 'Premium') {
            $rate = 50;
        } elseif ($this->budget_level === 'Luxe') {
            $rate = 120;
        }
        
        return $days * $rate;
    }

    public function getGasExpenseAttribute()
    {
        $stopsCount = is_array($this->stops) ? count($this->stops) : 0;
        if ($stopsCount <= 1) {
            return 0;
        }
        // $50 per city-to-city trip
        return ($stopsCount - 1) * 50;
    }
}
