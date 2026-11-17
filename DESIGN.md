---
version: alpha
name: gabriel-rangel-portfolio
description: "Dark, product-focused portfolio canvas for Gabriel Rangel (data and AI automation analyst). Deep petrol canvas (#07131a), pale cool-white text (#f2f8f9), a four-step surface ladder with hairline borders, and a single cyan-teal accent (#2bc4cf) used on links, focus ring, brand mark and highlighted headline words. The contact CTA is the one exception: a warm orange (#f97316) so it stands out from everything else. The Home hero fades from deep teal (#0f4a57) to the canvas. Display type is Inter at 600 with negative tracking set in em. Pages lead with live demos and dashboard screenshots framed in dark panels. Derived from a style analysis of a dark SaaS marketing site; accent hue, fonts and components were changed to pass WCAG contrast and to fit a portfolio."

colors:
  primary: "#2bc4cf"
  on-primary: "#07131a"
  primary-hover: "#4fd6df"
  primary-pressed: "#1fa7b1"
  cta: "#f97316"
  cta-hover: "#fb923c"
  cta-pressed: "#ea580c"
  header: "#0b1117"
  hero-top: "#0f4a57"
  ink: "#f2f8f9"
  ink-muted: "#c5d4d9"
  ink-subtle: "#8fa6ae"
  ink-disabled: "#5d7983"
  canvas: "#07131a"
  surface-1: "#0d1e27"
  surface-2: "#12272f"
  surface-3: "#172f39"
  surface-4: "#19323d"
  hairline: "#1d3541"
  hairline-strong: "#2a4756"
  input-border: "#5d7983"
  semantic-success: "#27a644"
  semantic-error: "#f87171"
  semantic-warning: "#fbbf24"
  overlay: "#03090d"

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

The site is a dark frame for Gabriel's work. `{colors.canvas}` (#07131a) anchors every page; hierarchy comes from a four-step surface ladder (`{colors.surface-1}` to `{colors.surface-4}`) and 1px hairlines, never from drop shadows. Text is `{colors.ink}` (#f2f8f9).

