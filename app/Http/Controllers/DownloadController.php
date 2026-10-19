<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadController extends Controller
{
    public function show(string $token)
    {
        $order = ProductOrder::where('download_token', $token)->first();

        if (! $order || ! $order->isDownloadable()) {
            return response()->view('products.download-expired', [], 403);
        }

        $product = collect(config('products'))->firstWhere('slug', $order->product_slug);

        if (! $product) {
            abort(404);
        }

        $path = storage_path('app/'.ltrim($product['file_path'], '/'));

        if (! file_exists($path)) {
            return response()->view('products.download-expired', [
                'reason' => 'The archive is being prepared. Please try again shortly or email ceo@saasnext.in.',
            ], 404);
        }

        $order->increment('download_count');
        $filename = basename($path);

        return new StreamedResponse(function () use ($path): void {
            $stream = fopen($path, 'rb');
            fpassthru($stream);
            fclose($stream);
        }, 200, [
            'Content-Type' => 'application/zip',
            'Content-Length' => (string) filesize($path),
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }
}
