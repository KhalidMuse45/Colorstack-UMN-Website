# Restoring the motion components

The nine `.jsx` sources in this folder ship with a trailing `.txt` so the design
system's compiler does not treat these handoff copies as a second set of
components. Strip the suffix on arrival:

```bash
cd components/motion
for f in *.jsx.txt; do mv "$f" "${f%.txt}"; done
```

Then copy the folder into your source tree (e.g. `src/components/motion/`).

`types.d.ts` holds the prop declarations for all nine, already correctly named.
Keep it beside the `.jsx` files; TypeScript will pick it up. If you prefer one
`.d.ts` per component, split it — the interfaces are separated by comment rules.

These are plain React. No imports beyond `react`, no Tailwind, no `motion`
package, no build-step assumptions.
