<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_reference')->unique();
            $table->string('cf_order_id')->nullable();
            $table->string('product_slug');
            $table->string('product_title');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->unsignedInteger('amount')->default(0);
            $table->string('currency', 8)->default('INR');
            $table->string('payment_status')->default('PENDING')->index();
            $table->string('payment_session_id')->nullable();
            $table->string('download_token', 64)->nullable()->unique();
            $table->unsignedInteger('download_count')->default(0);
            $table->unsignedInteger('download_max_limit')->default(5);
            $table->timestamp('download_expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_orders');
    }
};
