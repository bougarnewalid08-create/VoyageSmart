<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Stay extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'location',
        'city',
        'country',
        'latitude',
        'longitude',
        'property_type',
        'guests',
        'bedrooms',
        'beds',
        'bathrooms',
        'area',
        'price_per_night',
        'cleaning_fee',
        'currency',
        'is_superhost',
        'is_highly_rated',
        'is_active',
        'rating',
        'reviews_count',
        'user_id',
    ];

    protected $casts = [
        'is_superhost' => 'boolean',
        'is_highly_rated' => 'boolean',
        'is_active' => 'boolean',
        'price_per_night' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'rating' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($stay) {
            if (empty($stay->slug)) {
                $stay->slug = Str::slug($stay->name) . '-' . uniqid();
            }
        });
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images()
    {
        return $this->hasMany(StayImage::class)->orderBy('order');
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function rules()
    {
        return $this->hasMany(StayRule::class);
    }
}
