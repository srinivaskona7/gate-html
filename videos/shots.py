#!/usr/bin/env python3
"""Render named scenes of a video at the end of their animation: python3 shots.py <id> "Scene title" ... -> qa/<id>-<n>.jpg + qa/sheet.jpg"""
import asyncio, base64, sys, subprocess, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).parent
async def main(vid, titles):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + str(ROOT / 'out' / f'{vid}.html')); await pg.wait_for_function('window.__reel')
        R = await pg.evaluate('window.__reel'); files = []
        for k, t in enumerate(titles):
            sc = [s for s in R['scenes'] if s['name'] == t]
            if not sc: print('NOT FOUND', t); continue
            s = sc[0]; url = await pg.evaluate(f"window.__frameAt({s['start'] + s['dur'] * 0.97})")
            f = ROOT / 'qa' / f'{vid}-s{k}.jpg'; f.write_bytes(base64.b64decode(url.split(',')[1])); files.append(str(f))
        print('errors', errs); await b.close()
    if files:
        n = len(files); lay = '|'.join(f"{(i % 2)}*w0_{(i // 2)}*h0".replace('0*w0', '0').replace('*', '*') for i in range(n))
        inp = sum([['-i', f] for f in files], [])
        lay = '|'.join(f"{'w0' if i % 2 else '0'}_{'h0' if i // 2 else '0'}" for i in range(n))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', f"xstack=inputs={n}:layout={lay},scale=1600:-1", str(ROOT / 'qa' / 'sheet.jpg')] if n > 1 else ['cp', files[0], str(ROOT / 'qa' / 'sheet.jpg')])
asyncio.run(main(sys.argv[1], sys.argv[2:]))
