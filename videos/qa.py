import asyncio, os, sys, json, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).parent
async def main(ids, shots):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        res = {}
        for i in ids:
            pg = await b.new_page(viewport={'width': 1600, 'height': 1000}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            await pg.goto('file://' + str(ROOT / 'out' / f'{i}.html')); await pg.wait_for_function('window.__reel')
            R = await pg.evaluate('window.__reel'); ov = await pg.evaluate('window.__drawAll()')
            mid = await pg.evaluate('window.__reel.scenes.map(s => s.start + s.dur * 0.5)')
            await pg.evaluate(f'(() => {{ for (const t of {json.dumps(mid)}) window.__frameAt(t); }})()')
            ov = await pg.evaluate('window.__overflow()')
            if shots:
                os.makedirs(ROOT / 'qa', exist_ok=True)
                for k in shots:
                    if k < len(R['scenes']):
                        s = R['scenes'][k]; url = await pg.evaluate(f"window.__frameAt({s['start'] + s['dur'] - 0.1})")
                        import base64; open(ROOT / 'qa' / f'{i}-{k:02d}.jpg', 'wb').write(base64.b64decode(url.split(',')[1]))
            res[i] = dict(total=round(R['total'], 1), scenes=len(R['scenes']), phases=R['phases'], overflow=ov, n_over=len(ov), errors=errs[:3])
            await pg.close()
        await b.close()
        for k, v in res.items():
            m, s = divmod(int(v['total']), 60)
            print(f"{k:<14} {m:>2}:{s:02d}  scenes {v['scenes']:>3}  steps {v['phases']:>3}  overflow {v['n_over']:>2}  js-errors {len(v['errors'])}")
            for o in v['overflow']: print('     ', o)
            for e in v['errors']: print('   ERR', e)
ids = [a for a in sys.argv[1:] if not a.startswith('--')]
shots = [int(x) for a in sys.argv[1:] if a.startswith('--shots=') for x in a[8:].split(',')]
asyncio.run(main(ids, shots))
