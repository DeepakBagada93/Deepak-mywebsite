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
 */
class RedirectPublicPrefix
{
    public function handle(Request $request, Closure $next): Response
    {
        $path = ltrim($request->path(), '/');

        if ($path === 'public' || str_starts_with($path, 'public/')) {
            $target = '/'.ltrim(substr($path, strlen('public')), '/');
            $query = $request->getQueryString();

            return redirect()->to($target.($query ? '?'.$query : ''), 301);
        }

        return $next($request);
    }
}
