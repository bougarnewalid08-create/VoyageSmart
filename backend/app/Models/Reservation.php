<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id', 'hotel_id', 'stay_id', 'flight_id', 'seat_number', 'check_in', 'check_out',
        'adults', 'children', 'nightly_price', 'service_fee',
        'total_amount', 'nights', 'status', 'room_number', 'plan_id', 'parent_id'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function parent()
    {
        return $this->belongsTo(Reservation::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Reservation::class, 'parent_id');
    }
}
