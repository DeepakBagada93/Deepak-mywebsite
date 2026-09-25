<?php

namespace Tests\Feature;

use App\Mail\NewsletterWelcomeMail;
use App\Models\Subscriber;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_welcome_email_is_sent_to_new_subscriber(): void
    {
        Mail::fake();

        $this->postJson('/newsletter/subscribe', [
            'email' => 'welcome.test@example.com',
            'source' => 'footer',
        ])->assertStatus(200);

        Mail::assertSent(NewsletterWelcomeMail::class, function ($mail) {
            return $mail->hasTo('welcome.test@example.com');
        });
    }

    public function test_user_can_subscribe_with_valid_email(): void
    {
        $response = $this->post('/newsletter/subscribe', [
            'email' => 'developer@example.com',
            'source' => 'footer',
        ]);

        $response->assertSessionHas('newsletter_success');
        $this->assertDatabaseHas('subscribers', [
            'email' => 'developer@example.com',
            'status' => 'active',
            'source' => 'footer',
        ]);

        $sub = Subscriber::where('email', 'developer@example.com')->first();
        $this->assertNotNull($sub);
        $this->assertNotEmpty($sub->unsubscribe_token);
        $this->assertNotNull($sub->subscribed_at);
    }

    public function test_subscribing_via_ajax_returns_json_success(): void
    {
        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'agent.architect@deepakbagada.in',
            'source' => 'journal_index',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('subscribers', [
            'email' => 'agent.architect@deepakbagada.in',
            'source' => 'journal_index',
        ]);
    }

    public function test_subscribing_with_invalid_email_fails(): void
    {
        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'not-a-valid-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('subscribers', 0);
    }

    public function test_subscribing_duplicate_email_returns_already_subscribed(): void
    {
        Subscriber::create([
            'email' => 'existing@example.com',
            'status' => 'active',
        ]);

        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'already_subscribed' => true,
            ]);

        $this->assertDatabaseCount('subscribers', 1);
    }

    public function test_unsubscribed_user_can_resubscribe(): void
    {
        $sub = Subscriber::create([
            'email' => 'returned@example.com',
            'status' => 'unsubscribed',
            'unsubscribed_at' => now()->subDays(5),
        ]);

        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'returned@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $sub->refresh();
        $this->assertEquals('active', $sub->status);
        $this->assertNull($sub->unsubscribed_at);
    }

    public function test_honeypot_silently_ignores_bot(): void
    {
        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'spambot@spam.com',
            'newsletter_hp_check' => 'I am a malicious bot',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('subscribers', [
            'email' => 'spambot@spam.com',
        ]);
    }

    public function test_user_can_unsubscribe_with_valid_token(): void
    {
        $sub = Subscriber::create([
            'email' => 'quitter@example.com',
            'status' => 'active',
            'unsubscribe_token' => 'test-token-1234567890',
        ]);

        $response = $this->get('/newsletter/unsubscribe/test-token-1234567890');

        $response->assertStatus(200)
            ->assertSee('Unsubscribed Successfully');

        $sub->refresh();
        $this->assertEquals('unsubscribed', $sub->status);
        $this->assertNotNull($sub->unsubscribed_at);
    }

    public function test_unsubscribe_with_invalid_token_shows_friendly_message(): void
    {
        $response = $this->get('/newsletter/unsubscribe/non-existent-token');

        $response->assertStatus(200)
            ->assertSee('Link Expired or Invalid');
    }

    public function test_pages_render_newsletter_form(): void
    {
        $home = $this->get('/');
        $home->assertStatus(200);
        $home->assertSee('newsletter-form');
        $home->assertSee('Stay Ahead of the Autonomous AI Frontier');
        $home->assertSee('data-newsletter-trigger');
        $home->assertSee('newsletter-modal');

        $journal = $this->get('/journal');
        $journal->assertStatus(200);
        $journal->assertSee('newsletter-form');
        $journal->assertSee('Get New Field Notes In Your Inbox');
        $journal->assertSee('data-newsletter-trigger');
        $journal->assertSee('newsletter-modal');
    }
}
