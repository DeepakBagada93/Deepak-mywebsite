@php
    $theme = $theme ?? 'light';
    $source = $source ?? 'website';
    $label = $label ?? '// THE PRIVATE DISPATCH';
    $title = $title ?? 'Field Notes on Autonomous AI, MCP & Modern Web';
    $description = $description ?? 'Direct from Junagadh, Gujarat. Zero spam, zero sponsored filler. Real-world multi-agent architectures, runnable MCP code, and technical field lessons shipped to your inbox weekly.';
@endphp

<div class="newsletter-block newsletter-block--{{ $theme }}" data-newsletter-block>
    <div class="newsletter-block__inner">
        <div class="newsletter-block__header">
            <span class="mono newsletter-block__label">{{ $label }}</span>
            <h3 class="newsletter-block__title">{{ $title }}</h3>
            <p class="newsletter-block__desc">{{ $description }}</p>
        </div>

        <form action="{{ route('newsletter.subscribe') }}" method="POST" class="newsletter-form" data-newsletter-form>
            @csrf
            {{-- Anti-spam honeypot --}}
            <input type="text" name="newsletter_hp_check" value="" tabindex="-1" autocomplete="off" class="newsletter-form__hp" aria-hidden="true">
            <input type="hidden" name="source" value="{{ $source }}">

            <div class="newsletter-form__group">
                <input 
                    type="email" 
                    name="email" 
                    class="newsletter-form__input" 
                    placeholder="Enter your email address..." 
                    value="{{ old('email') }}" 
                    required 
                    autocomplete="email"
                    aria-label="Email address for newsletter"
                >
                <button type="submit" class="btn {{ $theme === 'dark' ? 'btn--newsletter-light' : 'btn--solid' }} newsletter-form__btn">
                    <span class="newsletter-form__btn-text">Join Dispatch →</span>
                    <span class="newsletter-form__btn-loading" style="display: none;">Subscribing...</span>
                </button>
            </div>

            <div class="newsletter-form__feedback mono" role="status" aria-live="polite">
                @if (session('newsletter_success'))
                    <p class="newsletter-form__message newsletter-form__message--success">{{ session('newsletter_success') }}</p>
                @elseif (session('newsletter_info'))
                    <p class="newsletter-form__message newsletter-form__message--info">{{ session('newsletter_info') }}</p>
                @elseif ($errors->has('email'))
                    <p class="newsletter-form__message newsletter-form__message--error">{{ $errors->first('email') }}</p>
                @endif
            </div>

            <p class="newsletter-form__subtext mono">
                Zero spam · Weekly engineering insights · One-click unsubscribe anytime
            </p>
        </form>
    </div>
</div>
