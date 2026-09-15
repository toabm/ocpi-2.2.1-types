# Context: ocpi-2.2.1-types

Carried over from a Claude Code conversation in `ocpi-gateway` (Necture's NestJS OCPI gateway repo) on 2026-09-15. This file exists so a new Claude Code session opened here has the background without re-deriving it.

## Goal

Extract the OCPI 2.2.1 DTOs/types out of `ocpi-gateway` into a standalone, publishable npm package. Target audience: **anyone implementing the OCPI 2.2.1 protocol in TypeScript**, not just Necture — so this should work well as a general-purpose public package, not an internal-only artifact.

## What's here right now

`src/` was copied verbatim from `ocpi-gateway`'s `src/OCPI/v2.2.1/types/` (dtos, `custom_validators/`, `index.ts`, `utils.ts`, one spec file). Nothing else has been set up yet — no `package.json`, no `tsconfig`, no git init, no license.

## Key decisions made so far

- **Keep the class-validator decorators, don't strip to plain interfaces.** The DTOs are `class-validator`/`class-transformer` classes (used at runtime by `ocpi-gateway`'s `CustomValidationPipe`). Rather than reducing them to bare TS interfaces, ship them as-is with `class-validator` + `class-transformer` (+ `reflect-metadata`) as real `dependencies`. Both libraries work standalone (no NestJS required), so any consumer gets working runtime validation for free, not just type shapes — a feature for a public OCPI package, not baggage.
- **Only one NestJS coupling found**, already checked via grep across the whole folder: `src/custom_validators/ciString.ts` imports from `@nestjs/class-validator`, which is just NestJS's republish of plain `class-validator` (identical API). This needs a one-line import swap to `class-validator` — that's the only code change required before this is fully NestJS-free.
- **Separate repo, not a subfolder/workspace of `ocpi-gateway`** — public consumers shouldn't need the private gateway repo to get types.

## Next steps (not started yet)

1. Swap the `@nestjs/class-validator` import in `ciString.ts` → `class-validator`.
2. Add `package.json` (name `ocpi-2.2.1-types`, `class-validator`/`class-transformer`/`reflect-metadata` as dependencies), `tsconfig.json`, build script (`tsc` → `dist/` with `.d.ts`).
3. Pick a license (currently unset — the source in `ocpi-gateway` is `UNLICENSED`/private, so this needs a real OSS license, e.g. MIT, chosen deliberately before publishing).
4. `git init` here and set up a remote (not yet created).
5. Build, then `npm publish` (public registry — not yet decided: plain public npm name vs scoped).
6. Optional follow-up back in `ocpi-gateway`: replace its local `src/OCPI/v2.2.1/types` with a dependency on this published package.

## Unrelated but same session: `ocpi-gateway` git remote cleanup

Not related to this package, but happened in the same conversation in case it resurfaces: `ocpi-gateway`'s `origin` remote (`necture-com/ocpi-gateway`) no longer works (company access); `personal` (`toabm/ocpi-gateway`) does. Commands given (not yet confirmed executed by the user):

```bash
git remote remove origin
git remote rename personal origin
git fetch origin
git branch --set-upstream-to=origin/develop develop
```
