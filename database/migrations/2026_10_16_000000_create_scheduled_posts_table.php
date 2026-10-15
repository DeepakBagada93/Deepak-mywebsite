<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Queue table for the autonomous blog scheduler. Production rows are
     * created by save-scheduled-posts.php and flipped to `published` by
     * process-scheduled-posts.php / `blog:process-scheduled`.
     *
     * `scheduled_for` is an IST wall-clock DATETIME (tz-naive, matching the
     * `posts.date` convention); comparisons use the app timezone
     * (Asia/Kolkata) on both sides.
     */
    public function up(): void
    {
        if (Schema::hasTable('scheduled_posts')) {
            return;
        }

        Schema::create('scheduled_posts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->index();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('author')->default('Deepak Bagada');
            $table->string('category')->nullable();
            $table->string('tag')->nullable();
            $table->json('tags')->nullable();
            $table->dateTime('scheduled_for')->index();
            $table->string('slot_label')->nullable();
            $table->string('status')->default('scheduled')->index();
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_posts');
    }
};
