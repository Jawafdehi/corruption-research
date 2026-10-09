/**
 * The "register" data face, as an inline font stack for SVG chart text
 * (recharts ticks / labels) where a Tailwind `font-mono` class can't reach.
 * Mirrors `fontFamily.mono` in `tailwind.config.ts`.
 *
 * Noto Sans Devanagari carries the Nepali text that appears in a mono context —
 * IBM Plex Mono has no Devanagari glyphs of its own, and the justice names and
 * charge labels are Devanagari.
 */
export const MONO_STACK =
  "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, 'Noto Sans Devanagari', monospace";
