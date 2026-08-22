# Open-Source Community Hub — TODO List with Phases & CI Checks

## 📋 How to use

```
[ ] = not started    [~] = in progress    [✓] = done
```

Each phase builds on the previous. Phase 1 is the MVP (~25 hours over 2 weeks).
Phase 2 adds growth mechanics. Phase 3 opens for community.

---

## Phase 0 — Pre-Flight (Do this first)

> Foundation: models, migrations, routes, and a CI check so nothing breaks.

### 0.1 — Migration & Model Scaffold

- [✓] Create `database/migrations/2026_08_22_000001_create_skills_table.php`
  - Fields: `id`, `title`, `slug` (unique), `summary`, `content` (longText/markdown), `category_id` (FK), `difficulty` (enum: beginner/intermediate/advanced), `github_url`, `version`, `stars`, `status` (enum: draft/published/archived), `sort_order`, `published_at`, timestamps
- [✓] Create `database/migrations/2026_08_22_000000_create_skill_categories_table.php`
  - Fields: `id`, `name`, `slug` (unique), `description`, `icon`, `sort_order`, timestamps
  - Seed categories: `agent-architecture`, `content-creation`, `ai-ads`, `automation`, `seo-aeo`, `mcp`, `video`
- [✓] Create `database/migrations/2026_08_22_000003_create_skill_architectures_table.php`
  - Fields: `id`, `skill_id` (FK), `title`, `description`, `diagram_svg` (longText), `diagram_png` (nullable), `sort_order`, timestamps
- [✓] Create `database/migrations/2026_08_22_000004_create_curated_repos_table.php`
  - Fields: `id`, `title`, `url`, `description`, `category`, `tags` (JSON), `why_great` (text — your personal take), `stars`, `featured` (bool), `sort_order`, timestamps

### 0.2 — Models

- [✓] Create `app/Models/Skill.php`
  - Fillable, casts, belongsTo(SkillCategory), hasMany(SkillArchitecture)
- [✓] Create `app/Models/SkillCategory.php`
  - Fillable, hasMany(Skill)
- [✓] Create `app/Models/SkillArchitecture.php`
  - Fillable, belongsTo(Skill)
- [✓] Create `app/Models/CuratedRepo.php`
  - Fillable, casts

### 0.3 — Routes & Controllers

- [✓] Create `app/Http/Controllers/SkillController.php`
  - `index()` — list skills with category filter
  - `show(Skill $skill)` — single skill with architectures
  - `category(SkillCategory $category)` — filter by category
- [✓] Create `app/Http/Controllers/BlueprintController.php`
  - `index()` — all architecture diagrams gallery
  - `show($id)` — single blueprint full view
- [✓] Create `app/Http/Controllers/CuratedRepoController.php`
  - `index()` — directory of great repos
  - `category($category)` — filter view
- [✓] Add routes in `routes/web.php`:
  ```php
  Route::prefix('library')->group(function () {
      Route::get('/', [SkillController::class, 'index'])->name('library.index');
      Route::get('/{skill:slug}', [SkillController::class, 'show'])->name('library.show');
      Route::get('/category/{category:slug}', [SkillController::class, 'category'])->name('library.category');
  });

  Route::prefix('blueprints')->group(function () {
      Route::get('/', [BlueprintController::class, 'index'])->name('blueprints.index');
      Route::get('/{id}', [BlueprintController::class, 'show'])->name('blueprints.show');
  });

  Route::prefix('repos')->group(function () {
      Route::get('/', [CuratedRepoController::class, 'index'])->name('repos.index');
      Route::get('/category/{category}', [CuratedRepoController::class, 'category'])->name('repos.category');
  });
  ```

### 0.4 — Seeders

- [✓] Create `database/seeders/SkillCategorySeeder.php` — seed categories
- [✓] Create `database/seeders/SkillSeeder.php` — seed 5 starter skills
- [✓] Create `database/seeders/CuratedRepoSeeder.php` — seed 20 repos
- [✓] Add all to `DatabaseSeeder.php`

---

## Phase 1 — MVP Views (Build the UI)

> Blade views with the existing editorial luxury design system.

### 1.1 — Skill Library Views

- [✓] Create `resources/views/library/index.blade.php`
  - Category filter tabs (pill buttons, mono style)
  - Skill cards grid: icon + title + summary + difficulty badge + stars
  - Pagination (16 per page)
  - `@extends('layouts.app')` with `section('content')`
- [✓] Create `resources/views/library/show.blade.php`
  - Hero: title, category, difficulty, GitHub link, stars
  - Full markdown content rendered (use `App\Support\Markdown` like journal)
  - Architecture diagrams gallery (if any)
  - "Related skills" sidebar
  - Schema: `TechArticle` structured data
- [✓] Create `resources/views/library/partials/_card.blade.php` — reusable skill card
- [✓] Create `resources/views/library/partials/_category_filter.blade.php` — pill tabs

### 1.2 — Blueprints Gallery Views

- [✓] Create `resources/views/blueprints/index.blade.php`
  - Grid of architecture diagrams (SVG previews)
  - Filter by category
  - "Click to expand" interaction
- [✓] Create `resources/views/blueprints/show.blade.php`
  - Full SVG render
  - Description + annotations
  - Related skills list

### 1.3 — Great Repos View

- [✓] Create `resources/views/repos/index.blade.php`
  - Table/card layout: repo name, stars, category, your "why great" blurb
  - Sort: by stars, by category, by featured
  - External link button to GitHub

