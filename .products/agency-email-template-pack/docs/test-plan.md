# Test Plan — Agency Email Template Pack

## Scope

Verify that the shipped pack is complete, renders without external dependencies, passes compliance checks, contains no secrets, and can be reproduced from the builder.

## Test environment

| Item | Value |
| --- | --- |
| OS | macOS (darwin) |
| Node.js | 25.9.0 |
| Package manager | None (zero dependencies) |
| Browser | Google Chrome (for manual spot checks) |

## Test cases

| ID | Test | Method | Expected |
| --- | --- | --- | --- |
| T01 | Required assets present | `validate-template-pack.mjs` | 8 HTML + 8 copy + support assets |
| T02 | HTML rendering structure | Validator regex checks | All 12 checks pass per template |
| T03 | Spam phrase scan | Validator | Zero high-risk phrases |
| T04 | Reference campaign audit | Internal campaign audit | All campaign assets and checks pass |
| T05 | Secret scan | Validator | Zero secrets |
| T06 | Developer path scan | Validator | Zero absolute paths in shipped assets |
| T07 | Builder reproducibility | `build-templates.mjs` | 8 files generated |
| T08 | Test suite | `tests/template-pack.test.mjs` | Exit 0 |
| T09 | Distribution ZIP | Packaging step | Contains templates, docs, skill, scripts; excludes tests and metadata |
| T10 | License and listing accuracy | Manual review | Claims match shipped assets |

## Out of scope

- Live ESP delivery tests.
- Inbox placement across every client version.
- Legal review for a specific jurisdiction.
- Open, reply, or conversion rate claims.

## Pass criteria

All automated tests exit 0. The only acceptable warnings are non-blocking packaging notes. No errors are permitted for release.
