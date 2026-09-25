<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcomeMail;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email address to the newsletter.
     */
    public function subscribe(Request $request): JsonResponse|RedirectResponse
    {
        // Honeypot trap for automated spam bots
        if ($request->filled('newsletter_hp_check')) {
            $msg = "Thank you for subscribing! You're on the dispatch list.";
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['success' => true, 'message' => $msg]);
            }
            return back()->with('newsletter_success', $msg);
        }

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email:rfc,filter', 'max:255'],
            'source' => ['nullable', 'string', 'max:64'],
        ], [
            'email.required' => 'Please enter a valid email address.',
            'email.email' => 'Please provide a valid email format (e.g. name@example.com).',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => $validator->errors()->first('email'),
                ], 422);
            }

            return back()->withErrors($validator)->withInput();
        }

        $email = strtolower(trim((string) $request->input('email')));
        $source = (string) $request->input('source', 'website');

        $subscriber = Subscriber::where('email', $email)->first();

        if ($subscriber) {
            if ($subscriber->isActive()) {
                $msg = "You are already subscribed to the dispatch! Stay tuned for upcoming notes.";
                if ($request->expectsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => true,
                        'already_subscribed' => true,
                        'message' => $msg,
                    ]);
                }
                return back()->with('newsletter_info', $msg);
            }

            $subscriber->resubscribe();

            try {
                Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
            } catch (\Throwable $e) {
                Log::warning('Failed to send newsletter welcome email on resubscribe: '.$e->getMessage());
            }

            $msg = "Welcome back! Your newsletter subscription has been reactivated.";
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => $msg,
                ]);
            }
            return back()->with('newsletter_success', $msg);
        }

        $subscriber = Subscriber::create([
            'email' => $email,
            'source' => $source ?: 'website',
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
        ]);

        try {
            Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
        } catch (\Throwable $e) {
            Log::warning('Failed to send newsletter welcome email on new subscription: '.$e->getMessage());
        }

        $msg = "Thank you for subscribing! You will receive future technical dispatches & architectural breakdowns.";

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $msg,
            ]);
        }

        return back()->with('newsletter_success', $msg);
    }

    /**
     * One-click unsubscribe handler.
     */
    public function unsubscribe(Request $request, string $token): View
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');

        $subscriber = Subscriber::where('unsubscribe_token', $token)->first();

        $status = 'not_found';
        $message = 'Subscription token not found or already removed.';

        if ($subscriber) {
            if ($subscriber->isActive()) {
                $subscriber->unsubscribe();
                $status = 'success';
                $message = "You have been successfully unsubscribed from {$site['name']}'s newsletter.";
            } else {
                $status = 'already_unsubscribed';
                $message = "You have already been unsubscribed from this mailing list.";
            }
        }

        $head = [
            'title' => 'Newsletter Preferences — '.$site['name'],
            'description' => 'Manage your newsletter subscription preferences.',
            'canonical' => $url.'/newsletter/unsubscribe/'.$token,
            'robots' => 'noindex, nofollow',
        ];

        return view('newsletter.unsubscribe', compact('site', 'head', 'status', 'message'));
    }
}
