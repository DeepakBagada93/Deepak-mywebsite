const IMAGE_NEGATIVE =
  "extra fingers, distorted hands, illegible UI, warped text, neon cyberpunk, stock-photo smile, floating UI elements, logos, watermarks, low resolution, oversaturated colors, plastic skin, duplicate objects";

function vars(brief) {
  const offer = brief.offer ?? {};
  const c = brief.creative ?? {};
  const creator = c.creator ?? {};
  return {
    tool: c.tool ?? "n8n",
    failure: c.failure ?? "silent workflow failures",
    checks: c.checks ?? "12-point production audit",
    checkCount: c.check_count ?? "12",
    checkList: c.check_list ?? "Error handling. Retries. Backups. Alerts.",
    palette: c.palette ?? "charcoal, emerald green, warm paper white",
    workspace:
      c.workspace ??
      "a dark walnut desk with a laptop, a paper checklist, a brass pen and a half-finished coffee",
    price: Number(offer.price ?? 0),
    product: offer.product ?? "the product",
    promise: offer.promise ?? "",
    proof: (offer.proof ?? []).join("; "),
    creatorName: creator.name ?? "Riya",
    creatorAge: creator.age ?? 27,
    creatorLook:
      creator.look ??
      "shoulder-length dark hair, minimal makeup, small gold studs, mustard oversized t-shirt",
    creatorSetting:
      creator.setting ??
      "a bright home desk with a monstera plant, a white wall and a laptop just out of focus",
  };
}

export function characterBlock(brief) {
  const v = vars(brief);
  return `CHARACTER (keep identical across every clip): ${v.creatorName}, ${v.creatorAge}-year-old Indian woman, ${v.creatorLook}, seated at ${v.creatorSetting}. Natural skin texture, no beauty filter, no makeup shine.`;
}

const SHARED_CHARACTER = (v) =>
  `CHARACTER (keep identical across every clip): ${v.creatorName}, ${v.creatorAge}-year-old Indian woman, ${v.creatorLook}, seated at ${v.creatorSetting}. Natural skin texture, no beauty filter, no makeup shine.`;

export function singleImagePrompts(brief) {
  const v = vars(brief);
  return [
    {
      id: "IMG-1-Silent-Failure",
      title: "Silent failure split-screen",
      ratio: "4:5 (1080×1350)",
      use: "Cold prospecting — loss aversion",
      prompt: `Editorial tech photograph, vertical 4:5. Split-frame composition on ${v.workspace}. Left half: a laptop screen showing a tangled ${v.tool} automation workflow with one glowing red error node and a faint red spill across the desk. Right half: the same laptop screen clean and linear, every node a calm emerald check, soft green glow. A South Asian developer's hands rest on the keyboard, charcoal sleeves rolled. Soft window light from camera left, deep shadows, 50mm lens at f/2, shallow depth of field, ${v.palette} palette, subtle film grain, premium SaaS campaign. Clean negative space in the top third for a headline. No text, no logos, no watermark.`,
      overlay: "It didn't fail. It failed silently.",
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "IMG-2-Checklist",
      title: "The checklist artifact",
      ratio: "4:5 (1080×1350)",
      use: "Cold prospecting — value and specificity",
      prompt: `Top-down editorial flat lay, vertical 4:5. A thick tactile checklist card with 12 simple rows and hand-drawn check marks, nine in emerald ink and three circled in red, lying on a charcoal desk. Around it: the edge of a MacBook showing a clean ${v.tool} workflow, a brass mechanical pencil, a small printed architecture diagram, a black coffee and a tiny product card. Hard side light rakes across the paper texture, 100mm macro lens, shallow depth of field, ${v.palette} palette, fine grain, premium and restrained. Generous negative space in the top-left for a headline. No readable text, no logos, no watermark.`,
      overlay: `${v.checks}. 10 minutes. Zero 2AM calls.`,
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "IMG-3-Founder",
      title: "Founder at dusk (UGC still)",
      ratio: "4:5 (1080×1350)",
      use: "Warm prospecting + retargeting — trust",
      prompt: `Candid iPhone photograph, vertical 4:5. A South Asian male founder, 32, short beard, charcoal t-shirt, sits at a home desk at dusk. His laptop glows with a clean ${v.tool} dashboard, a notebook with a checklist in one hand. He looks into the camera with a tired, relieved half-smile. Warm desk lamp on the left, cool screen light on his face, lived-in desk with cables and a plant, slight handheld blur, 26mm phone lens at f/1.8, natural grain, authentic UGC, not a studio. Negative space on the right. No text, no logos, no watermark.`,
      overlay: "I don't ship n8n without this.",
      negative: IMAGE_NEGATIVE,
    },
  ];
}

