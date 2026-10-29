# Research dossier — UGC Ad Studio

Date: 2026-10-29 · Author: Deepak Bagada Systems · Status: build research, not a paid-ad audit

This dossier records what was checked, what was assumed, and what still needs owner verification. It deliberately does **not** invent ad-library longevity, revenue, conversion rates or competitor sales.

---

## 1. The job to be done

A brand with a product and a small budget needs a **testable creative batch**, not one hero video. The batch must be:

1. varied enough that the test means something (different angles, not six colour swaps);
2. consistent enough that the viewer believes it is one brand (same creator, product label and grade);
3. fast enough to ship before the offer changes;
4. safe enough to survive platform review and an ASCI-style claim check;
5. cheap enough that a ₹30,000–₹1,00,000 test is not eaten by production.

The gap is not "can AI make a clip". The gap is **creative operations**: angle selection, hook discipline, prompt consistency, claim safety, disclosure and pre-spend QA. That is the job this product takes.

---

## 2. What the tool market looks like (verified 2026-10-29)

| Fact | Detail | Source |
| --- | --- | --- |
| Veo 3.1 clip length | 8 seconds maximum per generation; longer ads need chaining | Google Cloud / Gemini API docs |
| Veo 3.1 output | 720p / 1080p / 4K; native audio; text or image input | Google Cloud pricing + model docs |
| Veo 3.1 price band | Roughly $0.05–$0.10 (Lite), $0.10–$0.12 (Fast), $0.40 (Standard, video + audio) per generation at 720p/1080p | Google Cloud pricing, 2026-10-29 |
| Flow consumer plans | Google AI Pro $19.99/mo with 1,000 Flow credits; Ultra tiers at $99.99/$199.99 | Google One / Flow coverage, 2026-10 |
| Veo preview endpoint churn | `veo-3.1-*-preview` Gemini API endpoints were scheduled for shutdown on 2026-10-22; Google points to GA / Gemini Omni Flash | Google AI developer docs |
| HeyGen entry price | From $29/mo (Creator, 600 credits); 30s avatar ad roughly $1.16 (Avatar V) or $0.39 (Avatar IV) in credits | HeyGen-adjacent 2026 pricing coverage |
| HeyGen policy risk | HeyGen's own 2026 guidance bans presenting an AI actor as a real customer describing a real experience | HeyGen blog, 2026-10-07 |
| AI UGC cost band | A 30-second AI UGC ad is commonly quoted between about $1 and $12 in tool credits, depending on tool and avatar tier | 2026 tool comparison round-ups |
| Human creator comparison | Traditional creator production is materially more expensive and slower; exact rates vary by niche and usage rights | Industry coverage; verify per market |

**Interpretation.** Generation cost is no longer the bottleneck. The bottleneck is the system around the generation: which six angles, what hook, how to keep the product label stable, what the script may claim, and whether the pack is safe to run. That is where a skill product earns its price.

**What this does not prove.** It does not prove that any specific competitor is profitable, that a particular ad angle will convert for the buyer, or that a given tool will approve a given script. Those are owner-side tests.

---

## 3. Demand signals (qualitative)

- **Tool vendors are selling the same workflow.** HeyGen, Arcads, Creatify, AdMakeAI and others now market "UGC ads at scale" directly. That is evidence of buyer intent, not evidence of our conversion.
- **Every tool stops at the render.** They generate a clip or an avatar. They do not produce a six-angle test plan, a claims ledger, a locked consistency spec, a creator brief and a pre-spend audit in one pack.
- **Compliance is getting stricter.** Platform AI-disclosure rules and India's ASCI guidance both push toward labelled synthetic presenters and substantiated claims. A pack that ships without disclosure is a refund and a rejected ad waiting to happen.
- **Agencies need repeatability.** A freelancer can improvise one ad. An agency needs the same output every time, with a score a client can see. Deterministic QA is the product.
- **Prompt drift is the common failure.** The same creator and the same product label drift between scenes unless the blocks are repeated verbatim and checked. Most prompt packs do not check.

**Assumption to test:** buyers will pay ₹2,999–₹14,999 for a one-time system rather than another $29–$110/month tool, because it works with the tools they already pay for and it removes the strategy/QA labour. The first 100 sales will validate or falsify this.

---

## 4. Competitive gap

