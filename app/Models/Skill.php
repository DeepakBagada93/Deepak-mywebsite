<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Skill extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'summary',
        'content',
        'category_id',
        'difficulty',
        'github_url',
        'version',
        'stars',
        'status',
        'sort_order',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'stars' => 'integer',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SkillCategory::class, 'category_id');
    }

    public function architectures(): HasMany
    {
        return $this->hasMany(SkillArchitecture::class, 'skill_id')->orderBy('sort_order', 'asc');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->orderBy('published_at', 'desc');
    }
}
