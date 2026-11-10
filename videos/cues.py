#!/usr/bin/env python3
"""List each scene's viz cues next to its narration, marking cues that do not match: python3 cues.py <id> [--bad]"""
import json, re, subprocess, sys, pathlib
ROOT = pathlib.Path(__file__).parent
vid = sys.argv[1]; only_bad = '--bad' in sys.argv
d = json.loads(subprocess.check_output(['node', '-e', f"process.stdout.write(JSON.stringify(require('{ROOT}/content/{vid}.js')))"]))
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
for s in d['scenes']:
    if 'viz' not in s: continue
    ws = [norm(w) for w in s['n'].split()]; k0 = 0; bad = []; ks = []
    for st in s['viz'].get('steps', []):
        if st.get('at') is not None: continue
        tk = [norm(w) for w in str(st.get('k', '')).split() if norm(w)]
        hit = next((j for j in range(k0, len(ws)) if tk and all(j + q < len(ws) and (ws[j + q] == w if len(w) <= 2 else ws[j + q].startswith(w)) for q, w in enumerate(tk))), -1)
        ks.append((st.get('k'), hit))
        if hit < 0: bad.append(st.get('k'))
        else: k0 = hit + len(tk)
    if only_bad and not bad: continue
    print(f"\n## {s['title']}\n{s['n']}\n   cues: " + ' | '.join(f"{'✗ ' if h < 0 else ''}{k}" for k, h in ks))
