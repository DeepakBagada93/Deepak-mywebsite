# Nara Vitamin C Face Serum — UGC ad pack

Built by UGC Ad Studio · 6 angles · 30 video prompts · 24 image prompts · 30s runtime

## What is in this folder

| File | Use |
| --- | --- |
| `campaign.json` | The machine-readable pack. Feed this to `audit-ugc-pack.mjs`. |
| `prompts-video.md` | One copy-paste video prompt per scene, with negative and seed. |
| `prompts-image.md` | Static image prompts plus local edit prompts. |
| `heygen-pack.md` | Avatar scripts, voice direction and disclosure. |
| `scripts.md` | Hooks, beat sheets, shot lists and creator briefs. |
| `captions.md` | Platform-native captions per angle. |
| `compliance.md` | Claims ledger and publishing checklist. |

## Order of work

1. Read `scripts.md` and pick the two angles you will actually produce.
2. Generate the creator reference still, then the video scenes in `prompts-video.md`.
3. Generate clean plates in `prompts-image.md` and add text in the editor.
4. Record or render the avatar cut from `heygen-pack.md` if you want a second format.
5. Audit the pack: `node scripts/audit-ugc-pack.mjs campaign.json --md=audit.md`.
6. Fix every critical and high finding before spending money.
