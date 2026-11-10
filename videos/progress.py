#!/usr/bin/env python3
"""Regenerate PROGRESS.md from syllabus.js + content/. Usage: python3 progress.py"""
import json, subprocess, pathlib
ROOT = pathlib.Path(__file__).parent
syl = json.loads(subprocess.check_output(['node', '-e', f"process.stdout.write(JSON.stringify(require({json.dumps(str(ROOT / 'syllabus.js'))})))"]))
done = {p.stem for p in (ROOT / 'content').glob('*.js') if not p.stem.startswith('_')}
total = sum(len(s['topics']) for s in syl); have = sum(1 for s in syl for t in s['topics'] if t[0] in done)
out = ['# GATE CS 2027 video progress', '', f'**{have} of {total} modules complete.** Regenerate with `python3 progress.py`.', '', '| Section | Done | Next up |', '|---|---|---|']
for s in syl:
    d = sum(1 for t in s['topics'] if t[0] in done); nxt = next((t[1] for t in s['topics'] if t[0] not in done), '-')
    out.append(f"| {s['sec']} | {d}/{len(s['topics'])} | {nxt} |")
out.append('')
for s in syl:
    out += [f"## {s['sec']}", '']
    out += [f"- [{'x' if t[0] in done else ' '}] **{t[1]}** (`{t[0]}`): {t[2]}" for t in s['topics']] + ['']
(ROOT / 'PROGRESS.md').write_text('\n'.join(out)); print(f'{have}/{total} modules complete')
for s in syl:
    print(f"  {s['sec']:34s} {sum(1 for t in s['topics'] if t[0] in done)}/{len(s['topics'])}")
