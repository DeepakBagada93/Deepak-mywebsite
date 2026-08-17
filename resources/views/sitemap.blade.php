<?php echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n"; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{{ $url }}/</loc>
        <lastmod>{{ date('Y-m-d') }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{{ $url }}/services</loc>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    @foreach ($services as $service)
    <url>
        <loc>{{ $url }}/services/{{ $service->slug }}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    @endforeach
    @foreach ($posts as $post)
    <url>
        <loc>{{ $url }}/journal/{{ $post->slug }}</loc>
        <lastmod>{{ $post->date?->toDateString() ?? '' }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach
</urlset>
