/* ============================================================
   wheelSvg.js — petal wheel renderer (verbatim from account.astro)
   ------------------------------------------------------------
   generateWheelSVG(scored, mode) → string of <svg>… petals
     scored = output of scoreWheel(data)  ({name:{score,…}})
     mode   = "needs" | "strengths"
   confidenceBadge(conf) → pill markup
   Identical colors, rings and geometry to your original wheel.
   ============================================================ */
import { DOMAINS } from "../config/wheelConfig.js";

export function generateWheelSVG(scored, mode) {
  var cx = 240, cy = 210, r0 = 24, R = 130, rings = 5, n = DOMAINS.length;
  var step = (R - r0) / rings, seg = (2 * Math.PI) / n;
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
    var dm = scored[name] || { score: null };
    var hue = Math.round((i / n) * 360);
    var filled;
    if (dm.score == null) { filled = 0; }
    else { var v = mode === "strengths" ? 100 - dm.score : dm.score; filled = Math.round((v / 100) * rings); }
    for (var j = 1; j <= rings; j++) {
      var ir = r0 + (j - 1) * step, or_ = r0 + j * step;
      var fill = (dm.score != null && j <= filled) ? "hsl(" + hue + ",70%," + (84 - j * 9) + "%)" : (dm.score != null ? "#eef2f7" : "#f1f5f9");
      svg += '<path d="' + sector(ir, or_, a0, a1) + '" fill="' + fill + '" stroke="#fff" stroke-width="1.5"/>';
    }
    var mid = a0 + seg / 2, lp = pt(R + 13, mid);
    var anchor = Math.cos(mid) > 0.25 ? "start" : (Math.cos(mid) < -0.25 ? "end" : "middle");
    svg += '<text x="' + lp[0] + '" y="' + lp[1] + '" font-size="10" fill="#475569" text-anchor="' + anchor + '" dominant-baseline="middle">' + shortLabels[name] + "</text>";
  }
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" fill="#fff" stroke="#e2e8f0"/>';
  return '<svg viewBox="0 0 480 420" width="100%" style="max-width:420px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">' + svg + "</svg>";
}

export function confidenceBadge(conf) {
  var map = {
    high: ["High", "#16a34a", "#dcfce7"], medium: ["Medium", "#b45309", "#fef3c7"],
    low: ["Low", "#64748b", "#f1f5f9"], none: ["No data", "#94a3b8", "#f8fafc"],
  };
  var m = map[conf] || map.none;
  return '<span style="font-size:11px;font-weight:600;color:' + m[1] + ';background:' + m[2] + ';padding:2px 8px;border-radius:9999px">' + m[0] + "</span>";
}
