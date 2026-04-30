<div align="center">

# BETRAYAL

### *Keep your circle real.*

[![Live Site](https://img.shields.io/badge/Live-betrayal--seven.vercel.app-C13584?style=flat-square&labelColor=111111)](https://betrayal-seven.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-C13584?style=flat-square&logo=nextdotjs&logoColor=white&labelColor=111111)](https://nextjs.org)
[![PWA](https://img.shields.io/badge/PWA-Installable-C13584?style=flat-square&labelColor=111111)](https://betrayal-seven.vercel.app)
[![Privacy](https://img.shields.io/badge/Privacy-No%20Logins%20·%20Local%20Only-C13584?style=flat-square&labelColor=111111)](https://github.com/TheAlgo7/betrayal)

</div>

![Hero](./docs/assets/hero.png)

Instagram does not tell you who quietly disappeared from your side of the relationship. Most tools that try to solve this ask for direct account access and instantly become sketchy. Betrayal takes the safe route: feed it the `followers` and `following` files from your own Instagram export, let it parse the mess, and get clean lists for who is not following you back, who is, and who should stop wasting screen space. No shady login screens. No token scraping. No account risk. Just your data, compared locally, presented with a little attitude.

## How To Use

1. Go to Instagram → **Settings → Your activity → Download your information**
2. Request your data in **HTML** format with *Followers and Following* included
3. Extract the archive and locate `followers.html` and `following.html`
4. Open Betrayal and paste or upload the files
5. Let the app compare the two lists and surface the truth

## Features

- **Official-export workflow** instead of risky third-party login.
- **Paste or upload input modes** for flexibility.
- **Dismiss system** so celebs, brands, and noise stay out of the way.
- **Theme switching** with a more styled interface than typical utility tools.
- **Local persistence** for dismissed accounts and preferences.
- **Fast parsing** that strips dates, headers, and irrelevant HTML clutter.

## Install to Home Screen

**Android (Chrome):**
1. Open [betrayal-seven.vercel.app](https://betrayal-seven.vercel.app) in Chrome
2. Tap the **⋮** menu → **Add to Home screen**
3. Tap **Add** — Betrayal installs like a native app, no account needed

**iOS (Safari):**
1. Open [betrayal-seven.vercel.app](https://betrayal-seven.vercel.app) in Safari
2. Tap the **Share** button → **Add to Home Screen**
3. Tap **Add** — your circle-checker is always a tap away

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| UI | React |
| Styling | Handcrafted CSS-in-JS |
| Persistence | localStorage |
| Avatar Lookup | unavatar.io |
| Hosting | Vercel |
| PWA | Web App Manifest + service worker |

## Design Language

- **Instagram-adjacent, but sharper.** Familiar gradients without cloning the app blindly.
- **Dark by default.** This is a utility, but it still deserves presence.
- **A little theatrical.** The app is allowed to enjoy its own premise.
- **Privacy is the product.** The aesthetic matters, but trust is the core feature.

## Contributing

Pull requests are welcome. For significant changes, open an issue first.

- Keep it privacy-first — no backend calls, no account requirements, no data leaving the device
- Test with real Instagram HTML exports, not mocked data
- Match the existing dark-first aesthetic

<details>
<summary>Quick Start</summary>

```bash
git clone https://github.com/TheAlgo7/betrayal
cd betrayal
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run build
npm run start
npm run lint
```

</details>

<div align="center">

Built for people who **notice patterns and keep receipts** — by **[The Algothrim](https://thealgothrim.com)**

</div>
