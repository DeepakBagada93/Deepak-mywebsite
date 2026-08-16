<?php echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n"; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://saasnext.in/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    @foreach ($posts as $post)
    <url>
        <loc>https://saasnext.in/journal/{{ $post->slug }}</loc>
        @if ($post->updated_at)
        <lastmod>{{ $post->updated_at->toDateString() }}</lastmod>
        @endif
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach
</urlset>
