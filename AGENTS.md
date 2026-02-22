# AGENTS

## Purpose
This file defines repo-specific working rules for AI coding sessions in this project.

## Session Start Order
Read these files in order before making code changes:
1. `AGENTS.md`
2. `AI_CONTEXT.md`
3. `README.md`
4. `docs/architecture.md`

## Expected Workflow Per Session
1. Summarize architecture, constraints, and open risks.
2. Propose a 3-6 step plan.
3. Implement changes.
4. Verify with:
   - `npm run lint`
   - `npm run build`

## Project Constraints
- Keep Swedish UI copy unless a task explicitly asks for another language.
- Keep currency and formatting consistent with `sv-SE` and `SEK`.
- Do not break product data contracts (`id`, `slug`, `images`, pricing fields).
- Cart identity is the tuple (`productId`, `selectedVariant`).
- `orders` and `account` are currently mock/demo pages.
- Analytics in `lib/analytics.ts` is currently a placeholder.

## Coding Preferences
- Keep business logic in `lib/` and `store/`, not in large JSX branches.
- Prefer server components; add `"use client"` only when needed.
- Keep TypeScript strict and avoid `any`.
- Preserve existing visual language (layout, spacing, typography, colors) unless redesign is requested.

## Documentation Rule
If architectural assumptions change, update both:
- `docs/architecture.md`
- `AI_CONTEXT.md`
