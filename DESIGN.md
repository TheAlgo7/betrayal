# Betrayal — Design System

## Colors (OKLCH)

### Dark mode (default)
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `oklch(12% 0.015 330)` | Page background |
| `--surface` | `oklch(18% 0.02 330)` | Cards, panels, header |
| `--surface-raised` | `oklch(22% 0.02 330)` | Hover states, dropdowns |
| `--fg` | `oklch(98% 0.005 330)` | Primary text |
| `--muted` | `oklch(60% 0.02 330)` | Secondary text, placeholders |
| `--border` | `oklch(28% 0.02 330)` | Default borders |
| `--border-strong` | `oklch(40% 0.02 330)` | Hover borders, emphasis |
| `--accent` | `oklch(60% 0.25 330)` | Magenta — primary CTA, brand |
| `--accent-hover` | `oklch(65% 0.25 330)` | Accent hover state |
| `--accent-subtle` | `oklch(25% 0.10 330)` | Accent backgrounds |
| `--success` | `oklch(65% 0.16 150)` | Mutuals, loaded state |
| `--danger` | `oklch(60% 0.18 25)` | Errors, dismiss |
| `--warn` | `oklch(75% 0.12 68)` | Fans, warnings |

### Light mode (`[data-theme="light"]`)
Inverted: light backgrounds, dark text, same accent hue but slightly darker (55% lightness).

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / headlines | Barlow Condensed | 900 | `clamp(52px, 9vw, 92px)` for hero; 44px results heading |
| UI labels / buttons | Barlow Condensed | 700 | 18–24px |
| Body | DM Sans | 400/500/600 | 15px base |
| Mono / usernames / tags | JetBrains Mono | 400/500 | 11–13px |

## Spacing
8px base unit. Sections: 24px–60px padding. Cards: 14–18px internal padding.

## Radius
`--radius-sm: 4px` | `--radius-md: 8px` | `--radius-lg: 12px` | `--radius-xl: 18px` | `--radius-full: 9999px`

## Shadows
OKLCH black-tinted. Dark mode uses strong shadows (0.35–0.60 alpha). Light mode uses subtle (0.06–0.14).

## Elevation model
- `--shadow-sm`: subtle depth (stat cards at rest)
- `--shadow-md`: interactive hover (compare button hover)
- `--shadow-lg`: floating surfaces (modals)

## Animations
- Duration: `--dur-fast: 120ms`, `--dur-base: 200ms`, `--dur-slow: 340ms`
- Easing: `--ease-out: cubic-bezier(0, 0, 0.2, 1)`, `--ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1)`
- Row entrance: `row-in` 280ms ease-out
- Modal entrance: opacity + translate 200ms ease-out
- Privacy dot pulse: 2.4s ease-in-out loop

## Component Patterns
- **Panel/card borders**: 1.5px for input panels, 1px for stat cards
- **Active states**: colored border + subtle glow ring (0 0 0 2px at 0.15 alpha)
- **Button primary**: accent fill, display font 700, 14–20px, radius-md
- **Button secondary/ghost**: surface-raised fill, border, body font 600
- **Monospace tags**: pill shape (radius-full), 11px mono, uppercase for labels
- **User list rows**: minimal — avatar initials circle, mono handle, action buttons right-aligned
