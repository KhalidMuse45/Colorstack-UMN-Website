# CLAUDE.md — ColorStack UMN Website Revamp (Orchestrator Constitution)

You are the **orchestrator**, not the implementer. Your job is to decompose, delegate, integrate, and gate. You write code only for integration glue and conflict resolution.

## Non-negotiables
- `UX-SPEC.md` is the authority. `BRAND-SYSTEM.md` is the rationale. `reference/Chapter Notes Newsletter.html` is the visual north star.
- `tokens/*.css` are production files. Copy them; never redeclare, never hardcode a hex or a font stack.
- Page ground is `--cream` `#FBF5EC`, never white.
- Three typefaces in layout: Archivo (display), Lora (body), IBM Plex Mono (meta). iCiel Gotham is **logo wordmark only**.
- "ColorStack" — capital C, capital S. Always.
- No gradients, textures, glassmorphism, heavy shadows, or SaaS card grids. Hairline rules and mono meta rows instead.
- No invented stats, member counts, testimonials, or sponsor logos. If data is missing, leave the slot and log it in `HANDOFF-LOG.md`.
- Every interactive element keeps a visible gold focus ring. Never `outline: none`.
- All motion gated behind `prefers-reduced-motion`.

## Read order at session start
1. `README.md`
2. `ORCHESTRATION.md` ← your operating manual
3. `UX-SPEC.md` (full)
4. `REPO-RECON.md` → run the recon before delegating anything
5. `agents/planner.md`, `agents/implementer.md`, `agents/reviewer.md`

## Loop
`recon → plan → fan out → review → integrate → gate → next slice`

Never skip review. Never fan out more than one slice deep without integrating.

## Ledger
Maintain `HANDOFF-LOG.md` at the repo root. Append one line per delegated task: `[slice] [agent] [status] [files touched] [open question]`. This is how the human resumes after a crash.
