# Research dossier — MCP Server Launch Kit

Access date: **2026-10-18**. Policy: `.agent/config/research-policy.md`.

## 1. Opportunity

MCP servers are becoming the distribution layer for agent capabilities, but most published servers are free, fast-built, and unreviewed. The gap is not "another server" — it is **a launch path that produces a protocol-correct, validated, reviewable server and a security gate before publishing**.

## 2. Paid-ad verification — attempted, not achieved

| Source | Attempt | Result |
| --- | --- | --- |
| Meta Ad Library | Automated active-ad search for "MCP server" | HTTP 403 client challenge |
| Google Ads Transparency Center | Automated query for "mcp" | No extractable ad rows (JS application) |

**No ad-longevity claim is made.** The product does not claim paid advertisers are spending in this category.

## 3. Verified market anchors

| Source | Observation | Date | Type |
| --- | --- | --- | --- |
| `authority.md/guides/best-places-to-buy-claude-skills` | "Most individual skills are $29"; MCP servers are described as mostly free and open-source | 2026-09-22 | Direct (page + snippet) |
| `agensi.io/claude-marketplace` | Security-scanned listings with paid tiers (e.g. $29.99 suite); marketplace claims 11,500+ skills | Accessed 2026-10-18 | Direct |
| `implo.ai` | AI agent templates sell at $49–$149 | 2026-03-24 | Direct (snippet) |
| `mcpmarket.com`, `awesomeskill.ai` | Large free MCP/skill directories exist | Accessed 2026-10-18 | Direct (listings) |

**Interpretation (hypothesis):** free servers create a discoverability problem and a trust problem. Buyers will pay for **certification, schemas, and a release gate**, not for another free server. Price band **$79–$199**.

## 4. Demand signals

| Signal | Type | Relevance |
| --- | --- | --- |
| Marketplaces advertise "8-point security scan" for skills | Direct | Security review is already a purchase criterion |
| Vendor guidance on MCP security and least privilege | Direct (category docs) | Buyers are told to review servers, but lack tooling |
| Growth of free MCP directories | Direct | Supply is abundant; trust is scarce |
| Agencies publishing MCP servers for clients | Indirect | Repeatable launch path has commercial value |

No sales volume, revenue, or customer count is claimed for any competitor.

## 5. Buyer

| Persona | Pain | Willingness to pay |
| --- | --- | --- |
| Developer shipping an MCP server | Wants protocol correctness without reading the spec | $79–$149 |
| Agency delivering MCP integrations | Needs a repeatable security gate before client handoff | $199–$299 |
| Platform team approving internal servers | Needs an auditable checklist and CI gate | $199+ |

## 6. Competitive gaps

| Alternative | Gap |
| --- | --- |
| Official SDK | Solves protocol, not spec validation, security review, or release gating |
| Free server directories | Distribution, not certification |
| Generic code scanners (Semgrep, etc.) | No MCP semantics: tool schemas, destructive naming, `tools/list` contracts |
| Templates on GitHub | No gate, no smoke test, no report |

## 7. Positioning

> "Anyone can publish an MCP server. Very few can show a protocol smoke test, a validated tool contract, and a zero-blocker security gate."

Testable claim on the shipped examples: the scaffolded server passes a real stdio protocol test with **0 findings / 100**; the insecure example yields **7 findings / 38** and fails the gate.

## 8. Confidence and next experiment

| Claim | Confidence | Basis |
| --- | --- | --- |
| Security review is a purchase criterion | Medium-high | Marketplaces sell security scanning as a feature |
| Buyers pay $79+ for a launch kit | Medium | Adjacent skill prices ($29) and template prices ($49–$149) |
| Free alternatives limit willingness to pay | Medium | MCP servers described as mostly free |
| Paid ads are profitable here | **Unverified** | Ad Library inaccessible |

Cheapest experiment: publish the audit script as a free "MCP server security check" and count audits run in 14 days. Under 100 → the certification angle needs a stronger proof, such as a public scan of popular servers.