| Existing option | What it gives | What it misses |
| --- | --- | --- |
| Generic prompt packs | A list of prompt ideas | No locked consistency blocks, no audit, no claims ledger |
| AI UGC tools (HeyGen, Arcads, Creatify) | A rendered clip or avatar | No angle system, no static + video pack, no pre-spend QA |
| Freelance UGC creators | Authentic footage | Slow, expensive, inconsistent, hard to iterate six angles |
| Ad agencies | Strategy + production | Slow and priced for larger budgets |
| Copy-only ad audits | A score and rewrites | No video/image prompts, no avatar script, no production hand-off |

The product sits between strategy and generation: it produces the **production spec** that any tool, creator or editor can execute, and it refuses to let an unsafe pack through.

---

## 5. Buyer segments and willingness to pay

| Segment | Trigger | Budget signal | Fit |
| --- | --- | --- | --- |
| D2C founder (₹5–50L/month revenue) | Launch or creative fatigue | Already spending on Meta/TikTok | Solo tier |
| Performance marketer / media buyer | Needs six angles this week | Client retainer | Pro tier |
| Small UGC / creative agency | Wants repeatable delivery and QA | Client accounts | Agency tier |
| Solo creator / consultant | Wants a productised ad service | Personal brand | Solo tier |
| SaaS founder | Wants founder-led or avatar ads | Low production budget | Pro tier |

**Price hypothesis:** Solo ₹2,999, Pro ₹6,999, Agency ₹14,999; launch ₹1,999 for the first 100 Solo buyers. This is a positioning hypothesis, not tested market data. It is set above the existing copy-audit products because it delivers a full production pack, and below a single agency creative retainer.

---

## 6. Product decisions driven by the research

1. **Video + image + avatar in one pack.** Buyers do not want three separate purchases; they want one campaign.
2. **Two runtimes (30s + 15s) from one build.** Platform auctions reward shorter cutdowns; the audit checks both.
3. **Locked blocks + programmatic verification.** The audit fails a scene that drops the character, product or grade block. This is the core quality moat.
4. **Claims ledger + sanitisation.** Blocked claims are rewritten as mechanism language and recorded, not silently passed through.
5. **AI/paid disclosure is mandatory for UGC styles.** HeyGen's own policy makes this non-negotiable for synthetic presenters.
6. **Model routing instead of model lock-in.** The pack works with Veo 3.1 / Flow, Kling, Runway, Hailuo, Luma, PixVerse, HeyGen and the major image models.
7. **No API calls.** Copy-paste prompts work on consumer plans and do not break when an endpoint is deprecated (as Veo 3.1 preview endpoints were in October 2026).

---

## 7. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Model capability changes or endpoints retire | Prompts are plain text; model routing is documented and swappable |
| Platform policy changes | Compliance section is a checklist, not a legal guarantee; the audit catches deterministic risks |
| Buyer supplies false proof | Claims ledger marks every proof as buyer-provided; `verifiedProof` is opt-in |
| AI actor presented as a real customer | Explicit HeyGen warning; first-person scripts must be labelled AI-generated and framed as spokesperson content |
| Prompt drift | Verbatim blocks + audit failure |
| Pack looks like generic AI slop | UGC realism rails, anti-fluff list, one-shootable-action rule |
| Price too high for Indian SMB | Launch tier at ₹1,999; the pack replaces a multi-deliverable production brief |

---

## 8. What still needs owner verification before publishing

- [ ] Run a paid-ad library check on Meta and Google for current UGC/creative-tool ads and record dates. This build did not perform that check.
- [ ] Confirm current Veo 3.1 / Flow, HeyGen and image-model pricing in the owner's accounts; the figures above are dated public references.
- [ ] Confirm the refund terms and GST treatment with a CA.
- [ ] Test one full pack end-to-end with a real brand and a real generation tool; record render time and cost per usable clip.
- [ ] Have a human review the sample claims and the HeyGen disclosure guidance.
- [ ] Replace the fictional "Nara" sample with a buyer-approved case study or keep it clearly labelled as a demo.

---

## 9. Sources

- Google Cloud, Veo 3.1 pricing and model documentation (accessed 2026-10-29).
- Google AI for Developers, Veo 3.1 model page and deprecation notice (updated 2026-10-22).
- Google One / Flow plan coverage, October 2026.
- HeyGen, "Best AI Avatar Tools for UGC Ads (2026)" (updated 2026-10-20) and UGC ads product pages.
- 2026 tool comparison round-ups covering 30-second AI UGC ad costs (AdMakeAI, 2026-10-15; NemoVideo; agent-media comparison, 2026-10-18).
- Deepak Bagada Systems internal pricing sheet for creator-revenue products (2026-10-20).

All third-party figures are dated references, not guarantees. Re-check before quoting them in a listing or a client proposal.
