# Run The Day — Homepage Redesign

Premium redesign of the [Run The Day](https://www.runtheday.com/) marketing homepage.

Preserves the existing sports-editorial brand (black · gold · teal · Proxima Nova) while elevating layout, motion, product storytelling, and conversion UX.

## Stack

- Semantic HTML5
- Modular CSS design system (`css/design-system.css` + `css/styles.css`)
- Lightweight vanilla JS (`js/main.js`) — Intersection Observer, counters, form validation
- No framework build step required

## Run locally

```bash
# Any static server, e.g.
python3 -m http.server 8080
# then open http://localhost:8080
```

## Design system

- **Colors:** brand black (`#12121b`), gold (`#f0c94a`), teal (`#00efa9`)
- **Type:** Proxima Nova (Regular + Extrabold), Montserrat fallback
- **Spacing:** 8px scale via CSS custom properties
- **Cards:** Primary · Secondary · Feature · Glass · Metric
- **Elevation:** soft layered shadows (sm / md / lg / float)

## Accessibility

- Skip link, semantic landmarks, ARIA on nav/FAQ/forms
- Visible `:focus-visible` styles
- `prefers-reduced-motion` disables parallax, particles, and counters animate instantly
- Keyboard-friendly FAQ tabs and form validation