### 1.4 — Navigation Wiring

- [✓] Update `resources/views/partials/masthead.blade.php`:
  - Add nav items: `Library`, `Blueprints`, `Repos`
- [✓] Update `resources/views/partials/footer.blade.php`:
  - Add "Open Source" column with links

---

## Phase 2 — Content Publishing (Seed the Library)

> This is where you actually publish your work.

### 2.1 — Sanitize & Publish First 5 Skills

- [✓] **Skill 1: MCP Agent Builder** — full pipeline (PRD → scaffold → audit)
  - Remove personal API keys, local paths, `.env` references
  - Add architecture diagram (Mermaid or Excalidraw)
- [✓] **Skill 2: Content Repurposing Hub** — blog → X → LinkedIn → Newsletter → Video
  - Sanitize scripts, remove local file paths
  - Show input/output contract examples
- [✓] **Skill 3: Video Product Pipeline** — trend hunt → brief → generate → audit
  - Clean up personal references
  - Show viral scorecard example
- [✓] **Skill 4: Paid Ads Studio** — Veo 3.1 + Meta/Google prompts
  - Remove ad account IDs, client references
  - Keep campaign blueprints and cost rules
- [✓] **Skill 5: AI Automation** — vetting → workflow design → build
  - Remove client-specific workflow details
  - Keep generic templates and audit output

### 2.2 — Write 3 Architecture Blueprints

- [✓] **Blueprint 1: Multi-Agent System Architecture**
  - How agents communicate, handoff protocol, error recovery
  - SVG diagram
- [✓] **Blueprint 2: Content Creation Pipeline**
  - Idea → video → repurpose → distribute → measure
  - Show the full stack with tool names
- [✓] **Blueprint 3: MCP Server Design**
  - Tool/resource/prompt wiring, auth flow, transport layer

### 2.3 — Curate 20 Great Repos

- [✓] Pick 20 AI repos you actually use and respect
- [✓] Write **your personal take** on each (not just description)
- [✓] Categorize: Agent Frameworks, LLM Tools, Video/Media, Automation, Content

### 2.4 — Document AI Content Stack

- [✓] Write `resources/views/stack/index.blade.php`
  - End-to-end content pipeline: idea → published asset
  - Each step: tool used, skill reference, estimated time, output example
  - Flowchart diagram at top

---

## Phase 3 — CI & Quality Gates

> Add automated checks so the new code stays clean.

### 3.1 — Update GitHub Actions Workflow

- [✓] Edit `.github/workflows/deploy.yml` — add quality checks BEFORE deploy:

### 3.2 — Add Local Quality Scripts

- [✓] Add `composer lint` script to `composer.json`
- [✓] Create `tests/Feature/SkillLibraryTest.php` — smoke test

### 3.3 — SEO/AEO Validation

- [✓] Ensure all library pages have canonical URLs
- [✓] Add `CollectionPage` schema for `/library`
- [✓] Add `TechArticle` schema for each skill page
- [✓] Add `ItemList` schema for `/repos`
- [✓] Add library pages to `llms.txt`
- [✓] Add library pages to sitemap (`SitemapController`)

---

## Phase 4 — Growth & Analytics

> Add metrics tracking and engagement loops.

### 4.1 — GitHub Integration

- [✓] Add GitHub star count badge on skill cards
- [✓] Add "View on GitHub" button on every skill page

### 4.3 — Analytics Events

- [✓] Add data attributes for custom events:
  - `data-event="library-skill-view"` on skill cards
  - `data-event="blueprint-expand"` on diagram clicks
  - `data-event="repo-link-click"` on GitHub links
- [✓] Update `public/js/main.js` to push events to `dataLayer` for GA4

---

## Phase 5 — Community (Only if metrics hit targets)

> Only start this phase when:
> - [ ] 50+ GitHub stars across all published skills
> - [ ] 5+ people have asked "can I contribute?"
> - [ ] 3+ skills have been downloaded/used by others

---

## CI/CQ Checklist (Run Before Every Deploy)

```
[✓]  php -l app/Models/Skill.php                    # Syntax check
[✓]  php -l app/Http/Controllers/SkillController.php
[✓]  php -l database/migrations/*.php
[✓]  php artisan migrate --force --pretend           # Dry-run migrations
[✓]  php artisan route:list --path=library           # Routes registered
[✓]  php artisan route:list --path=blueprints
[✓]  php artisan route:list --path=repos
[✓]  Check all new views have @extends('layouts.app')
[✓]  Check all new views have section('content')
[✓]  Check all new pages render (visit /library, /blueprints, /repos, /stack)
```

---

## Progress Tracker

```
Phase 0 (Foundation):   [✓] 4/4 migrations · [✓] 4/4 models · [✓] 3/3 controllers · [✓] 4/4 seeders
Phase 1 (Views):        [✓] 5/5 skill views · [✓] 2/2 blueprint views · [✓] 1/1 repo views · [✓] 2/2 nav updates
Phase 2 (Content):      [✓] 5/5 skills sanitized · [✓] 3/3 blueprints · [✓] 20/20 repos curated · [✓] 1/1 stack doc
Phase 3 (CI):           [✓] 1/1 workflow update · [✓] 3/3 local scripts · [✓] 4/4 SEO checks
Phase 4 (Growth):       [✓] Analytics & GitHub hooks configured
Phase 5 (Community):    [ ] WAITING — metrics threshold trigger
```

---

*Last updated: August 2026. Run CI/CQ checklist before every deploy.*