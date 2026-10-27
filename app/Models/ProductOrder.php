<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductOrder extends Model
{
    public const STATUS_PENDING = 'PENDING';

    public const STATUS_SUCCESS = 'SUCCESS';

    public const STATUS_FAILED = 'FAILED';

    protected $fillable = [
        'order_reference',
        'cart_reference',
        'cf_order_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'product_slug',
        'product_title',
        'customer_name',
        'customer_email',
        'customer_phone',
        'amount',
        'currency',
        'payment_status',
        'payment_session_id',
        'download_token',
        'download_count',
        'download_max_limit',
        'download_expires_at',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'download_expires_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public static function generateReference(): string
    {
        return 'DB-'.now()->format('ymd').'-'.strtoupper(Str::random(8));
    }

    /**
     * All line items belonging to the same checkout.
     *
     * @return Collection<int, ProductOrder>
     */
    public static function group(string $cartReference): Collection
    {
        return static::where('cart_reference', $cartReference)->orderBy('id')->get();
    }

    public function markPaid(?string $gatewayOrderId = null, ?string $paymentId = null, ?string $signature = null): void
    {
        $attributes = [
            'payment_status' => self::STATUS_SUCCESS,
            'paid_at' => $this->paid_at ?? now(),
            'download_token' => $this->download_token ?: Str::random(48),
            'download_expires_at' => now()->addHours(48),
            'download_count' => 0,
        ];

        if ($gatewayOrderId) {
            $attributes['razorpay_order_id'] = $gatewayOrderId;
            $attributes['cf_order_id'] = $gatewayOrderId;
        }

        if ($paymentId) {
            $attributes['razorpay_payment_id'] = $paymentId;
        }

        if ($signature) {
            $attributes['razorpay_signature'] = $signature;
        }

        $this->update($attributes);
    }

    public function isDownloadable(): bool
    {
        return $this->payment_status === self::STATUS_SUCCESS
            && $this->download_token
            && $this->download_expires_at
            && now()->lessThan($this->download_expires_at)
            && $this->download_count < $this->download_max_limit;
    }

    public function getDownloadUrlAttribute(): ?string
    {
        return $this->download_token ? url('/download/'.$this->download_token) : null;
    }
}
