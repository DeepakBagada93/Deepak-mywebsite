<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Perfect-time publishing needs full slot datetimes (Y-m-d H:i:s IST).
     * The production `posts.date` column is DATE (silently truncates times
     * to midnight), so scheduled slots like 06:30 vs 18:30 collapse.
     * Convert to DATETIME so slot times persist.
     */
    public function up(): void
    {
        if (! Schema::hasTable('posts')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql' || $driver === 'mysqli') {
            DB::statement('ALTER TABLE `posts` MODIFY `date` DATETIME NULL');

            return;
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dateTime('date')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Never downgrade back to DATE — that would destroy slot times.
    }
};
