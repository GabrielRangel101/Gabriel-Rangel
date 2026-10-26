---
version: alpha
name: gabriel-rangel-portfolio
description: "Dark, product-focused portfolio canvas for Gabriel Rangel (data and AI automation analyst). Near-black canvas (#010102), light gray text (#f7f8f8), a four-step surface ladder with hairline borders, and a single cyan-teal accent (#2bc4cf) used only on the primary CTA, links, focus ring and brand mark. Display type is Inter at 600 with negative tracking set in em. Pages lead with live demos and dashboard screenshots framed in dark panels. Derived from a style analysis of a dark SaaS marketing site; accent hue, fonts and components were changed to pass WCAG contrast and to fit a portfolio."

colors:
  primary: "#2bc4cf"
  on-primary: "#010102"
  primary-hover: "#4fd6df"
  primary-pressed: "#1fa7b1"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-disabled: "#62666d"
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  input-border: "#62666d"
  semantic-success: "#27a644"
  semantic-error: "#f87171"
  semantic-warning: "#fbbf24"
  overlay: "#000000"

typography:
  display-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.0375em
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.032em
  display-md:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.025em
  headline:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.021em
  card-title:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.018em
  subhead:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.006em
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.003em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.03em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    minHeight: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    minHeight: 40px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    minHeight: 40px
  filter-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
    minHeight: 36px
  filter-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
    minHeight: 36px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  case-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  demo-frame:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: 16px
  type-tag:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  synthetic-data-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    minHeight: 44px
  chat-bubble-agent:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
  chat-bubble-user:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
  code-block:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: 16px
  accordion-item:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 16px 0
    minHeight: 44px
  skeleton:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  form-message-error:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.semantic-error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  timeline-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

The site is a dark frame for Gabriel's work. `{colors.canvas}` (#010102) anchors every page; hierarchy comes from a four-step surface ladder (`{colors.surface-1}` to `{colors.surface-4}`) and 1px hairlines, never from drop shadows. Text is `{colors.ink}` (#f7f8f8).