There is one chromatic accent, cyan-teal `{colors.primary}` (#2bc4cf), used for the primary CTA, text links, the focus ring and the brand mark. Success, error and warning colors exist only as feedback, never as decoration.

Every section leads with proof: a live demo, a dashboard capture or a short video, framed in `{colors.surface-1}` panels with `{rounded.xl}` corners. Marketing chrome stays minimal so the work carries the page.

The theme is dark only in v1. Tokens are named so a light theme can be added later without renaming.

**Key characteristics**
- Dark-only canvas, surface ladder and hairlines carry depth.
- One accent hue (184°); success green sits 50° away, error red and warning amber are separate and used only for feedback.
- Display type at weight 600 with negative tracking in em, body at 400.
- Cards use 12px corners (16px for demo and case frames), buttons 8px, tabs and tags pill.
- Gradients only in two places: the Home hero background (teal to canvas) and highlighted headline words (accent to a lighter accent). No glassmorphism. Orange (`cta`) is reserved for the contact button; it is not a second accent for links or decoration.

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
- **Input border** (`{colors.input-border}` #5d7983): input and select borders, 3.68:1 on surface-1.

### Text
- **Ink** (`{colors.ink}`): headlines and body, 19.6:1 on canvas.
- **Ink muted** (`{colors.ink-muted}`): secondary text, 13.0:1 on surface-1.
- **Ink subtle** (`{colors.ink-subtle}`): captions, footer, deselected tabs, 5.86:1 on surface-1. Minimum for any readable note.
- **Ink disabled** (`{colors.ink-disabled}`): disabled controls and decoration only. It measures about 3.4:1 to 3.7:1 and must not carry information.

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
- Max content width 1360px (was 1200px; raised so wide screens keep less empty canvas at the sides). Long text keeps its own 768px measure. Card grids are 3-up on desktop, 2-up at 1024px, 1-up below 768px.
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

No drop shadows or blur on surfaces; the only gradients are the hero background and headline highlight.

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
- **Case card.** Surface-1, 16px corners, preview image or video poster at the top, title, one line of challenge, type tag over the image, summary and stack tags. No synthetic-data badge on the card (the notice lives in the demo frame and in the technical layer).
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

## Proposta A (visual v2, 11/2026)

Camada editorial por cima dos tokens acima: as cores, o canvas e o acento continuam os mesmos; mudam a tipografia de títulos, o movimento e três componentes novos. Os efeitos abaixo são as únicas exceções às regras de "sem vidro, sem spotlight, sem pílula" e só valem onde estão listados.

**Tokens novos** (`globals.css`, `@theme`)
- `--ease-expressive: cubic-bezier(0.77, 0, 0.175, 1)` para revelações e entradas; `--ease-standard` continua nos hovers simples.
- `--color-line-soft: rgb(242 248 249 / 0.13)`: linhas finas das listas em linha, chips e bordas de card.
- `--color-glow` (0.26) e `--color-glow-strong` (0.38): brilho do CTA de vidro.
- `--color-glass: rgb(7 19 26 / 0.9)`: interior do CTA de vidro.
- `--color-stage-top: #0b1d27`: topo do palco do hero.
- `--color-tooltip: #0f2833`: fundo do tooltip do painel.

**Tipografia de títulos**
- Inter carregada como fonte variável (100 a 900).
- Títulos de página e de seção em peso 300, tracking -0.03em a -0.045em, `text-wrap: balance`. O nome do hero vai de 300 a 900 conforme a distância do cursor (só com mouse).
- O corpo de texto e os componentes continuam em 400 a 600.

**Componentes novos**
- `GlassCta`: pílula de vidro com borda girando (conic, 3,4 s), ícone redondo, rótulo e seta. Um por tela para a ação principal: hero ("Ver projetos"), CTA final e "Abrir app ao vivo" no case. Ref.: Lumina "Glow CTA pill" e Sora "Glass button motion" (ds.asimov.academy).
- `HeroStage` e `CasesPanel`: palco do hero (colunas com feixes caindo, lanterna no cursor, foto recortada) e painel com abas. O painel mostra só números publicados nos cases, com o gráfico certo para cada um: colunas (tempos do pipeline), intervalo (efeito e IC 95% do A/B) e linhas (projeção de 90 dias do CashLab). Nada de série com pontos inventados.
- `FinalCta`: seção de fechamento com moldura na cor do canvas que abre no hover ou foco do botão.
- `ProjectStage`: palco dos 3 melhores projetos na Home (seção fixa, cada projeto sai de cena por vez, capturas reais, número em laranja). Abaixo de 1024 px ou com movimento reduzido vira lista empilhada. Os demais destaques ficam numa grade logo depois.
- Navegação em vidro (`.nav-glass`): pílula com borda girando devagar e indicador de vidro que desliza até o item ativo (mesma linguagem do `GlassCta`).
- `RoleIcons`: ícones animados das especialidades do hero (barras, fluxo entre nós, balão digitando).
- `CountUp`: número que conta uma vez ao entrar na tela; o HTML já traz o valor final.
- Linhas com hover (Home e Serviços): lista separada por `line-soft`, hover com recuo de 16 px e degradê do acento a transparente.
- Card de case: 20px de raio, hover sobe 5 px com borda no acento e spotlight que segue o mouse.

**Movimento**
- Entrada de página: fade e 12 px de subida em 350 ms (`template.tsx`).
- Revelação ao rolar: `data-reveal` (opacidade, 18 px e blur de 6 px, 800 ms, uma vez). Só oculta o conteúdo quando há JS (classe `js` no `<html>`).
- Efeitos de cursor (peso das letras, lanterna, spotlight) só com `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion: reduce` desliga feixes, rotação do painel, contadores, borda girando e revelações; o conteúdo aparece direto.

**Cortado de propósito**
- Cursor seguidor com rótulo "Ver": não acrescentava informação e disputava com o spotlight dos cards.
- Palco de projetos fixo com rolagem longa do protótipo: na Home ficou a grade de cards, mais curta e acessível.

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
- Don't add gradients, glass or spotlight beyond the places listed in Proposta A (hero stage, GlassCta, FinalCta, case card hover, row hover). Orange stays for the contact CTA, plus the small warm accents of the hero (one beam color and the live dot).
- Don't color-code case types.
- Don't use ink-disabled for information.
- Don't use pill-shaped CTAs, except GlassCta.
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
