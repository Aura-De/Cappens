---
name: cappens-professional-ui
description: >-
  Refina la UI de Cappens Technology con acabado profesional B2B sin perder la
  paleta papel/piedra ni el delfín origami. Usar cuando pidan diseño profesional,
  estilo V_01, cambios en globals.css, modal/sección de contacto, tipografía,
  espaciado o "más profesional pero con color".
disable-model-invocation: true
---

# UI profesional Cappens

## Lo que no se negocia

- Mantener la familia **papel**: `--paper`, `--bg`, `--bg-hi` (grises cálidos); no sustituir por grises fríos tipo SaaS genérico.
- Mantener **Newsreader** (titulares) e **IBM Plex Sans** (cuerpo).
- No reemplazar la arquitectura del delfín SVG / `lib/cappens-markup.ts` salvo petición explícita.
- Priorizar cambios en `app/globals.css`; tocar `components/contact/` solo si hace falta estructura.

## Cómo subir el nivel profesional sin “quitar color”

1. **Jerarquía, no paleta nueva**: usar `--ink`, `--ink-2`, `--graphite`, `--accent` para contraste y CTAs; evitar muchos colores nuevos.
2. **Un solo acento visible**: botones primarios con `--graphite`; `--accent` con moderación (detalles, una línea, hover) — ~5% del viewport como máximo.
3. **Superficies**: preferir mate `--paper` / `--bg-hi` frente a cristal blanco fuerte; si hay `.glass-panel`, teñir con rgba basado en `--paper`, no blanco puro.
4. **Ritmo**: alinear padding, `max-width` y bordes con `.wrap`, `section`, `.service`.
5. **Bordes**: `--rule` 1px; 2–3px solo donde ya existe (p. ej. `.service`).
6. **Motion**: mantener `--ease`; sin animaciones “saltarinas”; respetar `prefers-reduced-motion`.

## Flujo en CSS

1. Leer `:root` y el bloque a tocar en `app/globals.css`.
2. Cambiar **tokens primero** (`:root`), luego componentes; no esparcir hex sueltos.
3. Contraste: `--ink` sobre `--bg`; textos pequeños `--ink-2` sobre `--bg-hi` lo más cerca posible de WCAG AA.
4. Tras cambios: `pnpm build` debe pasar; revisar nav, hero, `#contacto`, modal en ~375px y ~1280px.

## Contacto / modal

- Misma línea editorial: panel tipo papel + sombra suave (como `.stage`), no app oscura.
- Overlay del modal: `rgba(31, 30, 28, 0.35–0.45)` como máximo; panel con cristal teñido papel o `--bg-hi` mate.

## No hacer

- Acentos neón, gradientes morados, solo Inter, dark mode completo sin que lo pidan.
- Refactors grandes del markup estático sin necesidad.
- `git commit` / `git push` salvo que el usuario lo pida explícitamente.

## Tokens de referencia

| Token | Uso |
|-------|-----|
| `--paper` | Nav, footer, placa del delfín |
| `--bg` / `--bg-hi` | Profundidad de página |
| `--ink` / `--ink-2` | Texto |
| `--graphite` | CTA principal, bloque “pens”, selección |
| `--rule` | Separadores |
| `--accent` | Énfasis puntual |