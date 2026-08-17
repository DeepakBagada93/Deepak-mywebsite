<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('kicker');
            $table->string('title');
            $table->string('tagline')->nullable();
            $table->string('meta_description')->nullable();
            $table->text('intro');
            $table->json('offerings');
            $table->json('faq');
            $table->string('service_type');
            $table->json('area_served');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
