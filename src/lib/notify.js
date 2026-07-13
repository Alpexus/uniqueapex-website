/* ============================================================
   notify.js — NOTIFY-V1: the app's active notification system.
   ------------------------------------------------------------
   Small, warm toasts (bottom-right) so the app TALKS to the
   family instead of silently changing state:
     · "Check-in saved — Growth updated ✦"
     · "Session refreshed — you're still signed in"
     · "Can't reach the server — retrying…"

   Usage anywhere in a bundled script:
     import { notify } from "../lib/notify.js";
     notify("ok", "Win saved ✦");
   Kinds: "ok" | "info" | "warn" | "err"
   Also available globally (for inline scripts):
     window.uaNotify("info", "…")
   Or via events: window.dispatchEvent(new CustomEvent("ua:toast",
     { detail: { kind: "ok", msg: "Saved" } }))
   Imported by ua-data.js, so every app page has it for free.
   ============================================================ */

const CSS = `
#ua-toasts{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;flex-direction:column;gap:9px;max-width:min(340px,calc(100vw - 36px));pointer-events:none}
.ua-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;background:#fff;border:1px solid #EAE7F3;border-left-width:4px;border-radius:14px;padding:11px 13px;box-shadow:0 10px 30px rgba(34,27,54,.14);font-family:'Inter',system-ui,sans-serif;animation:uaTIn .35s cubic-bezier(.22,1,.36,1) both}
.ua-toast.out{animation:uaTOut .25s ease both}
.ua-toast .ic{width:24px;height:24px;border-radius:46% 54% 58% 42%/52% 44% 56% 48%;display:grid;place-items:center;flex-shrink:0;font-size:12px;font-style:normal}
.ua-toast p{flex:1;font-size:.82rem;color:#221B36;line-height:1.45;margin:0;min-width:0}
.ua-toast button{border:none;background:none;color:#A9A3BC;font-size:1rem;line-height:1;cursor:pointer;padding:0 2px;flex-shrink:0;font-family:inherit}
.ua-toast button:hover{color:#221B36}
.ua-toast.ok{border-left-color:#0E8F66}.ua-toast.ok .ic{background:#E8F6F0;color:#0E8F66}
.ua-toast.info{border-left-color:#7C3AED}.ua-toast.info .ic{background:#EDE9FE;color:#6D28D9}
.ua-toast.warn{border-left-color:#D97706}.ua-toast.warn .ic{background:#FBF2E2;color:#A8650A}
.ua-toast.err{border-left-color:#B14A66}.ua-toast.err .ic{background:#F9EDF1;color:#B14A66}
@keyframes uaTIn{from{opacity:0;transform:translateX(20px) scale(.96)}to{opacity:1;transform:none}}
@keyframes uaTOut{to{opacity:0;transform:translateX(16px)}}
@media (prefers-reduced-motion:reduce){.ua-toast,.ua-toast.out{animation:none}}
`;

const ICONS = { ok: "✓", info: "✦", warn: "!", err: "!" };
let host = null;
const recent = new Map(); /* de-dupe identical toasts within 4s */

function ensureHost() {
  if (typeof document === "undefined") return null;
  if (host && document.body.contains(host)) return host;
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
  host = document.createElement("div");
  host.id = "ua-toasts";
  host.setAttribute("role", "status");
  host.setAttribute("aria-live", "polite");
  document.body.appendChild(host);
  return host;
}

export function notify(kind, msg, opts = {}) {
  const h = ensureHost();
  if (!h || !msg) return;
  const key = kind + "|" + msg;
  const now = Date.now();
  if (recent.has(key) && now - recent.get(key) < 4000) return;
  recent.set(key, now);

  while (h.children.length >= 4) h.removeChild(h.firstChild);
  const el = document.createElement("div");
  el.className = "ua-toast " + (ICONS[kind] ? kind : "info");
  const p = document.createElement("p");
  p.textContent = msg;
  const ic = document.createElement("i");
  ic.className = "ic";
  ic.textContent = ICONS[kind] || ICONS.info;
  const x = document.createElement("button");
  x.setAttribute("aria-label", "Dismiss");
  x.textContent = "×";
  el.appendChild(ic); el.appendChild(p); el.appendChild(x);
  h.appendChild(el);
  const close = () => {
    if (!el.parentNode) return;
    el.classList.add("out");
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
  };
  x.addEventListener("click", close);
  setTimeout(close, opts.ms || 4200);
  return close;
}

/* global + event hooks (inline scripts, layouts) */
if (typeof window !== "undefined") {
  window.uaNotify = notify;
  window.addEventListener("ua:toast", (e) => {
    const d = (e && e.detail) || {};
    notify(d.kind || "info", d.msg, d);
  });
}
