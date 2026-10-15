<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The live `scheduled_posts` table was created manually before this
     * migration existed, so it lacks the `tags` JSON column that
     * save-scheduled-posts.php writes. Add it when missing (safe no-op
     * on fresh DBs where the create migration already includes it).
     */
    public function up(): void
    {
        if (! Schema::hasTable('scheduled_posts')) {
            return;
        }

        if (! Schema::hasColumn('scheduled_posts', 'tags')) {
            Schema::table('scheduled_posts', function (Blueprint $table) {
                $table->json('tags')->nullable()->after('tag');
            });
        }
    }

    public function down(): void
    {
        // Keep the column — dropping it would break the saver.
    }
};
