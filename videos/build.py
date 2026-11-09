#!/usr/bin/env python3
"""Build self-contained GATE CS video HTML files from content/*.js using engine.html.

    python3 build.py              # build every video + gallery
    python3 build.py recursion    # build one video (gallery untouched)
"""
import json, re, subprocess, sys, pathlib, html
ROOT = pathlib.Path(__file__).parent
ENGINE = (ROOT / 'engine.html').read_text()
_ic = ENGINE.split('const IC = {')[1].split('};')[0]
ICONS = set(re.findall(r"^\s{2}(\w+): '", _ic, re.M)) | set(re.findall(r",\s(\w+): '", _ic))
WPS, PAD, LEAD = 2.15, 1.4, 0.35

def load(path):
    out = subprocess.check_output(['node', '-e', f"process.stdout.write(JSON.stringify(require({json.dumps(str(path))})))"])
    return json.loads(out)

def norm(d):
    for s in d['scenes']:
        if 'type' not in s:
            s['type'] = 'flow' if 'nodes' in s else 'compare' if 'cols' in s else 'step'
    return d

def duration(d):
    raw = [max(s.get('min', 5), LEAD + len(str(s.get('n', '')).split()) / WPS + PAD + (1.2 if s.get('cmd') else 0)) for s in d['scenes']]
    ncmd = sum(1 for s in d['scenes'] if s.get('cmd'))
    hold = max(0, min(8, (d.get('target', 0) * 60 * 0.985 - sum(raw)) / ncmd)) if d.get('target') and ncmd else 0
    d['_hold'] = hold
    return sum(raw) + hold * ncmd

def check(d):
    errs = []
    for k, s in enumerate(d['scenes']):
        tag = f"{d['id']}#{k+1} {s.get('title', s['type'])}"
        if not s.get('n'): errs.append(f'{tag}: missing narration')
        for key in ('items', 'nodes'):
            for it in s.get(key, []):
                if it[0] not in ICONS: errs.append(f'{tag}: unknown icon {it[0]}')
        for r in s.get('repos', []):
            if len(r) > 3 and r[3] not in ICONS: errs.append(f'{tag}: unknown icon {r[3]}')
        if s.get('icon') and s['icon'] not in ICONS: errs.append(f"{tag}: unknown icon {s['icon']}")
        if s['type'] == 'compare':
            for r in s['rows']:
                if len(r) - len(s['cols']) not in (0, 1): errs.append(f'{tag}: row {r[0]!r} has {len(r)} cells for {len(s["cols"])} headers')
        if len(s.get('items', [])) > 5: errs.append(f'{tag}: more than 5 items')
        if len(s.get('nodes', [])) > 5: errs.append(f'{tag}: more than 5 nodes')
    if d.get('icon') and d['icon'] not in ICONS: errs.append(f"{d['id']}: unknown hero icon {d['icon']}")
    return errs

def build(d):
    data = json.dumps(d, ensure_ascii=False).replace('</', '<\\/')
    page = ENGINE.replace('/*__TITLE__*/', html.escape(d['title'])).replace('/*__ACCENT__*/', d['accent']).replace('/*__DATA__*/', data)
    (ROOT / 'out' / f"{d['id']}.html").write_text(page)

def gallery(syl, built):
    secs, n_done, total = [], 0, 0
    for i, sec in enumerate(syl, 1):
        cards = []
        for tid, title, sub in sec['topics']:
            r = built.get(tid)
            if r:
                n_done += 1; total += r['dur']
                cards.append(f"""<a class="c" href="{tid}.html" style="--a:{sec['accent']}"><span class="k">{html.escape(sec['sec'])}</span>
<b>{html.escape(title)}</b><span class="m">{int(r['dur']//60)}:{int(r['dur']%60):02d} · {r['phases']} steps · {r['scenes']} scenes</span>
<span class="s">{html.escape(sub)}</span></a>""")
            else:
                cards.append(f"""<div class="c p" style="--a:{sec['accent']}"><span class="k">Planned</span>
<b>{html.escape(title)}</b><span class="s">{html.escape(sub)}</span></div>""")
        done = sum(1 for t in sec['topics'] if t[0] in built)
        secs.append(f"<h2><span>Section {i}</span> {html.escape(sec['sec'])} <em>{done}/{len(sec['topics'])}</em></h2><div class=\"g\">{''.join(cards)}</div>")
    n_all = sum(len(s['topics']) for s in syl)
    (ROOT / 'out' / 'index.html').write_text(f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GATE CS 2027 video library · kona-srinivas-gate</title><style>
body{{margin:0;background:#070a12;color:#e6e9ef;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}}
header,section{{max-width:1300px;margin:auto;padding:0 24px}} header{{padding-top:28px}} h1{{margin:0;font-size:30px}} p{{color:#9aa4b2;margin:6px 0 0}}
h2{{font-size:20px;margin:30px 0 0}} h2 span{{color:#9aa4b2;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:.06em;margin-right:6px}} h2 em{{font-style:normal;color:#9aa4b2;font-size:14px;margin-left:6px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;padding:14px 0 0}}
.c{{display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:14px;background:#0f1420;border:1px solid rgba(255,255,255,.08);border-top:4px solid var(--a);color:inherit;text-decoration:none;transition:.15s}}
a.c:hover{{transform:translateY(-2px);border-color:var(--a)}} .c.p{{opacity:.45}} .k{{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--a)}}
.c b{{font-size:18px}} .m{{font-family:"SF Mono",Menlo,monospace;font-size:13px;color:#c9d1dc}} .s{{color:#9aa4b2;font-size:13.5px}}
footer{{text-align:center;color:#9aa4b2;padding:40px 0 30px}}</style></head><body>
<header><h1>GATE CS 2027 video library</h1><p>{n_done} of {n_all} syllabus topics ready · {int(total//3600)} h {int(total%3600//60)} min total · 30-minute explainer per topic · default voice, Voice Studio for your own voice, 1–4× speed and MP4 download in every file. Open any video in Chrome.</p></header>
<section>{''.join(secs)}</section><footer>kona-srinivas-gate · syllabus: GATE 2027 CS (IIT Madras)</footer></body></html>""")

if __name__ == '__main__':
    only = set(sys.argv[1:])
    syl = load(ROOT / 'syllabus.js')
    known = {t[0] for s in syl for t in s['topics']}
    built, bad = {}, []
    for f in sorted((ROOT / 'content').glob('*.js')):
        d = norm(load(f))
        if only and d['id'] not in only: continue
        if d['id'] not in known: bad.append(f"{d['id']}: not in syllabus.js")
        bad += check(d); build(d)
        ph = sum(1 for s in d['scenes'] if s['type'] in ('step', 'flow', 'compare') and not s.get('x'))
        dur = duration(d); words = sum(len(str(s.get('n', '')).split()) for s in d['scenes'])
        built[d['id']] = dict(dur=dur, phases=ph, scenes=len(d['scenes']))
        tgt = d.get('target', 0) * 60
        flag = '' if not tgt or abs(dur - tgt) <= 0.1 * tgt else f'  <-- target {d["target"]} min'
        print(f"{d['id']:<30} {int(dur//60):>2}:{int(dur%60):02d}  scenes {len(d['scenes']):>3}  steps {ph:>3}  words {words:>5}  hold {d['_hold']:.1f}s{flag}")
    if not only: gallery(syl, built)
    if bad: print('\nISSUES:\n' + '\n'.join(bad)); sys.exit(1)
