# Betrayal

A privacy-first Instagram unfollower tracker that works from the user's own exported account data instead of risky third-party logins. The product is positioned as a fast, focused utility with strong emotional branding and a simple user flow.

## Core promise

The app helps users discover who stopped following them without handing credentials to an external service. The experience is meant to feel direct, safe, and lightweight.

## Stack

- Next.js
- React
- JavaScript

## Project structure

- `src/app/` - route-level pages and app flow
- `src/components/` - reusable interface pieces
- `public/` - static assets
- `next.config.js` - framework configuration
- `betrayal.jsx` - local project reference file

## Local development

1. Install dependencies with `npm install`.
2. Run `npm run dev`.
3. Use `npm run build` and `npm run start` for production checks.
4. Run `npm run lint` before finalizing frontend changes.

## Notes

- This repo currently uses the package name `betrayal`.
- The strongest product message in this project is local-data safety: no third-party account access, no unnecessary trust tradeoff.
