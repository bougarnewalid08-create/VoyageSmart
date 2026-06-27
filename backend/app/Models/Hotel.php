<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'name', 'location', 'city', 'country', 'description', 
        'price', 'rating', 'reviews_count', 'image', 'user_id', 
        'is_active', 'is_premier', 'stars', 'total_rooms', 'available_rooms'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images()
    {
        return $this->hasMany(HotelImage::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'hotel_amenity');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
