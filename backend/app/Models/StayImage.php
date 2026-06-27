<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StayImage extends Model
{
    protected $fillable = [
        'stay_id',
        'image',
        'is_main',
        'order',
    ];

    protected $casts = [
        'is_main' => 'boolean',
    ];

    public function stay()
    {
        return $this->belongsTo(Stay::class);
    }
}
