<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Legacy deployments exposed the Laravel front controller under /public/*,
 * so Google indexed duplicate URLs such as /public/journal alongside the
 * canonical /journal. Strip the prefix with a permanent redirect so those
 * duplicates consolidate instead of being reported as alternate pages.
 *
 * Important: use the raw REQUEST_URI, not $request->path(). When the web
 * server document root is /public, Symfony strips /public from the path
 * info, so $request->path() returns "journal" and the duplicate is missed.
 */
class RedirectPublicPrefix
{
    public function handle(Request $request, Closure $next): Response
    {
        $raw = $request->server('REQUEST_URI') ?: $request->getRequestUri();
        $path = parse_url((string) $raw, PHP_URL_PATH) ?: '/';
        $path = '/'.ltrim($path, '/');

        if ($path === '/public' || str_starts_with($path, '/public/')) {
            $target = substr($path, strlen('/public')) ?: '/';
            $query = $request->getQueryString();

            return redirect()->to($target.($query ? '?'.$query : ''), 301);
        }

        return $next($request);
    }
}
