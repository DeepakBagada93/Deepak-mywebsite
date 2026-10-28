#!/usr/bin/env php
<?php

/**
 * audit-sales-pages.php — AEO/SEO/CRO audit for the three revenue surfaces.
 *
 * Renders the real Blade output through Laravel (no HTTP server needed) and
 * checks metadata budgets, headings, canonicals, schema, keyword coverage,
 * review/schema integrity, and internal links.
 *
 * Usage:
 *   php scripts/audit-sales-pages.php
 *   php scripts/audit-sales-pages.php --label=baseline
 *   php scripts/audit-sales-pages.php --strict
 */

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$options = getopt('', ['label::', 'strict::', 'out::']);
$label = $options['label'] ?? 'run';
$strict = isset($options['strict']);
$outBase = $options['out'] ?? (__DIR__.'/../research/sales-page-audit-'.$label);

$pages = [
    '/' => [
        'name' => 'Home',
        'keywords' => [
            'best ai expert in gujarat',
            'ai consultant in gujarat',
            'ai developer in gujarat',
            'ai expert in junagadh',
            'ai agent developer india',
            'ai automation agency india',
            'hire ai consultant india',
            'custom ai agent development india',
            'enterprise ai automation india',
            'ai agent architect',
            'web developer junagadh',
            'seo',
        ],
    ],
    '/products' => [
        'name' => 'Store',
        'keywords' => [
            'ai toolkits',
            'digital products',
            'instant download',
            'commercial license',
            'ai agent',
            'buy once',
        ],
    ],
    '/products/agent-skills-master-bundle' => [
        'name' => 'Bundle product',
        'keywords' => [
            'ai systems master bundle',
            'ai toolkits',
            'instant download',
            'commercial license',
            'mcp',
            'n8n',
        ],
    ],
    '/products/agent-context-architect' => [
        'name' => 'Paid product',
        'keywords' => [
            'agent context architect',
            'ai agent',
            'context',
            'commercial license',
        ],
    ],
];

function text_of(DOMXPath $xpath, string $query): string
{
    $node = $xpath->query($query)->item(0);

    return $node ? trim(preg_replace('/\s+/', ' ', $node->textContent)) : '';
}

function attr_of(DOMXPath $xpath, string $query): string
{
    $node = $xpath->query($query)->item(0);

    return $node ? trim($node->nodeValue) : '';
}

function schema_types(mixed $value, array &$types, bool &$hasAggregateRating): void
{
    if (! is_array($value)) {
        return;
    }

    if (isset($value['@type'])) {
        foreach ((array) $value['@type'] as $type) {
            if (is_string($type)) {
                $types[] = $type;
            }
        }
    }

    if (array_key_exists('aggregateRating', $value)) {
        $hasAggregateRating = true;
    }

    foreach ($value as $child) {
        schema_types($child, $types, $hasAggregateRating);
    }
}

$results = [];

foreach ($pages as $path => $config) {
    $request = Request::create($path, 'GET');
    $response = $kernel->handle($request);
    $html = $response->getContent();
    $status = $response->getStatusCode();

    $dom = new DOMDocument;
    libxml_use_internal_errors(true);
    $dom->loadHTML('<?xml encoding="utf-8" ?>'.$html);
    libxml_clear_errors();
    $xpath = new DOMXPath($dom);

    $title = text_of($xpath, '//title');
    $description = attr_of($xpath, '//meta[@name="description"]/@content');
    $canonical = attr_of($xpath, '//link[@rel="canonical"]/@href');
    $robots = attr_of($xpath, '//meta[@name="robots"]/@content');
    $h1s = [];
    foreach ($xpath->query('//h1') as $h1) {
        $h1s[] = trim(preg_replace('/\s+/', ' ', $h1->textContent));
    }

    $jsonLd = [];
    $types = [];
    $hasAggregateRating = false;
    $schemaValid = true;
    foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
        $decoded = json_decode(trim($script->textContent), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $schemaValid = false;

            continue;
        }
        $jsonLd[] = $decoded;
        schema_types($decoded, $types, $hasAggregateRating);
    }
    $types = array_values(array_unique($types));

    $bodyText = '';
    $body = $xpath->query('//body')->item(0);
    if ($body) {
        $bodyText = strtolower(preg_replace('/\s+/', ' ', $body->textContent));
    }
    $hasVisibleReview = (bool) preg_match('/\b(review|reviews|testimonial|testimonials|rated by)\b/i', $bodyText);

    $internalLinks = [];
    foreach ($xpath->query('//a[@href]') as $a) {
        $href = trim($a->getAttribute('href'));
        if ($href === '' || str_starts_with($href, '#') || str_starts_with($href, 'mailto:') || str_starts_with($href, 'tel:')) {
            continue;
        }
        if (str_starts_with($href, '/') || str_contains($href, 'deepakbagada.in')) {
            $internalLinks[$href] = true;
        }
    }

    $lowerHtml = strtolower($html);
    $keywordHits = [];
    $keywordMisses = [];
    foreach ($config['keywords'] as $keyword) {
        if (str_contains($lowerHtml, strtolower($keyword))) {
            $keywordHits[] = $keyword;
        } else {
            $keywordMisses[] = $keyword;
        }
    }

    $failures = [];
    if ($status !== 200) {
        $failures[] = "HTTP status {$status}";
    }
    if (mb_strlen($title) < 50 || mb_strlen($title) > 60) {
        $failures[] = 'Title outside 50-60 chars: '.mb_strlen($title);
    }
    if (mb_strlen($description) < 145 || mb_strlen($description) > 158) {
        $failures[] = 'Description outside 145-158 chars: '.mb_strlen($description);
    }
    if (count($h1s) !== 1) {
        $failures[] = 'H1 count: '.count($h1s);
    }
    if ($canonical === '') {
        $failures[] = 'Missing canonical';
    }
    if (! $schemaValid) {
        $failures[] = 'Invalid JSON-LD';
    }
    if ($hasAggregateRating && ! $hasVisibleReview) {
        $failures[] = 'aggregateRating without visible reviews';
    }
    if ($keywordMisses !== []) {
        $failures[] = 'Missing keywords: '.implode(', ', $keywordMisses);
    }
    if (count($internalLinks) < 3) {
        $failures[] = 'Internal links below 3: '.count($internalLinks);
    }

    $results[] = [
        'path' => $path,
        'name' => $config['name'],
        'status' => $status,
        'title' => $title,
        'title_length' => mb_strlen($title),
        'description' => $description,
        'description_length' => mb_strlen($description),
        'h1s' => $h1s,
        'canonical' => $canonical,
        'robots' => $robots,
        'schema_valid' => $schemaValid,
        'schema_types' => $types,
        'aggregate_rating' => $hasAggregateRating,
        'visible_review_text' => $hasVisibleReview,
        'internal_links' => count($internalLinks),
        'keyword_hits' => $keywordHits,
        'keyword_misses' => $keywordMisses,
        'failures' => $failures,
        'pass' => $failures === [],
    ];

    $kernel->terminate($request, $response);
}

