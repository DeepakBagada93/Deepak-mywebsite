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
        // Future-dated rows are scheduled, not published: hide them until
        // their slot arrives. Tie-break on id so same-day/same-time batches
        // paginate deterministically.
        return $query->whereNotNull('date')->where('date', '<=', now())->orderBy('date', 'desc')->orderBy('id', 'asc');
    }

    /**
     * Exclude near-duplicate variant slugs (*-variant-N, *-vN) at the query
     * level so pagination counts stay correct. (Filtering after paginate()
     * leaves pages short and shifts items across pages.)
     *
     * MySQL supports REGEXP; SQLite (tests) does not, so there we exclude
     * the common `-variant-N` family via LIKE and callers keep a small
     * PHP-side reject for the residual `-vN` suffixes as a safety net.
     */
    public function scopeCanonical($query)
    {
        $driver = $query->getConnection()->getDriverName();

        if ($driver === 'mysql' || $driver === 'mysqli') {
            return $query->whereRaw("slug NOT REGEXP '-(variant-[0-9]+|v[0-9]+)$'");
        }

        return $query->where('slug', 'NOT LIKE', '%-variant-%');
    }

    /**
     * PHP-side variant check — mirrors scopeCanonical for drivers without
     * REGEXP and acts as a safety net everywhere else.
     */
    public static function isVariantSlug(?string $slug): bool
    {
        return (bool) preg_match('/-(variant-\d+|v\d+)$/', (string) $slug);
    }
}