export function carouselPrompts(brief) {
  const v = vars(brief);
  return [
    {
      id: "CAROUSEL-1",
      title: "Card 1 — Hook",
      ratio: "1:1 (1080×1080)",
      prompt: `Macro close-up of a laptop screen in a dark room, horizontal 1:1. A tangled ${v.tool} workflow with one glowing red error node dominates the frame, a faint red glow on a developer's fingertips at the edge. Shallow depth of field, 85mm lens, high contrast, ${v.palette} palette, cinematic but real, fine grain. Large clean dark area on the left for a headline. No readable UI text, no logos, no watermark.`,
      overlay: "It didn't fail. It failed silently.",
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "CAROUSEL-2",
      title: "Card 2 — Problem",
      ratio: "1:1 (1080×1080)",
      prompt: `Minimal 3D still life on a charcoal background, square 1:1. Three simple red-outlined symbols in a row: a broken loop, a muted bell and an empty folder. Soft studio shadows, emerald rim light, premium editorial product render, matte materials, shallow depth of field, ${v.palette} palette, lots of negative space above. No text, no logos, no watermark.`,
      overlay: "No retry. No alert. No backup.",
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "CAROUSEL-3",
      title: "Card 3 — Mechanism",
      ratio: "1:1 (1080×1080)",
      prompt: `Clean 3D grid of twelve embossed emerald check tiles on a charcoal background, square 1:1. One tile catches a soft studio highlight, paper-white numbers 1–12 subtly debossed, shallow depth of field, premium tech product render, ${v.palette} palette, precise and calm, generous negative space at the top. No text, no logos, no watermark.`,
      overlay: `The ${v.checks}.`,
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "CAROUSEL-4",
      title: "Card 4 — Proof",
      ratio: "1:1 (1080×1080)",
      prompt: `Over-the-shoulder photograph of a developer reviewing a printed checklist beside a laptop running a clean ${v.tool} workflow, square 1:1. Warm office light, client logo blurred beyond recognition, a red pen and three circled items on the paper, authentic documentary style, 35mm lens at f/2, ${v.palette} palette, fine grain. Clean negative space top-right. No readable text, no logos, no watermark.`,
      overlay: "Built from real client builds.",
      negative: IMAGE_NEGATIVE,
    },
    {
      id: "CAROUSEL-5",
      title: "Card 5 — Offer",
      ratio: "1:1 (1080×1080)",
      prompt: `Premium product still life, square 1:1. A dark hardcover checklist booklet with an emerald foil edge stands on a charcoal surface beside the edge of a MacBook and a small price card. Dramatic side light, soft reflection, 100mm macro, shallow depth of field, ${v.palette} palette, high-end and restrained. Generous negative space at the top and bottom. No text, no logos, no watermark.`,
      overlay: `Get the pack — ₹${v.price.toLocaleString("en-IN")}`,
      negative: IMAGE_NEGATIVE,
    },
  ];
}

