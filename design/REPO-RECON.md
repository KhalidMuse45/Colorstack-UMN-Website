# REPO-RECON.md — Run this before delegating anything

Goal: replace assumptions about the existing colorstackumn.org codebase with facts, in one pass, and write the result to `RECON.md`. Budget: one agent, read-only, no writes outside `RECON.md`.

## 1. Connect the source
If the repo isn't local yet, get it — clone the chapter's repo or point the orchestrator at the GitHub remote. Record `repo`, `branch`, and the HEAD commit sha in `RECON.md`. Do not rebuild from memory of the live site; read the source.

## 2. Answer these, with file paths as evidence

**Stack**
- Framework and version (`package.json`, lockfile, config files)? Static or server-rendered?
- Build tool, Node version, package manager. Any CI (`.github/workflows/`)?
- Where does it deploy? (`vercel.json`, `netlify.toml`, `CNAME`, Pages workflow)

**Styling reality**
- Tailwind, CSS modules, styled-components, or plain CSS? Config file path.
- Every hex value currently in the codebase → list them. Which map to `tokens/colors.css`, which are strays?
- Every font family referenced → list them. Anything beyond Archivo / Lora / IBM Plex Mono / iCiel Gotham is a deletion candidate.
- Existing global reset / base layer that will fight the tokens?

**Content**
- Where does content live now — hardcoded JSX, markdown, a CMS, a Google Sheet? Is anything fetched at runtime?
- Existing events / newsletter / team / jobs data: what shape, how stale, is it salvageable into `content/*.json`?
- Which images exist in-repo and at what resolution? Which are hotlinked from elsewhere?

**Routes**
- Enumerate every current route and its file. Mark each: **keep** / **redesign** / **merge** / **delete**.
- Any inbound links or QR codes pointing at URLs we'd break? Redirects needed?

**Integrations**
- Mailing-list form: what endpoint, what provider, does it still work?
- Analytics, Discord/Slack invites, Linktree, calendar embeds — list and verify each one resolves.
- Any hardcoded secrets or keys in the repo (report location only, never echo the value).

**Debt worth knowing**
- Dead files, unused deps, duplicated components.
- Accessibility violations already present (missing alt, `outline: none`, contrast failures).
- Anything load-bearing but undocumented.

## 3. Output format — `RECON.md`

```md
# Recon: colorstackumn.org
repo / branch / commit / date

## Verdict
2–4 sentences: incremental redesign or clean rebuild, and why.

## Stack
| thing | value | evidence (path) |

## Route inventory
| route | file | keep / redesign / merge / delete | note |

## Color audit
| hex found | count | maps to token | action |

## Font audit
| family | where used | action |

## Content sources
| content type | current home | target file | salvageable? |

## Integrations
| service | status | evidence |

## Reuse list
Files worth keeping verbatim.

## Delete list
Files to remove, with reason.

## Blocked / needs human
Bullets. Missing assets, credentials, decisions.
```

## 4. Rules
- Read-only. The only file you write is `RECON.md`.
- Every claim carries a path. "The site uses Tailwind" without `tailwind.config.js` is not a finding.
- No refactoring, no "while I was in there." Recon only.
- If the repo is large, prefer name-pattern search and targeted reads over listing the whole tree.

## 5. After recon
The orchestrator reads `RECON.md`, reconciles it against `UX-SPEC.md` §10, and only then writes the slice plan. If recon says "clean rebuild," scaffold fresh and cherry-pick from the reuse list — do not renovate around dead code.
