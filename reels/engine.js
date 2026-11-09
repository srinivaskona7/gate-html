/* ============================================================================
   GATE 2027 REEL ENGINE  —  canvas-only, pure-function-of-time renderer
   Shared by every section reel. No external requests. No DOM inside the video.
   ----------------------------------------------------------------------------
   A section file defines  window.REEL_META  and  window.REEL_SCENES  then calls
   window.buildReel().  Every size is a fraction of W so any format works.
   ========================================================================== */
(function (global) {
'use strict';

/* ---------- seeded PRNG (no Math.random: frames must be reproducible) ------ */
function rnd(seed) { var s = seed * 9301 + 49297; return (s % 233280) / 233280; }

/* ---------- easing --------------------------------------------------------- */
var E = {
  outCubic: function (t) { t = clamp01(t); return 1 - Math.pow(1 - t, 3); },
  outBack:  function (t) { t = clamp01(t); var c = 1.70158 + 1;
                           return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  inOut:    function (t) { t = clamp01(t); return t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; },
  outElastic: function (t) { t = clamp01(t); if (t === 0 || t === 1) return t;
                           var c = (2*Math.PI)/3;
                           return Math.pow(2, -10*t) * Math.sin((t*10 - .75)*c) + 1; }
};
function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
function lerp(a, b, t) { return a + (b - a) * clamp01(t); }

/* appear(local, at, len) -> 0..1 ; the universal stagger primitive */
function appear(local, at, len) { return clamp01((local - at) / (len || .55)); }

/* ---------- 48 stroke icons, 24x24 path data, drawn with Path2D ------------ */
var ICONS = {
  power:'M12 2v10M5.6 6.6a9 9 0 1012.8 0',
  cpu:'M6 6h12v12H6zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4',
  ram:'M3 8h18v8H3zM7 16v3M12 16v3M17 16v3',
  disk:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 9a3 3 0 100 6 3 3 0 000-6z',
  network:'M12 3v6M5 21v-4M19 21v-4M5 17h14M12 9l-7 8M12 9l7 8',
  lock:'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  shield:'M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z',
  gear:'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M4 12H1M23 12h-3M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2',
  terminal:'M3 4h18v16H3zM7 9l3 3-3 3M13 15h5',
  file:'M6 2h8l4 4v16H6zM14 2v4h4',
  folder:'M3 7h6l2 3h10v11H3z',
  box:'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  cloud:'M6 18a4 4 0 010-8 6 6 0 0111.5 2A3.5 3.5 0 0118 18z',
  server:'M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01',
  database:'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  user:'M12 11a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  clock:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v5l3 2',
  check:'M4 12l5 5L20 6',
  arrow:'M4 12h14M13 6l6 6-6 6',
  warn:'M12 3l9 17H3zM12 9v5M12 17h.01',
  bug:'M8 6h8v6a4 4 0 01-8 0zM4 10h4M16 10h4M5 16l3-2M19 16l-3-2M9 20l1-3M15 20l-1-3',
  key:'M15 3a6 6 0 100 12 6 6 0 000-12zM11 11L3 19v2h3v-3h3v-3',
  git:'M12 3v8M12 15v6M12 11a2 2 0 100 4 2 2 0 000-4zM12 7l6 4',
  layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  search:'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
  chart:'M4 20V8M10 20V4M16 20v-8M22 20h-20',
  heart:'M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0112 7a4.5 4.5 0 019 2.5c0 4-4 7.5-9 11.5z',
  comment:'M4 5h16v11H9l-5 4z',
  share:'M8 12l8-5M8 12l8 5M6 12a2 2 0 100 0zM18 7a2 2 0 100 0zM18 17a2 2 0 100 0z',
  bookmark:'M6 3h12v18l-6-5-6 5z',
  logic:'M4 7h5M4 17h5M9 4v16h4a6 6 0 000-16zM19 12h2',
  set:'M9 12a5 5 0 1110 0 5 5 0 01-10 0zM5 12a5 5 0 1110 0 5 5 0 01-10 0z',
  fn:'M5 19c4 0 3-14 7-14M4 12h9',
  graphnode:'M6 6a2.5 2.5 0 100 0zM18 6a2.5 2.5 0 100 0zM12 18a2.5 2.5 0 100 0zM7 7l10 0M7 8l4 8M17 8l-4 8',
  matrix:'M6 3v18M18 3v18M9 7h6M9 12h6M9 17h6',
  sigma:'M18 4H6l7 8-7 8h12',
  integral:'M9 20c3 0 2-16 6-16M7 18h2M15 6h2',
  limit:'M4 18V6M4 12h7M15 7l4 5-4 5',
  dice:'M4 4h16v16H4zM9 9h.01M15 15h.01M12 12h.01',
  bell:'M12 3a6 6 0 00-6 6v4l-2 3h16l-2-3V9a6 6 0 00-6-6zM10 19a2 2 0 004 0',
  tree:'M12 3v6M12 9L7 15M12 9l5 6M7 15v3M17 15v3M12 3a2 2 0 100 0zM7 15a2 2 0 100 0zM17 15a2 2 0 100 0z',
  lattice:'M12 3l6 5-6 5-6-5zM12 13l6 5-6 3-6-3z',
  grid:'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18',
  wave:'M3 12c3-6 6 6 9 0s6-6 9 0',
  target:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 11a1 1 0 100 2 1 1 0 000-2z',
  flask:'M9 3h6v5l4 11H5l4-11zM7 14h10',
  bolt:'M13 2L5 14h6l-1 8 8-12h-6z',
  book:'M4 4h7v16H4zM13 4h7v16h-7zM11 4v16',
  brain:'M9 4a3 3 0 00-3 3 3 3 0 000 6 3 3 0 003 3V4zM15 4a3 3 0 013 3 3 3 0 010 6 3 3 0 01-3 3V4z'
};
var PATHCACHE = {};
function iconPath(name) {
  if (!PATHCACHE[name]) PATHCACHE[name] = new Path2D(ICONS[name] || ICONS.box);
  return PATHCACHE[name];
}

/* ========================================================================== */
global.buildReel = function buildReel() {
  var META   = global.REEL_META;
  var SCENES = global.REEL_SCENES;

  var W = META.width, H = META.height, FPS = META.fps || 30;
  var WPS = 2.4;                       /* narration words per second          */

  /* ---- timeline: duration follows narration length ---------------------- */
  SCENES.forEach(function (s) {
    var words = (s.narration || '').trim().split(/\s+/).filter(Boolean).length;
    s.words = words;
    s.dur = Math.max(s.dur || 0, words / WPS + 1.2);
  });
  var starts = [], TOTAL = 0;
  SCENES.forEach(function (s) { starts.push(TOTAL); s.start = TOTAL; TOTAL += s.dur; });

  /* ---- drawing api ------------------------------------------------------ */
  function mk(ctx) {
    var u = W / 100;                                /* 1% of width           */
    function px(f) { return f * W; }

    function roundRect(x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function wrapText(text, x, y, maxW, lh, align) {
      ctx.textAlign = align || 'left';
      var words = String(text).split(' '), line = '', lines = [];
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
        else line = test;
      }
      if (line) lines.push(line);
      lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
      return lines.length;
    }

    function drawIcon(name, x, y, size, color, lw) {
      ctx.save();
      ctx.translate(x - size / 2, y - size / 2);
      ctx.scale(size / 24, size / 24);
      ctx.strokeStyle = color; ctx.lineWidth = (lw || 1.9) * (24 / size) * (size / 24) * 1.9;
      ctx.lineWidth = lw || 1.9;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.stroke(iconPath(name));
      ctx.restore();
    }

    /* --- chip: Step n / N ------------------------------------------------ */
    function chip(text, x, y, accent, a) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.font = '600 ' + px(.0135) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      var w = ctx.measureText(text).width + px(.026), h = px(.032);
      ctx.fillStyle = hexA(accent, .14); roundRect(x, y, w, h, h / 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, .5); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = accent; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x + px(.013), y + h / 2 + px(.0008));
      ctx.restore();
    }

    /* --- title with one gradient keyword --------------------------------- */
    function title(text, keyword, x, y, accent, a, maxW) {
      if (a <= 0) return 0;
      ctx.save(); ctx.globalAlpha = a;
      ctx.translate(0, (1 - E.outCubic(a)) * px(.018));
      var fs = px(.0415);
      ctx.font = '800 ' + fs + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      maxW = maxW || W * .62;
      /* split into words, draw with keyword highlighted */
      var words = String(text).split(' '), lines = [[]], cur = '';
      for (var i = 0; i < words.length; i++) {
        var t = cur ? cur + ' ' + words[i] : words[i];
        if (ctx.measureText(t).width > maxW && cur) { lines.push([]); cur = words[i]; }
        else cur = t;
        lines[lines.length - 1].push(words[i]);
      }
      var lh = fs * 1.14;
      lines.forEach(function (ws, li) {
        var cx = x;
        ws.forEach(function (w0) {
          var isKey = keyword && w0.replace(/[^A-Za-z0-9–-]/g, '').toLowerCase()
                      === keyword.toLowerCase();
          if (isKey) {
            var g = ctx.createLinearGradient(cx, 0, cx + ctx.measureText(w0).width, 0);
            g.addColorStop(0, accent); g.addColorStop(1, '#ffffff');
            ctx.fillStyle = g;
          } else ctx.fillStyle = '#eef3fb';
          ctx.fillText(w0, cx, y + li * lh);
          cx += ctx.measureText(w0 + ' ').width;
        });
      });
      ctx.restore();
      return lines.length * lh;
    }

    /* --- card ------------------------------------------------------------- */
    function card(o) {
      var a = o.a; if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.min(1, a);
      var pop = E.outBack(a);
      var cx = o.x + o.w / 2, cy = o.y + o.h / 2;
      ctx.translate(cx, cy); ctx.scale(lerp(.92, 1, pop), lerp(.92, 1, pop)); ctx.translate(-cx, -cy);
      ctx.fillStyle = o.active ? hexA(o.accent, .13) : 'rgba(255,255,255,.045)';
      roundRect(o.x, o.y, o.w, o.h, px(.011)); ctx.fill();
      ctx.strokeStyle = o.active ? hexA(o.accent, .75) : 'rgba(255,255,255,.12)';
      ctx.lineWidth = o.active ? 2.2 : 1.2; ctx.stroke();
      if (o.active) { ctx.save(); ctx.shadowColor = hexA(o.accent, .5);
        ctx.shadowBlur = px(.018); ctx.stroke(); ctx.restore(); }
      var ix = o.x + px(.027), iy = o.y + o.h / 2;
      if (o.icon) {
        ctx.fillStyle = hexA(o.accent, .16);
        ctx.beginPath(); ctx.arc(ix, iy, px(.0185), 0, 7); ctx.fill();
        drawIcon(o.icon, ix, iy, px(.021), o.accent, 1.9);
      }
      var tx = o.icon ? ix + px(.032) : o.x + px(.022);
      var tw = o.w - (tx - o.x) - px(.022);
      ctx.fillStyle = '#f2f6fd'; ctx.textBaseline = 'middle';
      ctx.font = '650 ' + px(.0178) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      if (o.sub) {
        ctx.textAlign = 'left';
        ctx.fillText(clip(o.label, tw), tx, iy - px(.0105));
        ctx.font = '400 ' + px(.0142) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
        ctx.fillStyle = 'rgba(226,235,248,.62)';
        ctx.fillText(clip(o.sub, tw), tx, iy + px(.0115));
      } else {
        ctx.textAlign = 'left';
        wrapText(clip(o.label, tw * 2), tx, iy + px(.0005), tw, px(.021));
      }
      ctx.restore();
    }
    function clip(s, maxW) {
      s = String(s);
      if (ctx.measureText(s).width <= maxW) return s;
      while (s.length > 3 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
      return s + '…';
    }

    /* --- arrow (flowing dash) -------------------------------------------- */
    function arrow(x1, y1, x2, y2, accent, a, t) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      var ex = lerp(x1, x2, E.outCubic(a)), ey = lerp(y1, y2, E.outCubic(a));
      ctx.strokeStyle = hexA(accent, .85); ctx.lineWidth = px(.0028);
      ctx.setLineDash([px(.009), px(.007)]); ctx.lineDashOffset = -(t * px(.055)) % px(.032);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash([]);
      if (a > .72) {
        var ang = Math.atan2(y2 - y1, x2 - x1), s = px(.0105);
        ctx.fillStyle = accent; ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - s * Math.cos(ang - .42), y2 - s * Math.sin(ang - .42));
        ctx.lineTo(x2 - s * Math.cos(ang + .42), y2 - s * Math.sin(ang + .42));
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    /* --- truth / data table ---------------------------------------------- */
    function table(o) {
      var a = o.a; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      var cols = o.head.length, cw = o.w / cols, rh = o.rh || px(.0315);
      ctx.font = '700 ' + px(.0135) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      o.head.forEach(function (h0, i) {
        ctx.fillStyle = hexA(o.accent, .9);
        ctx.fillText(h0, o.x + cw * i + cw / 2, o.y + rh / 2);
      });
      ctx.strokeStyle = hexA(o.accent, .32); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(o.x, o.y + rh); ctx.lineTo(o.x + o.w, o.y + rh); ctx.stroke();
      o.rows.forEach(function (r, ri) {
        var ra = appear(o.local, (o.rowAt || 0) + ri * (o.rowStep || .22), .4);
        if (ra <= 0) return;
        ctx.globalAlpha = a * ra;
        var yy = o.y + rh * (ri + 1);
        if (o.hi === ri) {
          ctx.fillStyle = hexA(o.accent, .17);
          roundRect(o.x - px(.004), yy + 1, o.w + px(.008), rh - 2, px(.004)); ctx.fill();
        }
        r.forEach(function (cell, ci) {
          var txt = String(cell), col = '#e7eefa';
          if (txt === 'T') col = '#5fd39a';
          if (txt === 'F') col = '#ff7a7a';
          ctx.fillStyle = col;
          ctx.font = (txt === 'T' || txt === 'F' ? '800 ' : '500 ') +
                     px(.0148) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
          ctx.fillText(txt, o.x + cw * ci + cw / 2, yy + rh / 2);
        });
      });
      ctx.restore();
    }

    /* --- checklist -------------------------------------------------------- */
    function checklist(items, x, y, accent, local, at, step, gap) {
      step = step || .5; gap = gap || px(.047);
      items.forEach(function (it, i) {
        var a = appear(local, at + i * step, .5); if (a <= 0) return;
        var yy = y + i * gap;
        ctx.save(); ctx.globalAlpha = a;
        var r = px(.0145), k = E.outBack(a);
        ctx.strokeStyle = hexA(accent, .85); ctx.lineWidth = px(.0024);
        ctx.beginPath(); ctx.arc(x, yy, r * k, 0, 7); ctx.stroke();
        if (a > .45) {
          var ck = clamp01((a - .45) / .5);
          ctx.strokeStyle = accent; ctx.lineWidth = px(.0032); ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x - r * .45, yy + r * .02);
          var mx = x - r * .08, my = yy + r * .42;
          ctx.lineTo(lerp(x - r * .45, mx, Math.min(1, ck * 2)), lerp(yy + r * .02, my, Math.min(1, ck * 2)));
          if (ck > .5) ctx.lineTo(lerp(mx, x + r * .5, (ck - .5) * 2), lerp(my, yy - r * .4, (ck - .5) * 2));
          ctx.stroke();
        }
        ctx.fillStyle = '#eaf1fb'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.font = '550 ' + px(.0178) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
        wrapText(it, x + px(.028), yy, W * .52, px(.022));
        ctx.restore();
      });
    }

    /* --- terminal --------------------------------------------------------- */
    function terminal(o) {
      var a = o.a; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(6,10,18,.82)';
      roundRect(o.x, o.y, o.w, o.h, px(.009)); ctx.fill();
      ctx.strokeStyle = hexA(o.accent, .4); ctx.lineWidth = 1.3; ctx.stroke();
      ['#ff5f57', '#febc2e', '#28c840'].forEach(function (c, i) {
        ctx.fillStyle = c; ctx.beginPath();
        ctx.arc(o.x + px(.016) + i * px(.014), o.y + px(.016), px(.0042), 0, 7); ctx.fill();
      });
      ctx.font = '500 ' + px(.0152) + 'px ui-monospace,SFMono-Regular,Menlo,monospace';
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      var shown = Math.floor(clamp01((o.local - (o.at || 0)) / (o.speed || 2.6)) *
                  o.lines.join('').length);
      var used = 0;
      o.lines.forEach(function (ln, i) {
        var txt = ln.t, take = Math.max(0, Math.min(txt.length, shown - used));
        used += txt.length;
        if (take <= 0) return;
        ctx.fillStyle = ln.c || (ln.t.charAt(0) === '$' ? '#5fd39a' : 'rgba(226,235,248,.8)');
        ctx.fillText(txt.slice(0, take), o.x + px(.016), o.y + px(.042) + i * px(.0245));
      });
      ctx.restore();
    }

    /* --- progress bar ----------------------------------------------------- */
    function progressBar(x, y, w, h, frac, accent, a, label) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(255,255,255,.08)'; roundRect(x, y, w, h, h / 2); ctx.fill();
      var g = ctx.createLinearGradient(x, 0, x + w, 0);
      g.addColorStop(0, accent); g.addColorStop(1, hexA(accent, .55));
      ctx.fillStyle = g; roundRect(x, y, Math.max(h, w * clamp01(frac)), h, h / 2); ctx.fill();
      if (label) {
        ctx.fillStyle = 'rgba(230,238,250,.85)'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 ' + px(.0138) + 'px ui-sans-serif,-apple-system,sans-serif';
        ctx.fillText(label, x, y - px(.006));
      }
      ctx.restore();
    }

    /* --- counting number -------------------------------------------------- */
    function counter(val, x, y, accent, a, suffix, size) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      var shown = typeof val === 'number'
        ? (Number.isInteger(val) ? Math.round(val * E.outCubic(a))
                                 : (val * E.outCubic(a)).toFixed(String(val).split('.')[1].length))
        : val;
      ctx.font = '800 ' + px(size || .052) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = hexA(accent, .6); ctx.shadowBlur = px(.022);
      ctx.fillStyle = accent;
      ctx.fillText(shown + (suffix || ''), x, y);
      ctx.restore();
    }

    /* --- typewriter ------------------------------------------------------- */
    function typewriter(text, x, y, maxW, accent, local, at, speed, size) {
      var el = local - (at || 0); if (el <= 0) return;
      var n = Math.floor(clamp01(el / (speed || 2.2)) * text.length);
      ctx.save();
      ctx.font = '600 ' + px(size || .0205) + 'px ui-monospace,SFMono-Regular,Menlo,monospace';
      ctx.fillStyle = accent; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      var shown = text.slice(0, n);
      ctx.fillText(shown, x, y);
      if (n < text.length && Math.floor(local * 2.5) % 2 === 0) {
        var w = ctx.measureText(shown).width;
        ctx.fillRect(x + w + px(.002), y - px(.011), px(.0055), px(.022));
      }
      ctx.restore();
    }

    /* --- caption (takeaway) ----------------------------------------------- */
    function caption(text, accent, a) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      var fs = px(.0192), y = H * .868;
      ctx.font = '600 ' + fs + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
      ctx.textAlign = 'center';
      var tw = Math.min(ctx.measureText(text).width + px(.05), W * .8);
      var bx = (W - tw) / 2, bh = px(.046);
      ctx.fillStyle = 'rgba(8,13,24,.72)'; roundRect(bx, y - bh / 2, tw, bh, bh / 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, .45); ctx.lineWidth = 1.3; ctx.stroke();
      ctx.fillStyle = '#f0f5fd'; ctx.textBaseline = 'middle';
      ctx.fillText(text, W / 2, y + px(.001));
      ctx.restore();
    }

    /* --- hero icon with pulsing rings ------------------------------------- */
    function hero(icon, x, y, size, accent, a, t) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      for (var i = 0; i < 3; i++) {
        var ph = (t * .45 + i / 3) % 1;
        ctx.strokeStyle = hexA(accent, .3 * (1 - ph));
        ctx.lineWidth = px(.0022);
        ctx.beginPath(); ctx.arc(x, y, size * (.62 + ph * .78), 0, 7); ctx.stroke();
      }
      var g = ctx.createRadialGradient(x, y, 0, x, y, size * .78);
      g.addColorStop(0, hexA(accent, .3)); g.addColorStop(1, hexA(accent, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, size * .78, 0, 7); ctx.fill();
      ctx.strokeStyle = hexA(accent, .8); ctx.lineWidth = px(.0028);
      ctx.beginPath(); ctx.arc(x, y, size * .56, 0, 7); ctx.stroke();
      drawIcon(icon, x, y + Math.sin(t * 1.6) * px(.003), size * .62, accent, 1.75);
      ctx.restore();
    }

    /* --- formula (serif italic, centred) ---------------------------------- */
    function formula(text, x, y, a, size, color) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.font = 'italic 600 ' + px(size || .027) +
                 'px "Latin Modern Math","Cambria Math",Georgia,serif';
      ctx.fillStyle = color || '#f4f8ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    return { ctx: ctx, W: W, H: H, u: u, px: px, E: E, lerp: lerp, clamp01: clamp01,
             appear: appear, rnd: rnd, roundRect: roundRect, wrapText: wrapText,
             drawIcon: drawIcon, chip: chip, title: title, card: card, arrow: arrow,
             table: table, checklist: checklist, terminal: terminal,
             progressBar: progressBar, counter: counter, typewriter: typewriter,
             caption: caption, hero: hero, formula: formula, hexA: hexA, clip: clip };
  }

  function hexA(hex, a) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function mixHex(h1, h2, t) {
    function p(h) { h = h.replace('#', '');
      return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; }
    var a = p(h1), b = p(h2);
    return 'rgb(' + Math.round(lerp(a[0],b[0],t)) + ',' + Math.round(lerp(a[1],b[1],t)) +
           ',' + Math.round(lerp(a[2],b[2],t)) + ')';
  }

  /* ---- scene lookup ----------------------------------------------------- */
  function sceneAt(t) {
    for (var i = SCENES.length - 1; i >= 0; i--) if (t >= starts[i]) return i;
    return 0;
  }

  /* ======================= THE ONE PURE RENDER FN ======================== */
  function drawFrame(ctx, t, w, h, opts) {
    opts = opts || {};
    t = Math.max(0, Math.min(TOTAL - .001, t));
    var si = sceneAt(t), S = SCENES[si], local = t - starts[si], p = clamp01(local / S.dur);
    var accent = S.accent;
    /* smooth accent blend across the boundary */
    var nxt = SCENES[Math.min(SCENES.length - 1, si + 1)];
    var bl = clamp01((local - (S.dur - 1.1)) / 1.1);
    var blended = bl > 0 ? mixHex(accent, nxt.accent, bl * .55) : accent;

    var api = mk(ctx);
    api.W = w; api.H = h;
    var px = function (f) { return f * w; };
    api.px = px;

    /* ---- background ---------------------------------------------------- */
    var bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#080c15');
    bg.addColorStop(.5, mixHex('#0b1120', blended, .055));
    bg.addColorStop(1, '#070a12');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    /* grid */
    ctx.save(); ctx.strokeStyle = hexA(blended, .05); ctx.lineWidth = 1;
    var gs = px(.038);
    for (var gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
    for (var gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
    ctx.restore();

    /* two drifting glow orbs */
    [[0, .17], [1, .62]].forEach(function (o) {
      var seed = o[0], ph = t * .045 + o[1];
      var ox = w * (.22 + .56 * (0.5 + 0.5 * Math.sin(ph * 2 * Math.PI + seed * 2)));
      var oy = h * (.3 + .4 * (0.5 + 0.5 * Math.cos(ph * 2 * Math.PI * .8 + seed)));
      var rr = px(.3);
      var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0, hexA(blended, .085)); g.addColorStop(1, hexA(blended, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, rr, 0, 7); ctx.fill();
    });

    /* occasional scan-line sweep */
    var sc = (t * .07) % 1;
    if (sc < .34) {
      var sy = h * (sc / .34);
      var sg = ctx.createLinearGradient(0, sy - px(.05), 0, sy + px(.05));
      sg.addColorStop(0, hexA(blended, 0)); sg.addColorStop(.5, hexA(blended, .045));
      sg.addColorStop(1, hexA(blended, 0));
      ctx.fillStyle = sg; ctx.fillRect(0, sy - px(.05), w, px(.1));
    }

    /* ---- header -------------------------------------------------------- */
    var hy = h * .062;
    ctx.save();
    var lx = w * .055;
    var rg = ctx.createLinearGradient(lx - px(.02), 0, lx + px(.02), 0);
    rg.addColorStop(0, blended); rg.addColorStop(1, '#ffffff');
    ctx.strokeStyle = rg; ctx.lineWidth = px(.0026);
    ctx.beginPath(); ctx.arc(lx, hy, px(.0185), 0, 7); ctx.stroke();
    api.drawIcon(META.logoIcon || 'brain', lx, hy, px(.021), blended, 1.8);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.font = '800 ' + px(.0198) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
    var tg = ctx.createLinearGradient(lx + px(.028), 0, lx + px(.2), 0);
    tg.addColorStop(0, '#ffffff'); tg.addColorStop(1, blended);
    ctx.fillStyle = tg;
    ctx.fillText(META.brand, lx + px(.029), hy - px(.008));
    ctx.font = '450 ' + px(.0135) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
    ctx.fillStyle = 'rgba(214,226,243,.6)';
    ctx.fillText(META.subtitle, lx + px(.029), hy + px(.012));
    /* blinking badge */
    var bx = w - w * .055, blink = (Math.sin(t * 3.1) * .5 + .5);
    ctx.font = '700 ' + px(.0128) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
    ctx.textAlign = 'right';
    var bw = ctx.measureText(META.badge).width + px(.034), bh2 = px(.03);
    ctx.fillStyle = hexA(blended, .12);
    api.roundRect(bx - bw, hy - bh2 / 2, bw, bh2, bh2 / 2); ctx.fill();
    ctx.strokeStyle = hexA(blended, .45); ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = blended; ctx.fillText(META.badge, bx - px(.012), hy + px(.0008));
    ctx.beginPath(); ctx.arc(bx - bw + px(.013), hy, px(.0038), 0, 7);
    ctx.fillStyle = hexA('#5fd39a', .35 + blink * .65); ctx.fill();
    ctx.restore();

    /* ---- story progress segments --------------------------------------- */
    ctx.save();
    var sgy = h * .0185, pad = px(.0035), left = w * .055,
        avail = w * .89, segW = (avail - pad * (SCENES.length - 1)) / SCENES.length;
    SCENES.forEach(function (s, i) {
      var x = left + i * (segW + pad);
      ctx.fillStyle = 'rgba(255,255,255,.12)';
      api.roundRect(x, sgy, segW, px(.0032), px(.002)); ctx.fill();
      var f = i < si ? 1 : i === si ? p : 0;
      if (f > 0) { ctx.fillStyle = hexA(blended, .95);
        api.roundRect(x, sgy, segW * f, px(.0032), px(.002)); ctx.fill(); }
    });
    ctx.restore();

    /* ---- footer -------------------------------------------------------- */
    ctx.save();
    var fy = h * .952;
    ctx.strokeStyle = hexA(blended, .3); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w * .055, fy - px(.016)); ctx.lineTo(w * .945, fy - px(.016)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * .055, fy + px(.018)); ctx.lineTo(w * .945, fy + px(.018)); ctx.stroke();
    ctx.font = '600 ' + px(.0132) + 'px ui-sans-serif,-apple-system,Segoe UI,sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = hexA(blended, .8); ctx.fillText(META.brand, w * .055, fy);
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(205,219,240,.5)';
    ctx.fillText(META.hashtags, w * .945, fy);
    /* vertical watermark */
    ctx.translate(w * .982, h * .5); ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center'; ctx.font = '700 ' + px(.0118) + 'px ui-sans-serif,sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.055)';
    ctx.fillText(META.brand.toUpperCase(), 