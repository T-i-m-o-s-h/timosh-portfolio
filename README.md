# timosh-portfolio

Personal portfolio for **Timosh R R** — Full Stack Developer.
Angular 20, no backend, deployed on Vercel.

**Live:** https://timosh-portfolio.vercel.app

---

## What's in it

A single-page site with a hand-written WebGL background and a set of small
Angular directives doing the interaction work.

**The background** (`src/app/components/background/`) is two GPU passes on one
canvas. The first draws a domain-warped fBm nebula — noise folded through itself
twice so the smoke never visibly tiles — and the second draws an additive
particle field where every particle derives its position in the vertex shader
from a fixed seed, so nothing is uploaded to the GPU after startup. Both react
to an eased pointer position and to scroll depth. No third-party 3D library.

It degrades in three steps: no WebGL falls back to a CSS gradient,
`prefers-reduced-motion` renders a single static frame, and a hidden tab stops
the render loop entirely.

**The directives** (`src/app/core/`) each do one thing and clean up after
themselves. All of them attach listeners via `NgZone.runOutsideAngular`, so
pointer and scroll traffic never triggers change detection.

| Directive | What it does |
| --- | --- |
| `appReveal` | Fades content in on scroll via `IntersectionObserver`, with a stagger delay passed as a CSS custom property |
| `appMagnetic` | Pulls buttons toward the cursor, springs back on leave |
| `appSpotlight` | Writes pointer position into `--mx` / `--my` so cards can light up under the cursor |
| `appTilt` | 3D tilt toward the pointer |
| `appCountUp` | Eased number count-up the first time a stat is seen |
| `appScramble` | Decodes section labels out of random glyphs |

**Theming.** Dark is the default because the site is built around the nebula;
the toggle in the nav switches to light and the choice is remembered. An inline
script in `index.html` stamps `data-theme` on `<html>` before the first paint,
so a returning light-mode visitor never sees a dark flash. Light is not an
inversion: the accents are darkened to hold contrast on a pale ground, cards
become frosted white, the grain multiplies instead of overlaying, and the
shader subtracts a tint from near-white rather than adding glow to near-black.

Note for future component styles: `:root[data-theme='light'] .thing` does *not*
work inside a component's SCSS. Angular's emulated encapsulation prefixes the
leading `:root` with the component's content attribute, producing a selector
that can never match `<html>`. Use `:host-context([data-theme='light'])`.

**Ink tokens.** `--ink` / `--ink-soft` / `--ink-mute` / `--ink-label` are text
and all clear WCAG AA (4.5:1) in both themes. `--ink-faint` is decorative only
— outline strokes, timeline dots, the scrollbar — and is set against the 3:1
large-text threshold, since the outline type it draws is 174px. Don't use
`--ink-faint` for small text.

**Content** lives in one typed module, `src/app/core/resume.data.ts`. Editing the
site means editing that file — nothing is hardcoded into templates.

**The résumé** is served from `public/Timosh_R_R_Resume.pdf` and linked from three
places (hero, contact card, mobile menu) via `PROFILE.resume`. To update it,
replace that file — the filename the visitor saves is `PROFILE.resumeFile`.

## Running it

```bash
npm install
npm start          # http://localhost:4321
npm run build      # -> dist/timosh-portfolio/browser
```

Requires Node 20.19+ (22 recommended — see `.nvmrc`).

## Deploying

Vercel picks up `vercel.json`: build with `npm run build`, serve
`dist/timosh-portfolio/browser`, rewrite everything to `index.html`, and set
long-lived cache headers on hashed assets plus a few security headers.

Any push to `main` redeploys.

## Accessibility

Real landmarks and heading order, a skip link, visible focus rings, `aria-expanded`
on the timeline accordion and mobile menu, `inert` on collapsed panels so hidden
content stays out of the tab order, and full `prefers-reduced-motion` handling —
every animation in the site has an off switch.

The custom cursor only activates for a fine pointer, and the native cursor is
only hidden once it does.

## Layout

```
src/
  app/
    components/     background (WebGL), cursor, nav, rail, preloader, section-heading
    core/           resume data, directives, scroll + pointer services
    sections/       hero, about, experience, skills, projects, contact
  styles/           tokens, base, utilities
```
