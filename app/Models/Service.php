<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'slug',
        'kicker',
        'title',
        'tagline',
        'meta_description',
        'intro',
        'offerings',
        'faq',
        'service_type',
        'area_served',
    ];

    protected function casts(): array
    {
        return [
            'offerings'  => 'array',
            'faq'        => 'array',
            'area_served'=> 'array',
        ];
    }
}