There is one chromatic accent, cyan-teal `{colors.primary}` (#2bc4cf), used for the primary CTA, text links, the focus ring and the brand mark. Success, error and warning colors exist only as feedback, never as decoration.

Every section leads with proof: a live demo, a dashboard capture or a short video, framed in `{colors.surface-1}` panels with `{rounded.xl}` corners. Marketing chrome stays minimal so the work carries the page.

The theme is dark only in v1. Tokens are named so a light theme can be added later without renaming.

**Key characteristics**
- Dark-only canvas, surface ladder and hairlines carry depth.
- One accent hue (184°); success green sits 50° away, error red and warning amber are separate and used only for feedback.
- Display type at weight 600 with negative tracking in em, body at 400.
- Cards use 12px corners (16px for demo and case frames), buttons 8px, tabs and tags pill.
- No gradients, no glassmorphism, no second accent, no decorative color.

## Colors

### Accent
- **Primary** (`{colors.primary}` #2bc4cf): primary button fill, links, focus ring, brand mark. Dark text on it has 9.84:1.
- **Primary hover** (`{colors.primary-hover}` #4fd6df): hovered button fill.
- **Primary pressed** (`{colors.primary-pressed}` #1fa7b1): pressed button fill, 7.17:1 with dark text.
- As text, the accent measures 9.84:1 on canvas and 8.98:1 on surface-1, so links need no separate variant.

### Surface
- **Canvas** (`{colors.canvas}`): page background.
- **Surface 1** (`{colors.surface-1}`): cards, demo frames, inputs, code blocks.
- **Surface 2** (`{colors.surface-2}`): selected tabs, tags, agent bubbles, skeletons, hovered cards.
- **Surface 3** (`{colors.surface-3}`): user chat bubbles, dropdowns, sub-nav.
- **Surface 4** (`{colors.surface-4}`): deepest lifted surface, used rarely.
- **Hairline** (`{colors.hairline}`): card and divider borders (decorative, 1.2:1 to 1.4:1 by design).
- **Hairline strong** (`{colors.hairline-strong}`): hovered card borders.
- **Input border** (`{colors.input-border}` #62666d): input and select borders, 3.30:1 on surface-1.

### Text
- **Ink** (`{colors.ink}`): headlines and body, 19.6:1 on canvas.
- **Ink muted** (`{colors.ink-muted}`): secondary text, 13.0:1 on surface-1.
- **Ink subtle** (`{colors.ink-subtle}`): captions, footer, deselected tabs, 5.86:1 on surface-1. Minimum for any readable note.
- **Ink disabled** (`{colors.ink-disabled}`): disabled controls and decoration only. It measures 3.30:1 to 3.62:1 and must not carry information.

### Feedback
- **Success** (`{colors.semantic-success}`): confirmations, 6.01:1 on surface-1.
- **Error** (`{colors.semantic-error}` #f87171): validation and failure messages, 6.89:1 on surface-1.
- **Warning** (`{colors.semantic-warning}` #fbbf24): limits and cautions (for example the chat usage limit), 11.41:1 on surface-1.
- Feedback colors appear in text, icons and a 1px border. Never as a section background.

## Typography

Inter carries everything; JetBrains Mono carries code in the technical layer of cases. Load both with `next/font` using the `latin` subset and check accented Portuguese glyphs. If Geist is preferred, Geist Sans and Geist Mono are drop-in substitutes.

| Token | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -0.0375em | Home hero |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -0.032em | Section openers |
| `{typography.display-md}` | 40px | 600 | 1.15 | -0.025em | Case titles, sub-sections |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.021em | CTA banner, case section titles |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.018em | Card titles |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.01em | Lead paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.006em | Hero subhead |
| `{typography.body}` | 16px | 400 | 1.50 | -0.003em | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer, chat |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Tags and badges only |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | Buttons and tabs |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.03em | Section eyebrow |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Code blocks, data tokens |

**Principles**
- Tracking is in em so it scales when titles shrink on mobile.
- Weight 600 for display, 400 for body. No weight above 600.
- Caption (12px) is for tags and badges; notes and footers use body-sm.

## Layout

- Base unit 4px. Card padding 24px (`{spacing.lg}`); CTA banner padding 48px; section gap 96px on desktop, 64px on mobile.
- Max content width 1200px. Card grids are 3-up on desktop, 2-up at 1024px, 1-up below 768px.
- Demo frames span the content width and keep their aspect ratio.
- The dark canvas is the whitespace: sections separate by lifting onto surface-1 panels or by the 96px gap, not by borders.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | No border, no fill | Body text, hero, footer |
| 1 | `{colors.surface-1}` with 1px `{colors.hairline}` | Cards, demo frames, inputs, code |
| 2 | `{colors.surface-2}` with 1px `{colors.hairline-strong}` | Hovered cards, selected tabs, agent bubbles |
| 3 | `{colors.surface-3}` | Dropdowns, user bubbles |
| Focus | 2px solid `{colors.primary}`, offset 2px, 100% opacity | Any focused interactive element |

No drop shadows, gradients or blur on surfaces.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Accordion rows, timeline rows |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | Buttons, inputs, code blocks |
| `{rounded.lg}` | 12px | Feature cards, chat bubbles, CTA banner |
| `{rounded.xl}` | 16px | Case cards, demo frames |
| `{rounded.pill}` | 9999px | Filter tabs, type tags, badges |

## Components

- **Buttons.** Primary: accent fill, dark text. Secondary: surface-1 with hairline. Tertiary: text only. All 8px corners, minimum height 40px on desktop and 44px on touch. Never pill-shaped.
- **Filter tabs** (`/projetos`: Power BI, Looker, Web com IA, Agente / n8n, Sistemas). Pill shape, minimum height 36px on desktop and 44px on touch. Selected state lifts to surface-2.
- **Case card.** Surface-1, 16px corners, preview image or video poster at the top, title, one line of challenge, type tag, optional synthetic-data badge.
- **Demo frame.** Surface-1 panel around an iframe, video or chat. Always has a visible fallback link (open in new tab) and a "Dados sintéticos" badge when applicable.
- **Type tag.** Pill on surface-2 with text and a small icon. Case types are told apart by label and icon, never by color.
- **Inputs.** Surface-1, 1px `{colors.input-border}`, 8px corners, minimum height 44px, visible label above the field, helper or error text below in `{colors.semantic-error}` with an icon. Focus uses the global focus ring.
- **Chat (agent demo).** Agent bubble on surface-2, user bubble on surface-3, 12px corners, 14px text. Input row with a 44px field and a primary send button. Typing indicator is three dots on surface-2. Usage-limit message uses `{colors.semantic-warning}` text with an icon and a link to the contact form.
- **Code block.** Surface-1, 8px corners, mono 13px in ink-muted, horizontal scroll, copy button as an icon button with tooltip.
- **Accordion** (FAQ and technical layer of a case). 44px minimum row, chevron icon, content revealed without layout shift.
- **Skeleton.** Surface-2 blocks with the radius of the element they stand in for; no shimmer when `prefers-reduced-motion` is set.
- **CTA banner.** Surface-1, 12px corners, 48px padding, headline plus two buttons (primary and secondary).
- **Timeline row** (`/vagas`). Canvas background, 24px vertical padding, hairline bottom rule, date in caption on the left.
- **Top nav.** 56px sticky bar on canvas: wordmark left; Projetos, Vagas, Serviços, Sobre centered; primary button "Falar comigo" right. Below 768px the links collapse into a menu.
- **Footer.** Canvas, body-sm in ink-subtle, link columns for navegação, contato, GitHub, LinkedIn.

Not used in v1: pricing cards, customer logo tiles, testimonial cards (the site has no prices, no logos and no testimonials without authorization).

## Motion

- Duration tokens: 120ms for hover and press, 200ms for tabs and accordions, 280ms for overlays and route transitions. Easing `cubic-bezier(0.2, 0, 0, 1)`.
- Animate only opacity, transform and background-color. Never animate layout properties.
- With `prefers-reduced-motion: reduce`, replace movement with an instant change or an opacity fade, and stop autoplay.

## Do's and Don'ts

### Do
- Keep `{colors.canvas}` as the anchor surface and build depth with the surface ladder.
- Use the accent only for primary CTA, links, focus ring and brand mark.
- Put readable text on ink, ink-muted or ink-subtle only.
- Lead each section with a demo, capture or video.
- Show a visible label on every input and a recovery action on every error.
- Keep all tap targets at 40px or more on desktop and 44px on touch.

### Don't
- Don't ship a light theme in v1.
- Don't use the accent as a section background or card fill.
- Don't add a second accent, gradients, glassmorphism or spotlight effects.
- Don't color-code case types.
- Don't use ink-disabled for information.
- Don't use pill-shaped CTAs.
- Don't embed a dashboard with a light theme without framing it in a dark panel and checking the contrast around it.

## Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| Desktop-XL | 1440px | Default layout |
| Desktop | 1280px | 3-up grids |
| Tablet | 1024px | Grids go 2-up |
| Mobile-Lg | 768px | Nav collapses to a menu; filter tabs scroll horizontally |
| Mobile | 375px | Single column; no horizontal page scroll |

Display sizes scale fluidly: `display-xl` from 36px (375px viewport) to 80px (1280px and up), `display-lg` from 30px to 56px, `display-md` from 26px to 40px. Tracking stays in em so it scales with the size.

## Iteration Guide

1. Work on one component at a time and reference it by its `components:` token.
2. Decide the surface level before laying out a section.
3. Check any new text and background pair against 4.5:1 (3:1 for large text and UI boundaries) before adding a token.
4. Add variants as separate component entries.
5. Re-run the contrast table in this file whenever a color token changes.

## Known Gaps

- No light theme.
- Error and warning colors are defined for feedback text only; error and warning surfaces (banners) are not specified.
- Illustration and icon style are not specified; pick one icon library and keep stroke width consistent.
- Dashboards published on Lovable have their own themes; check each one before embedding it.
- Brand mark and photo for the hero are pending.
