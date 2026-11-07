// Betrayal's README pictures, drawn by the README Kit (Work\Playbooks\README Kit\render.py).
// Every wide picture has a "-mobile" twin that the README swaps in on screens up to 600 px.
// The screens come from scripts/readme-shots.py: the live app running its built-in demo (invented
// handles, never a real account), phones at 393x852 and 2x, the desktop at 1080x675 and 2x.
const MAGENTA = '#d42ad0', INK = '#f6eef6';
const NIGHT = (at, glow = '#3a0c36') => `radial-gradient(820px 640px at ${at}, ${glow} 0%, rgba(9,4,8,0) 70%), #090408`;
const P = (src, x, y, w, rot = 0, z = 20, glow = null, light = false) =>
  ({ type: 'phone', src, x, y, w, rot, z, glow, bar: true, barBg: light ? '#f7f2f7' : '#090408', barColor: light ? '#1c1018' : '#f6eef6' });
const wideLine = { width: 20, color: MAGENTA, points: [[-40, 712], [400, 690], [800, 730], [1640, 650]] };
const tallLine = (y) => ({ width: 26, color: MAGENTA, points: [[-40, y], [400, y - 40], [800, y + 10], [1120, y - 50]] });
const panel = (head, sub, items) => ({
  w: 1600, h: 760, bg: NIGHT('76% 54%'), color: INK, accent: MAGENTA,
  head: { x: 76, y: 180, size: 150, max: 530, lines: head }, sub: { x: 80, width: 500, size: 27, text: sub }, line: wideLine, items,
});
const tall = (head, sub, items, h = 1360) => ({
  w: 1080, h, bg: NIGHT('56% 74%'), color: INK, accent: MAGENTA,
  head: { x: 64, y: 80, size: 180, max: 950, lines: head }, sub: { x: 70, width: 930, size: 36, text: sub }, line: tallLine(h - 40), items,
});

window.README = {
  name: 'Betrayal', icon: 'icon.png',
  layouts: {
    hero: {
      w: 1600, h: 820, bg: NIGHT('74% 54%'), color: INK, accent: MAGENTA,
      brand: { x: 80, y: 74, size: 30 },
      head: { x: 76, y: 236, size: 150, max: 600, lines: ["Find out who's", 'unfollowing you'] },
      sub: { x: 80, width: 500, size: 27, gap: 34, text: 'From your own Instagram export. No login, no scraping: everything stays in your browser.' },
      line: { width: 20, color: MAGENTA, points: [[-40, 770], [300, 724], [640, 708], [900, 772], [1200, 714], [1640, 752]] },
      items: [
        { type: 'laptop', src: 'desktop.png', x: 700, y: 110, w: 720 },
        P('results.png', 1250, 230, 250, 5, 24, MAGENTA),
      ],
    },
    'hero-mobile': {
      w: 1080, h: 1350, bg: NIGHT('56% 76%'), color: INK, accent: MAGENTA,
      brand: { x: 70, y: 70, size: 38 },
      head: { x: 64, y: 196, size: 200, max: 950, lines: ["Find out who's", 'unfollowing you'] },
      sub: { x: 70, width: 930, size: 38, text: 'From your own Instagram export. No login, no scraping.' },
      line: { width: 26, color: MAGENTA, points: [[-40, 1300], [300, 1250], [600, 1296], [1120, 1222]] },
      items: [
        { type: 'laptop', src: 'desktop.png', x: 110, y: 760, w: 730 },
        P('results.png', 760, 760, 240, 5, 24, MAGENTA),
      ],
    },
    private: panel(['No login,', 'no scraping'], "Paste or upload the files Instagram gives you. Nothing is sent anywhere; the comparison runs in your browser.", [
      P('welcome.png', 900, 80, 290, -4, 24), P('input.png', 1220, 110, 280, 5, 22),
    ]),
    'private-mobile': tall(['No login,', 'no scraping'], 'Paste or upload the files Instagram gives you. The comparison runs in your browser.', [
      P('welcome.png', 90, 590, 330, -4, 24), P('input.png', 590, 620, 330, 5, 22),
    ]),
    results: panel(['Everyone,', 'sorted'], 'Unfollowers, fans and mutuals, with a profile link and a way to clear each one, and the list as a CSV.', [
      P('results.png', 900, 80, 290, -4, 24, MAGENTA), P('light.png', 1220, 110, 280, 5, 22, null, true),
    ]),
    'results-mobile': tall(['Everyone,', 'sorted'], 'Unfollowers, fans and mutuals, each with a profile link, and the list as a CSV.', [
      P('results.png', 90, 590, 330, -4, 24, MAGENTA), P('light.png', 590, 620, 330, 5, 22, null, true),
    ]),
  },
};
