# Project Rules (Non-Negotiable)

> Tell the AI: "Read RULES.md" at the start of any session.

## Writing & Copy

1. **NEVER use em dashes (—).** Not in UI copy, not in emails, not in docs, not anywhere users will read it. This rule is non-negotiable.
   - Acceptable substitutes: comma, period, colon, parentheses, "and", or a line break.
   - This applies to ALL transactional emails, auth emails, page copy, button text, toasts, modals, confirmations, signoffs, footers — everything.
   - When rewriting any user-facing string, scan for `—` and remove it.

## How to enforce
- Before shipping any text change, grep for the em dash character `—` and fix every occurrence.
- If unsure how to rephrase, prefer a period and a new sentence over a dash.
