<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CuratedRepo extends Model
{
    protected $fillable = [
        'title',
        'url',
        'description',
        'category',
        'tags',
        'why_great',
        'stars',
        'featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tags'       => 'array',
            'stars'      => 'integer',
            'featured'   => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }
}
