# 03. Multi-Touch Cold Email Outbound Sequences

**Campaign Name**: {{CAMPAIGN_NAME}}  
**Target Persona**: {{TARGET_PERSONA}}  
**Core Offer / Value Mechanism**: {{CORE_MECHANISM}}  
**Format**: Plain-Text / Markdown (0 images, max 1 link in later steps)

---

## Step 1: The Context & Trigger Hook (Day 1)

### Subject Line Variants:
- **Variant A**: `quick question regarding {{company}}`
- **Variant B**: `idea for {{pain_point_keyword}}`
- **Variant C**: `{{first_name}} // {{trigger_event}}`

### Body Copy:
```text
Hi {{first_name|there}},

{{TRIGGER_OBSERVATION_FIRST_SENTENCE}}

Most {{JOB_TITLE_PLURAL}} I talk to mention that {{PAIN_POINT_BOTTLENECK}} often eats up {{HOURS_OR_EFFORT}} each week.

We built a lightweight {{MECHANISM_NAME}} that helped {{PEER_COMPANY}} {{QUANTIFIABLE_RESULT_METRIC}} in {{TIMEFRAME}}.

Worth a 2-minute glance at the workflow diagram?

Best,
{{SENDER_NAME}}
{{SENDER_TITLE}}
```

---

## Step 2: The Video Teardown / Asset Drop (Day 4 — Threaded Reply)

### Subject:
`Re: quick question regarding {{company}}` *(Sends inside the same email thread)*

### Body Copy:
```text
Hey {{first_name|there}},

Recorded a quick 90-second Loom showing exactly how we mapped this out for {{company}}'s current setup.

Mind if I drop the link over to you?

Best,
{{SENDER_NAME}}
```

---

## Step 3: The Quantified Peer Proof Case Study (Day 8 — Threaded Reply)

### Subject:
`Re: quick question regarding {{company}}`

### Body Copy:
```text
Hey {{first_name|there}},

Thought you might find this relevant—when {{SIMILAR_CLIENT_NAME}} ran into {{SPECIFIC_CHALLENGE}}, they were dealing with {{METRIC_BEFORE}}.

Instead of {{TRADITIONAL_COMPLICATED_FIX}}, we implemented {{CORE_MECHANISM}}:

• {{METRIC_IMPROVEMENT_1}}
• {{METRIC_IMPROVEMENT_2}}
• Zero disruption to {{EXISTING_SYSTEM}}

Happy to send over the 1-page PDF case breakdown if you're curious?

Best,
{{SENDER_NAME}}
```

---

## Step 4: The Contrarian Angle (Day 13 — Threaded Reply)

### Subject:
`Re: quick question regarding {{company}}`

### Body Copy:
```text
Hey {{first_name|there}},

Most teams in {{INDUSTRY}} assume that fixing {{PAIN_POINT}} requires {{EXPENSIVE_OLD_WAY}}.

In our experience, that usually just leads to {{NEGATIVE_SIDE_EFFECT}}.

We found that simply {{CONTRARIAN_LEVER}} produces 3x better results with a fraction of the overhead.

Open to seeing how this compares to your current roadmap?

Best,
{{SENDER_NAME}}
```

---

## Step 5: The Priority Shift / Polite Breakup (Day 18 — Threaded Reply)

### Subject:
`Re: quick question regarding {{company}}`

### Body Copy:
```text
Hey {{first_name|there}},

Guessing {{company}}'s hands are full with other priorities right now.

I'll step back and won't follow up again on this thread. If tackling {{PAIN_POINT}} ever moves up the list, feel free to reach back out anytime.

Wishing you and the team continued momentum.

Best,
{{SENDER_NAME}}
```

---

## Fallback Variables Dictionary
- `{{first_name|there}}`: First name of prospect; falls back to "there".
- `{{company|your team}}`: Company name; falls back to "your team".
- `{{trigger_observation}}`: Specific observable event (e.g., recent job post, product update).
