"""README screenshots and hero banner, from the live app.

  python scripts/readme-shots.py            # against production
  BASE=http://localhost:3000 python scripts/readme-shots.py

Needs Python with Playwright and Chrome. Uses the app's own demo lists, so no
real account appears. Writes docs/readme/*.png.
"""
import base64, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE', 'https://betrayal-seven.vercel.app')
OUT = Path('docs/readme')
OUT.mkdir(parents=True, exist_ok=True)
UA = 'Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36'

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=2, user_agent=UA, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    shot = lambda name, wait=700: (page.wait_for_timeout(wait), page.screenshot(path=str(OUT / f'{name}.png')))

    page.goto(BASE, wait_until='networkidle')
    shot('welcome')
    page.get_by_role('button', name='try demo first').click()
    shot('input', 1200)
    page.get_by_role('button', name=re.compile('^Compare Lists')).click()
    shot('results', 1500)
    page.mouse.wheel(0, 700)
    shot('list', 900)
    page.mouse.wheel(0, -2000)
    page.get_by_role('button', name='Toggle color theme').click()
    shot('light', 900)
    ctx.close()

    desk = b.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1.5)
    d = desk.new_page()
    d.add_init_script("localStorage.setItem('betrayal-seen', '1')")
    d.goto(BASE, wait_until='networkidle')
    d.get_by_role('button', name='Load demo data').click(); d.wait_for_timeout(600)
    d.get_by_role('button', name=re.compile('^Compare Lists')).click(); d.wait_for_timeout(1500)
    d.screenshot(path=str(OUT / 'desktop.png'))
    desk.close()

    # Hero: the wordmark, the promise, and three real screens.
    img = lambda n: 'data:image/png;base64,' + base64.b64encode((OUT / n).read_bytes()).decode()
    hero = f'''<html><head>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Sans:wght@400;500&display=block" rel="stylesheet">
<style>
body {{ margin: 0; width: 1600px; height: 820px; background: #0C080D; font-family: 'DM Sans'; color: #F6EEF6; overflow: hidden; position: relative; }}
.glow {{ position: absolute; right: -160px; top: -200px; width: 1000px; height: 1000px; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(193,53,132,0.22), rgba(193,53,132,0)); }}
.copy {{ position: absolute; left: 110px; top: 200px; width: 660px; }}
.wm {{ font-family: 'Barlow Condensed'; font-weight: 800; font-size: 46px; letter-spacing: 0.02em; }}
.wm b {{ color: #D63AA5; }}
h1 {{ margin: 52px 0 0; font-family: 'Barlow Condensed'; font-size: 96px; line-height: 0.95; font-weight: 800; letter-spacing: -0.01em; }}
h1 em {{ font-style: normal; color: #D63AA5; }}
p {{ margin: 30px 0 0; font-size: 24px; line-height: 1.5; color: #B5A8B4; max-width: 30ch; }}
.phone {{ position: absolute; width: 300px; border-radius: 38px; overflow: hidden; border: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 40px 90px -30px rgba(0,0,0,0.9); background: #000; }}
.phone img {{ display: block; width: 100%; }}
.a {{ left: 800px; top: 120px; transform: rotate(-4deg); }}
.b {{ left: 1040px; top: 70px; z-index: 2; }}
.c {{ left: 1280px; top: 140px; transform: rotate(4deg); }}
</style></head><body><div class="glow"></div>
<div class="copy"><div class="wm"><b>B</b>ETRAYAL</div>
<h1>Find out who's <em>unfollowing you.</em></h1>
<p>From your own Instagram export. No login, no scraping, nothing leaves your browser.</p></div>
<div class="phone a"><img src="{img('input.png')}"></div>
<div class="phone b"><img src="{img('results.png')}"></div>
<div class="phone c"><img src="{img('light.png')}"></div>
</body></html>'''
    pg = b.new_page(viewport={'width': 1600, 'height': 820})
    pg.set_content(hero, wait_until='networkidle')
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(800)
    pg.screenshot(path=str(OUT / 'hero.png'))
    b.close()
print('written:', sorted(x.name for x in OUT.iterdir()))
