<div align="center">

# 🐍 BETRAYAL

### *Keep your circle real.*

**Instagram Unfollower Tracker — Built for people who notice.**

[![Live Site](https://img.shields.io/badge/Live%20Site-betrayal--seven.vercel.app-C13584?style=for-the-badge&logo=vercel&logoColor=white)](https://betrayal-seven.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-833AB4?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

*A clean, fast web app that exposes who unfollowed you on Instagram — using only your own official data export. No third-party logins. No account risk. Zero data leaves your device.*

</div>

---

## 🧬 What This Is

Instagram doesn't tell you who unfollowed you. Third-party apps that claim to do it are risky — they request account access and violate Instagram's terms. There's a smarter way.

Instagram lets you officially download your own data — your full followers and following list in HTML format. **Betrayal** takes those two files, parses out all the noise (dates, URLs, headers), compares the lists, and surfaces exactly who isn't following you back. Fast. Clean. Private.

The other tools that do this (like comparetwolists.com) look like they were built in 2008 and designed to confuse people. Betrayal is the version that should have existed.

**The celebrity problem is also solved** — you can dismiss accounts (brands, celebs, meme pages) so they don't pollute your results. Dismissed accounts persist across sessions via `localStorage` so you never have to dismiss Drake twice.

---

## 🌍 Live Demo

**[→ betrayal-seven.vercel.app](https://betrayal-seven.vercel.app)**

---

## 🗂️ Project Structure

```
betrayal/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout — metadata, OG tags, PWA, Google Fonts
│   │   └── page.js            # Entry page — renders <Betrayal />
│   └── components/
│       └── Betrayal.jsx       # Main app — all logic, UI, sub-components
├── public/
│   ├── manifest.json          # PWA manifest (standalone, #000 theme)
│   ├── favicon.ico            # App favicon
│   ├── favicon.png            # Favicon PNG variant
│   ├── icon-192.png           # PWA icon (192×192)
│   ├── icon-512.png           # PWA icon (512×512)
│   └── og-image.png           # OG / social share image (1200×630)
├── jsconfig.json              # Path alias (@/ → src/)
├── next.config.js             # Image domains (unavatar.io)
├── package.json
└── .gitignore
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 |
| Styling | Inline CSS-in-JS (zero dependencies) |
| Fonts | next/font/google — DM Sans, JetBrains Mono, Outfit |
| Profile Pics | unavatar.io (Instagram avatars with gradient fallback) |
| Persistence | localStorage (dismissed list + theme preference) |
| PWA | manifest.json + meta tags |
| Deployment | Vercel |

---

## 🎨 Design Philosophy — *Two Themes, One Vibe*

Betrayal ships with two switchable themes, both rooted in Instagram's 2026 brand direction. Pick on first launch or toggle anytime from the header.

**IG Dark — Grounded Optimism**
- Pure black `#000000` base with dark surface layers
- Core IG gradient — Butter Yellow → Pink `#C13584` → Purple `#833AB4` → Royal Blue `#405DE6`
- 2026 accent palette — Lavender, Sage, Teal, Persimmon, Butter Yellow, Plum Noir

**Grounded Disruption** *(inspired by the app icon)*
- Deep charcoal `#101010` base — trustworthy, premium, unbothered
- Cream gold `#E5D8B6` as the primary text tone — elegant, community-first
- Burgundy `#7B1541` + Fiery Orange `#E17A47` gradient accents — the "glitch burst" effect
- CTA buttons emit a dual-color shadow animation on hover

**Shared design tokens**
- Outfit 900 for display, DM Sans for body, JetBrains Mono for usernames
- `fadeUp` on page transitions, `slideIn` on list items with staggered delay
- Gradient text on all headings and stats via `background-clip: text`

---

## 🧩 Core Features

| Feature | Description |
|---|---|
| Onboarding Modal | First-visit popup explaining the app, live theme picker, and credits |
| Dual Themes | IG Dark + Grounded Disruption — toggle from the header, persists to localStorage |
| Smart Parser | Strips dates, URLs, headers from both followers + following formats |
| Two Input Modes | Paste raw text or upload `.html` / `.txt` files directly |
| Not Following Back | Everyone you follow who isn't following you back |
| Your Fans | People following you that you haven't followed back |
| Mutuals | Your actual two-way connections |
| Profile Pics | Real Instagram avatars via unavatar.io, gradient initial fallback |
| Dismiss System | Remove celebs/brands from results — persists across sessions |
| Search | Filter any list by username in real time |
| Export | Download any list as `.txt` |
| Privacy | 100% client-side — zero data leaves your browser |
| PWA | Installable on mobile as a standalone app |

---

## 📱 How to Use

**Step 1** — Open Instagram → Settings → Your Activity → Download Your Information. Select *Followers and Following* only, set format to **HTML**, and submit. Instagram will email you a download link.

**Step 2** — Download the zip from that email, extract it. You'll find `followers.html` and `following.html` inside the export folder.

**Step 3** — Open Betrayal, paste or upload those two files, and tap **Expose the Betrayers**. See who's not following you back — then dismiss the celebs and meme pages so only real people show.

---

## 🚀 Run Locally

```bash
git clone https://github.com/TheAlgo7/betrayal
cd betrayal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

<div align="center">

**Built for the ones who keep tabs. On everyone.**

`v1.1.0` · Grounded Optimism + Grounded Disruption · April 2026

<sub>© 2026 <a href="https://github.com/TheAlgo7">Gaurav Kumar</a> · <a href="https://thealgothrim.com">thealgothrim.com</a> · New Delhi, India</sub>

</div>