$total = count($results);
$passed = count(array_filter($results, static fn (array $r) => $r['pass']));

$md = "# Sales Page Audit — {$label}\n\n";
$md .= 'Generated: '.date('Y-m-d H:i:s T')."\n\n";
$md .= "Pages: {$total} · Passed: {$passed} · Failed: ".($total - $passed)."\n\n";
$md .= "| Page | Status | Title | Desc | H1 | Schema | Keywords | Internal links |\n";
$md .= "|---|---|---:|---:|---:|---|---:|---:|\n";
foreach ($results as $r) {
    $md .= sprintf(
        "| %s (`%s`) | %s | %d | %d | %d | %s | %d/%d | %d |\n",
        $r['name'],
        $r['path'],
        $r['pass'] ? 'PASS' : 'FAIL',
        $r['title_length'],
        $r['description_length'],
        count($r['h1s']),
        $r['schema_valid'] ? 'valid' : 'invalid',
        count($r['keyword_hits']),
        count($r['keyword_hits']) + count($r['keyword_misses']),
        $r['internal_links']
    );
}

$md .= "\n## Failures\n\n";
foreach ($results as $r) {
    if ($r['pass']) {
        continue;
    }
    $md .= "### {$r['name']} (`{$r['path']}`)\n\n";
    foreach ($r['failures'] as $failure) {
        $md .= "- {$failure}\n";
    }
    $md .= "\n";
}

$md .= "## Page Details\n\n";
foreach ($results as $r) {
    $md .= "### {$r['name']} (`{$r['path']}`)\n\n";
    $md .= '- Title ('.$r['title_length']."): {$r['title']}\n";
    $md .= '- Description ('.$r['description_length']."): {$r['description']}\n";
    $md .= '- H1: '.implode(' | ', $r['h1s'])."\n";
    $md .= "- Canonical: {$r['canonical']}\n";
    $md .= "- Robots: {$r['robots']}\n";
    $md .= '- Schema: '.(count($r['schema_types']) ? implode(', ', $r['schema_types']) : 'none')."\n";
    $md .= '- Keyword misses: '.(count($r['keyword_misses']) ? implode(', ', $r['keyword_misses']) : 'none')."\n\n";
}

file_put_contents($outBase.'.md', $md);
file_put_contents($outBase.'.json', json_encode([
    'label' => $label,
    'generated_at' => date('c'),
    'pages' => $results,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n");

echo "WROTE {$outBase}.md\n";
echo "WROTE {$outBase}.json\n";
echo "Pages: {$total} · Passed: {$passed} · Failed: ".($total - $passed)."\n";
foreach ($results as $r) {
    echo ($r['pass'] ? 'PASS ' : 'FAIL ').$r['name'].' ('.$r['path'].')'.($r['pass'] ? '' : ' — '.implode('; ', $r['failures']))."\n";
}

exit($strict && $passed !== $total ? 1 : 0);
