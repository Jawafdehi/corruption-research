import { i18n, toDevanagariDigits } from "react-i18next";

/**
 * In Nepali mode, every figure on a report page reads in Devanagari digits.
 *
 * Most figures already go through `t()` or `useFormat()`, which convert them. This is the
 * safety net for the rest — chart ticks and bar labels drawn by the chart library, table
 * cells and list numbers rendered straight from data — so a Nepali reader never meets
 * "2075/76" beside "२०७५/७६". It rewrites text nodes only, and leaves alone anything a
 * reader would copy exactly as written: text inside `lang="en"` (the English report),
 * code, form fields, and the licence name.
 */
const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT"]);
const KEEP = /CC BY|github\.com|https?:\/\//;

function convertible(node: Text): boolean {
  if (!/[0-9]/.test(node.data) || KEEP.test(node.data)) return false;
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP.has(el.tagName)) return false;
    const lang = el.getAttribute("lang");
    if (lang) return lang === "ne";
  }
  return false;
}

// What each converted node said before, so switching back to English restores the text
// React will not re-render (anything that does not depend on the language).
const original = new Map<Text, { from: string; to: string }>();

function convertNode(t: Text) {
  if (!convertible(t)) return;
  const to = toDevanagariDigits(t.data);
  original.set(t, { from: t.data, to });
  t.data = to;
}

function convert(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return convertNode(root as Text);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const found: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) found.push(n as Text);
  found.forEach(convertNode);
}

function restore() {
  original.forEach(({ from, to }, t) => {
    if (t.isConnected && t.data === to) t.data = from;
  });
  original.clear();
}

export function startNepaliDigits(root: HTMLElement) {
  const observer = new MutationObserver((records) => {
    if (i18n.language !== "ne") return;
    for (const r of records) {
      if (r.type === "characterData") convert(r.target);
      else r.addedNodes.forEach(convert);
    }
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  if (i18n.language === "ne") convert(root);

  // The language toggle sets <html lang>; follow it both ways.
  new MutationObserver(() => {
    if (i18n.language === "ne") convert(root);
    else restore();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}
