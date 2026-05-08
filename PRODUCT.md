# Betrayal — Product Context

## Product Purpose
Betrayal is a 100% client-side Instagram follower-comparison tool. Users upload their official Instagram data export (followers.html + following.html) and the app instantly reveals who unfollows them, who their fans are, and who their mutuals are. Zero server, zero login, zero scraping — all processing happens in the browser.

## Register
product

## Users
Gen Z and millennial Instagram users (18–30) who are socially aware and want to audit their follower circle. They understand Instagram's data export feature or will learn it. They value privacy — no passwords, no third-party access. Typical use: occasional check every few weeks. Mobile-first audience but primarily desktop for the upload/paste flow.

## Brand Tone
Sharp, a little irreverent, direct. The name "Betrayal" leans into the emotional sting of finding out someone unfollowed you. Not corporate, not cute — raw and honest. Copy is terse and punchy. The tagline "Keep your circle real" says it all.

## Design Direction
Dark-first, high-contrast, magenta accent. Condensed display type (Barlow Condensed 900) for big numbers and headlines creates editorial drama. Monospace (JetBrains Mono) for usernames and data elements grounds it in a technical/data aesthetic. The magenta (oklch 60% 0.25 330) is the single brand color — used for the accent letter "B", key numbers, and CTAs.

## Color Strategy
Restrained — deep purplish-black background with one magenta accent at <15% coverage. Semantic colors (green for success/mutuals, amber for fans/warnings, red for danger) are used sparingly for data states only.

## Anti-References
- Generic SaaS dashboards (no purple gradients on white)
- Instagram's own pastel gradient aesthetic (we're the anti-Instagram)
- Follower-tracker apps that look like scamware
- "Social media analytics" tools with blue corporate palettes

## Key Screens
1. **Input screen**: Hero tagline + file upload/paste panels + compare CTA
2. **Results screen**: 3 stat cards + tabbed user list with search + export

## Constraints
- Must work entirely offline after load (no API calls for core function)
- localStorage for preferences (theme, dismissed users, input mode)
- Instagram HTML export parsing (links with instagram.com hrefs)
- Next.js 14 App Router, React 18, no external UI libraries
