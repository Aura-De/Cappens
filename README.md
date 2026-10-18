# Cappens Technology (Next.js 16)

Sitio migrado desde `Cappens Technology.html`: navegación, delfín origami, secciones y animaciones.

## Getting Started

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para regenerar el markup desde el HTML fuente (en Descargas):

```bash
node scripts/extract-html.mjs "ruta/al/Cappens Technology.html"
node scripts/split-body.mjs
node scripts/generate-markup-module.mjs
node scripts/patch-contact-nav.mjs
```

## Formulario de contacto

El formulario (nav → modal + sección `#contacto` al final) envía a `POST /api/contact`. Por ahora es un **stub**: valida datos y responde `{ ok: true }`; en desarrollo hace `console.info` del payload.

Cuando tengas correo empresarial, configura envío real en `app/api/contact/route.ts` (p. ej. Resend/SendGrid) y define en `.env.local`:

```bash
CONTACT_TO=tu@empresa.com
# RESEND_API_KEY=re_...
```
