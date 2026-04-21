<div align="center">

# BETRAYAL

### *Keep your circle real.*

**Instagram unfollower tracker built around privacy, style, and a brutally simple job: show who is not following you back.**

[![Live Site](https://img.shields.io/badge/Live-betrayal--seven.vercel.app-C13584?style=for-the-badge&logo=vercel&logoColor=white)](https://betrayal-seven.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Privacy First](https://img.shields.io/badge/Privacy-No%20Logins%20%C2%B7%20Local%20Only-C13584?style=for-the-badge&labelColor=101010)](https://github.com/TheAlgo7/betrayal)
[![Theme System](https://img.shields.io/badge/Themes-IG%20Dark%20%C2%B7%20Grounded%20Disruption-C13584?style=for-the-badge&labelColor=101010)](https://github.com/TheAlgo7/betrayal)

*Betrayal uses your official Instagram export instead of third-party account access. No shady login screens. No token scraping. No account risk. Just your data, compared locally, presented with a little attitude.*

</div>

---

## Overview

Instagram does not tell you who quietly disappeared from your side of the relationship. Most tools that try to solve this ask for direct account access and instantly become sketchy.

Betrayal takes the safe route: feed it the `followers` and `following` files from your own Instagram export, let it parse the mess, and get clean lists for who is not following you back, who is, and who should stop wasting screen space.

## Core Features

- **Official-export workflow** instead of risky third-party login.
- **Paste or upload input modes** for flexibility.
- **Dismiss system** so celebs, brands, and noise stay out of the way.
- **Theme switching** with a more styled interface than typical utility tools.
- **Local persistence** for dismissed accounts and preferences.
- **Fast parsing** that strips dates, headers, and irrelevant HTML clutter.

## How To Use

1. Download your Instagram data in **HTML** format with *Followers and Following* included.
2. Extract the archive and locate `followers.html` and `following.html`.
3. Open Betrayal and paste or upload the files.
4. Let the app compare the two lists and surface the truth.

## Quick Start

```bash
git clone https://github.com/TheAlgo7/betrayal
cd betrayal
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run build
npm run start
npm run lint
```

## Project Structure

```text
betrayal/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   └── page.js
│   └── components/
│       └── Betrayal.jsx
├── public/
│   ├── manifest.json
│   ├── og-image.png
│   └── icon assets
├── next.config.js
├── jsconfig.json
└── package.json
```

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| UI | React |
| Styling | Handcrafted CSS-in-JS |
| Persistence | localStorage |
| Avatar Lookup | unavatar.io |
| Hosting | Vercel |

## Design Language

- **Instagram-adjacent, but sharper.** Familiar gradients without cloning the app blindly.
- **Dark by default.** This is a utility, but it still deserves presence.
- **A little theatrical.** The app is allowed to enjoy its own premise.
- **Privacy is the product.** The aesthetic matters, but trust is the core feature.

<div align="center">

Built for people who **notice patterns and keep receipts**.

</div>
