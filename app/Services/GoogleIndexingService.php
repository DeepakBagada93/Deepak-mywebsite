<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleIndexingService
{
    public const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
    public const TOKEN_ENDPOINT    = 'https://oauth2.googleapis.com/token';
    public const OAUTH_SCOPE_INDEX = 'https://www.googleapis.com/auth/indexing';
    public const OAUTH_SCOPE_GSC   = 'https://www.googleapis.com/auth/webmasters';

    public const MAX_DAILY_QUOTA   = 180; // Safe ceiling (Google limit 200/day)
    public const SITE_URL          = 'https://deepakbagada.in';
    public const SITEMAP_URL       = 'https://deepakbagada.in/sitemap.xml';

    protected static ?string $cachedIndexToken = null;
    protected static int $indexTokenExpiry = 0;

    protected static ?string $cachedGscToken = null;
    protected static int $gscTokenExpiry = 0;

    /**
     * Resolve Google Service Account JSON path.
     */
    public static function getCredentialsPath(): ?string
    {
        $envPath = env('GOOGLE_APPLICATION_CREDENTIALS');
        if (!empty($envPath)) {
            $path = str_starts_with($envPath, '/') ? $envPath : base_path($envPath);
            if (file_exists($path)) {
                return $path;
            }
        }

        $candidates = [
            base_path('saasnext-kpi-b98f895e34af.json'),
            base_path('storage/credentials/google-indexing-service-account.json'),
            base_path('storage/credentials/service-account.json'),
        ];

        foreach ($candidates as $cand) {
            if (file_exists($cand)) {
                return $cand;
            }
        }

        return null;
    }

    /**
     * Get OAuth2 Token via RS256 JWT signature.
     */
    public static function getAccessToken(string $scope = self::OAUTH_SCOPE_INDEX): string
    {
        $isIndex = ($scope === self::OAUTH_SCOPE_INDEX);
        if ($isIndex && self::$cachedIndexToken && time() < (self::$indexTokenExpiry - 60)) {
            return self::$cachedIndexToken;
        }
        if (!$isIndex && self::$cachedGscToken && time() < (self::$gscTokenExpiry - 60)) {
            return self::$cachedGscToken;
        }

        $credPath = self::getCredentialsPath();
        if (!$credPath || !file_exists($credPath)) {
            throw new \RuntimeException("Google credentials file not found.");
        }

        $creds = json_decode(file_get_contents($credPath), true);
        if (!$creds || empty($creds['client_email']) || empty($creds['private_key'])) {
            throw new \RuntimeException("Invalid service account credentials in {$credPath}");
        }

        $now = time();
        $header = ['alg' => 'RS256', 'typ' => 'JWT'];
        $claims = [
            'iss'   => $creds['client_email'],
            'scope' => $scope,
            'aud'   => self::TOKEN_ENDPOINT,
            'exp'   => $now + 3600,
            'iat'   => $now,
        ];

        $b64Header = self::base64UrlEncode(json_encode($header));
        $b64Claims = self::base64UrlEncode(json_encode($claims));
        $sigInput = $b64Header . '.' . $b64Claims;

        $privateKey = openssl_pkey_get_private($creds['private_key']);
        if (!$privateKey) {
            throw new \RuntimeException("Failed to load private key from Google credentials");
        }

        $signature = '';
        if (!openssl_sign($sigInput, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
            throw new \RuntimeException("Failed to sign JWT with RSA private key");
        }

        $jwt = $sigInput . '.' . self::base64UrlEncode($signature);

        $response = Http::asForm()->timeout(15)->post(self::TOKEN_ENDPOINT, [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]);

        if (!$response->successful()) {
            throw new \RuntimeException("OAuth2 token exchange failed: " . $response->body());
        }

        $tokenData = $response->json();
        $token = $tokenData['access_token'] ?? null;
        if (!$token) {
            throw new \RuntimeException("No access_token returned by Google OAuth");
        }

        $expiry = $now + ($tokenData['expires_in'] ?? 3600);
        if ($isIndex) {
            self::$cachedIndexToken = $token;
            self::$indexTokenExpiry = $expiry;
        } else {
            self::$cachedGscToken = $token;
            self::$gscTokenExpiry = $expiry;
        }

        return $token;
    }

    /**
     * Submit URL notification to Google Indexing API.
     */
    public static function publish(string $url, string $type = 'URL_UPDATED'): array
    {
        $token = self::getAccessToken(self::OAUTH_SCOPE_INDEX);

        $response = Http::withToken($token)
            ->timeout(12)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(self::INDEXING_ENDPOINT, [
                'url'  => $url,
                'type' => $type,
            ]);

        return [
            'status'  => $response->status(),
            'success' => $response->successful(),
            'body'    => $response->json() ?? $response->body(),
        ];
    }

    /**
     * Ping sitemap in Google Search Console.
     */
    public static function pingSitemap(): bool
    {
        try {
            $token = self::getAccessToken(self::OAUTH_SCOPE_GSC);
            $siteEncoded = urlencode(self::SITE_URL . '/');
            $feedEncoded = urlencode(self::SITEMAP_URL);

            $url = "https://www.googleapis.com/webmasters/v3/sites/{$siteEncoded}/sitemaps/{$feedEncoded}";
            $res = Http::withToken($token)->timeout(12)->put($url);
            return $res->successful() || $res->status() === 204;
        } catch (\Throwable $e) {
            Log::warning("GSC Sitemap ping warning: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Preflight verify that a URL responds with HTTP 200.
     */
    public static function verifyHttp200(string $url): bool
    {
        try {
            $res = Http::timeout(6)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; GoogleIndexingSentinel/2.0)'])
                ->get($url);
            return $res->status() === 200;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Get count of URLs submitted today.
     */
    public static function getDailyQuotaUsed(): int
    {
        $quotaFile = base_path('.agent/indexing_quota.json');
        if (File::exists($quotaFile)) {
            try {
                $data = json_decode(File::get($quotaFile), true);
                $today = Carbon::now('UTC')->format('Y-m-d');
                if (($data['date'] ?? '') === $today) {
                    return (int)($data['count'] ?? 0);
                }
            } catch (\Throwable $e) {
                // fall through
            }
        }
        return 0;
    }

    /**
     * Increment today's quota counter.
     */
    public static function recordQuotaUsed(int $added = 1): int
    {
        $quotaFile = base_path('.agent/indexing_quota.json');
        $today = Carbon::now('UTC')->format('Y-m-d');
        $current = self::getDailyQuotaUsed();
        $newCount = $current + $added;

        File::ensureDirectoryExists(dirname($quotaFile));
        File::put($quotaFile, json_encode([
            'date'         => $today,
            'count'        => $newCount,
            'last_updated' => Carbon::now('UTC')->toIso8601String(),
        ], JSON_PRETTY_PRINT));

        return $newCount;
    }

    /**
     * Load submission history.
     */
    public static function loadHistory(): array
    {
        $file = base_path('.agent/google_indexing_history.json');
        if (File::exists($file)) {
            try {
                return json_decode(File::get($file), true) ?? [];
            } catch (\Throwable $e) {
                return [];
            }
        }
        return [];
    }

    /**
     * Save submission history.
     */
    public static function saveHistory(array $history): void
    {
        $file = base_path('.agent/google_indexing_history.json');
        File::ensureDirectoryExists(dirname($file));
        File::put($file, json_encode($history, JSON_PRETTY_PRINT));
    }

    protected static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
