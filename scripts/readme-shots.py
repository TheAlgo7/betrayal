"""README screenshots, from the live app.

  python scripts/readme-shots.py            # against production
  BASE=http://localhost:3000 python scripts/readme-shots.py

Needs Python with Playwright and Chrome. Uses the app's own demo lists, so no
real account appears. Writes docs/readme/src/assets/*.png; the README Kit
(Work/Playbooks/README Kit/render.py) draws docs/readme/*.webp from them.
"""
import base64, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE', 'https://betrayal-seven.vercel.app')
OUT = Path('docs/readme/src/assets')
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

    b.close()
print('written:', sorted(x.name for x in OUT.iterdir()))
