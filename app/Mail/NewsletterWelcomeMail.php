<?php

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Subscriber $subscriber
    ) {}

    public function envelope(): Envelope
    {
        $site = config('site');

        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: 'Welcome to The Dispatch — '.$site['name'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-welcome',
            with: [
                'site' => config('site'),
                'subscriber' => $this->subscriber,
                'unsubscribeUrl' => $this->subscriber->getUnsubscribeUrl(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
