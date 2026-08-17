<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The `posts` table already exists in production (created and managed by the
     * blog-creator skill's publish_blog.py, which truncates and re-inserts it).
     * Its schema differs from Laravel conventions on purpose: `id` is a string
     * (the slug), body lives in `content`, the publish date in `date`, and the
     * tag in `category`. This migration only creates the table if it is missing
     * (e.g. on a fresh database) so it never touches the live table.
     */
    public function up(): void
    {
        if (Schema::hasTable('posts')) {
            return;
        }

        Schema::create('posts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->index();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('author')->default('Deepak Bagada');
            $table->string('date')->nullable();
            $table->string('category')->nullable();
            $table->string('read_time')->default('4 min read');
            $table->string('image')->default('');
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Never drop the production table.
    }
};
