<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StayRule extends Model
{
    protected $fillable = ['stay_id', 'rule'];

    public function stay()
    {
        return $this->belongsTo(Stay::class);
    }
}
