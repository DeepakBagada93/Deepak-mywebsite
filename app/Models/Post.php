<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * The production `posts` table uses the slug as a string primary key and is
     * managed externally by the blog-creator skill (publish_blog.py), so Eloquent
     * must not assume auto-incrementing integer ids or timestamps.
     */
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'title',
        'slug',
        'excerpt',
        'content',
        'author',
        'date',
        'category',
        'read_time',
        'image',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'tags' => 'array',
        ];
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('date')->latest('date');
    }
}