export function ugcPrompts(brief) {
  const v = vars(brief);
  const dialogue1 = `I almost sent this ${v.tool} workflow to a client. Then I ran the ${v.checkCount} checks — and found three silent failures. Now I run this first.`;
  const dialogue2 = `My client's ${v.tool} workflow died at 2AM. No alert. No retry. Nothing. I rebuilt it with these ${v.checkCount} checks — and it hasn't dropped a run since.`;
  const dialogue3 = `Here's the ${v.checkCount}-point check I run before any ${v.tool} workflow goes live. ${v.checkList} That's the difference between a demo and production.`;
  const settings =
    "Vertical 9:16, 1080×1920, 10 seconds, 24fps, handheld iPhone front camera at eye level, natural window light from the left, authentic UGC, slight grain, room tone only — no music, no captions burned in, no on-screen text.";
  const negative = `${IMAGE_NEGATIVE}, studio lighting, cinematic teal-orange grade, multiple people, jump cuts, burned-in captions, background music, logo, product packaging`;

  return [
    {
      id: "VID-1-Confession",
      title: "Ad 1 — The confession",
      angle: "Loss aversion / founder confession",
      duration: "10s",
      dialogue:
        `I almost sent this ${v.tool} workflow to a client. Then I ran the ${v.checkCount} checks — and found three silent failures. Now I run this first.`,
      beats: [
        "0–3s: leans into lens, half-smile drops, direct eye contact — hook.",
        "3–7s: glances at laptop, back to lens, slight head shake on 'three silent failures'.",
        "7–10s: small nod, holds eye contact on the CTA line.",
      ],
      on_screen_text: ["3 silent failures", `${v.checkCount} checks →`, "Link below"],
      caption:
        "The workflow looked fine. It wasn't. 12 checks before every client handoff — link in bio.",
      prompt: `${settings} ${SHARED_CHARACTER(v)} She leans toward the lens and says: "${dialogue1}" Subtle keyboard click and room tone. Continuous single take, no cuts, no on-screen text, no captions, no logos. Negative: ${negative}.`,
      negative,
    },
    {
      id: "VID-2-Client-Story",
      title: "Ad 2 — The 2AM client story",
      angle: "Authority / client trust",
      duration: "10s",
      dialogue:
        `My client's ${v.tool} workflow died at 2AM. No alert. No retry. Nothing. I rebuilt it with these ${v.checkCount} checks — and it hasn't dropped a run since.`,
      beats: [
        "0–3s: tired expression, direct to camera — '2AM' lands hard.",
        "3–7s: counts three failures on her fingers: alert, retry, nothing.",
        "7–10s: relief, slight smile, confident nod on 'hasn't dropped a run since'.",
      ],
      on_screen_text: ["2AM. No alert.", "No retry.", `${v.checkCount} checks →`],
      caption:
        "A silent failure isn't a technical problem. It's a trust problem. Here's the audit I use now.",
      prompt: `${settings} ${SHARED_CHARACTER(v)} She looks tired, then says: "${dialogue2}" She counts three points on her fingers, then gives a small relieved nod. Soft room tone. Continuous single take, no cuts, no on-screen text, no captions, no logos. Negative: ${negative}.`,
      negative,
    },
    {
      id: "VID-3-12-Checks",
      title: "Ad 3 — The 12-check value drop",
      angle: "Specific value / curiosity",
      duration: "10s",
      dialogue:
        `Here's the ${v.checkCount}-point check I run before any ${v.tool} workflow goes live. ${v.checkList} That's the difference between a demo and production.`,
      beats: [
        "0–2s: holds up a printed checklist, eyebrow raise — curiosity.",
        "2–7s: taps four rows as she names error handling, retries, backups, alerts.",
        "7–10s: leans back, calm confidence on 'demo and production'.",
      ],
      on_screen_text: [`${v.checkCount} checks`, ...v.checkList.split(". ").filter(Boolean).map((x) => x.replace(/\.$/, ""))],
      caption:
        "Demo vs production is 12 checks. Steal the checklist — link in bio.",
      prompt: `${settings} ${SHARED_CHARACTER(v)} She holds up a printed checklist with simple tick marks and says: "${dialogue3}" She taps four rows on the paper as she speaks, then leans back with a calm nod. Paper rustle and room tone. Continuous single take, no cuts, no on-screen text, no captions, no logos. Negative: ${negative}.`,
      negative,
    },
  ];
}

export function veoNotes() {
  return [
    "Model: Veo 3.1 (or Flow / Kling / Runway with the same prompt).",
    "Aspect: 9:16 · resolution: 1080×1920 · duration: 10s · audio: on.",
    "Use a reference image of the creator and paste the CHARACTER block verbatim into every prompt.",
    "Lock the seed per ad so re-generations keep the same face and wardrobe.",
    "Generate 3 takes per prompt; keep the one with the most natural blink and mouth sync.",
    "Do not ask the model to render captions or logos — add on-screen text in CapCut/Premiere.",
    "Loudness-normalize dialogue to −14 LUFS; add captions in the editor, not in Veo.",
  ];
}
