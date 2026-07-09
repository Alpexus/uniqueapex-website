/* ============================================================================
   wheelSvg.js — v3 FINAL (renderer)
   Save over the old wheelSvg.js — same location, same import path.
   ----------------------------------------------------------------------------
   · STRENGTHS MODE IS REAL: reads dm.strength (its own score) — never
     100 − needs again.
   · RINGS COME FROM THE SHARED BAND TABLE: petal, badge and bars agree by
     construction; any nonzero score shows at least one ring.
   · CURATED HUES: Communication is brand violet; no pure alarm-red.
   · SELECTION: generateWheelSVG(scored, mode, selectedDomain) outlines the
     chosen petal in violet and dims the rest. Omit the 3rd argument →
     behaves exactly like before (backwards compatible).
   · ACCESSIBLE: every petal is a focusable group with an aria-label and a
     data-domain attribute for click wiring:
       container.querySelectorAll("[data-domain]").forEach(g =>
         g.addEventListener("click", () => selectDomain(g.dataset.domain)));
   · confidenceBadge(conf, answered, total) — counts add a tooltip;
     old 1-argument calls still work.
   ============================================================================ */
import { DOMAINS, HUES, scoreToBand } from "../config/wheelConfig.js";

export function generateWheelSVG(scored, mode, selectedDomain) {
  var cx = 240, cy = 210, r0 = 24, R = 130, rings = 5, n = DOMAINS.length;
  var step = (R - r0) / rings, seg = (2 * Math.PI) / n;
  var strengths = mode === "strengths";
  var shortLabels = {
    "Communication": "Communication", "Social Connection": "Social",
    "Sensory Processing": "Sensory", "Flexibility & Transitions": "Flexibility",
    "Emotional Regulation": "Emotional", "Executive Function": "Executive",
    "Daily Living Skills": "Daily living", "Learning & Play": "Learning & play",
  };
  function pt(r, a) { return [(cx + r * Math.cos(a)).toFixed(2), (cy + r * Math.sin(a)).toFixed(2)]; }
  function sector(ir, or_, a0, a1) {
    var p0 = pt(ir, a0), p1 = pt(or_, a0), p2 = pt(or_, a1), p3 = pt(ir, a1);
    return "M" + p0[0] + "," + p0[1] + " L" + p1[0] + "," + p1[1] +
      " A" + or_ + "," + or_ + " 0 0 1 " + p2[0] + "," + p2[1] +
      " L" + p3[0] + "," + p3[1] + " A" + ir + "," + ir + " 0 0 0 " + p0[0] + "," + p0[1] + " Z";
  }

  var svg = "";
  for (var i = 0; i < n; i++) {
    var name = DOMAINS[i];
    var a0 = -Math.PI / 2 + i * seg, a1 = a0 + seg;
    var dm = scored[name] || { score: null, strength: null };
    var hue = HUES[i];

    var raw = strengths ? dm.strength : dm.score;
    var hasData = raw != null;

    var filled = 0;
    if (hasData) {
      var band = scoreToBand(raw, strengths ? "strength" : "need");
      filled = raw === 0 ? 0 : band.rings;
    }

    var selected = selectedDomain && selectedDomain === name;
    var dimmed = selectedDomain && !selected;
    var conf = strengths ? dm.strengthConfidence : dm.confidence;
    var label = hasData
      ? shortLabels[name] + " — " + (strengths ? "strength" : "support level") + " " + filled + " of 5" + (conf ? ", " + conf + " confidence" : "")
      : shortLabels[name] + " — not enough answers yet";

    svg += '<g data-domain="' + name + '" role="button" tabindex="0" aria-label="' + label + '"' +
      (dimmed ? ' opacity="0.4"' : "") + ' style="cursor:pointer">';
    for (var j = 1; j <= rings; j++) {
      var ir = r0 + (j - 1) * step, or_ = r0 + j * step;
      var fill = hasData && j <= filled
        ? "hsl(" + hue + ",70%," + (89 - j * 11) + "%)"
        : (hasData ? "#eef2f7" : "#f1f5f9");
      svg += '<path d="' + sector(ir, or_, a0, a1) + '" fill="' + fill + '" stroke="#fff" stroke-width="1.5"/>';
    }
    if (selected) {
      svg += '<path d="' + sector(r0, R, a0, a1) + '" fill="none" stroke="#6D28D9" stroke-width="2.5"/>';
    }
    svg += "</g>";

    var mid = a0 + seg / 2, lp = pt(R + 13, mid);
    var anchor = Math.cos(mid) > 0.25 ? "start" : (Math.cos(mid) < -0.25 ? "end" : "middle");
    svg += '<text x="' + lp[0] + '" y="' + lp[1] + '" font-size="10" fill="#475569" text-anchor="' + anchor + '" dominant-baseline="middle"' +
      (dimmed ? ' opacity="0.5"' : "") + ">" + shortLabels[name] + "</text>";
  }
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" fill="#fff" stroke="#e2e8f0"/>';
  return '<svg viewBox="0 0 480 420" width="100%" style="max-width:420px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" role="img">' +
    "<title>" + (strengths ? "Strengths wheel" : "Support needs wheel") + "</title>" + svg + "</svg>";
}

/* Domain identity color for dots/labels elsewhere — always matches the petal */
export function domainColor(name) {
  var i = DOMAINS.indexOf(name);
  return i === -1 ? "#6D28D9" : "hsl(" + HUES[i] + ",70%,45%)";
}

export function confidenceBadge(conf, answered, total) {
  var map = {
    high: ["High", "#16a34a", "#dcfce7"], medium: ["Medium", "#b45309", "#fef3c7"],
    low: ["Low", "#64748b", "#f1f5f9"], none: ["No data", "#94a3b8", "#f8fafc"],
  };
  var m = map[conf] || map.none;
  var title = typeof answered === "number" && typeof total === "number"
    ? ' title="Based on ' + answered + " of " + total + ' related questions"'
    : "";
  return '<span' + title + ' style="font-size:11px;font-weight:600;color:' + m[1] + ";background:" + m[2] + ';padding:2px 8px;border-radius:9999px">' + m[0] + "</span>";
}