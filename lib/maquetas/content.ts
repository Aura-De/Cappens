// Contenido compartido de Cappens para las maquetas (/maquetas/*).
// SOLO LECTURA para los agentes: si falta algo, crea textos locales en tu carpeta.
// Los datos marcados como `placeholder: true` son de ejemplo y deben verse como tales.

export const brand = {
  name: 'Cappens',
  fullName: 'Cappens Technology',
  claim: 'Software e inteligencia artificial hechos con capacidad y pensamiento.',
  claimWords: ['Capacidad', 'para construirlo.', 'Pensamiento', 'para hacerlo bien.'],
  lead:
    'Cappens diseña y desarrolla productos digitales a medida y soluciones de IA que se integran en tu negocio y resuelven problemas reales.',
  logo: {
    full: '/logo-cappens-nav-clean.png', // logotipo completo (delfín + texto)
    mark: '/logo-cappens-nav-dolphin.png', // solo el delfín
  },
  email: 'hola@cappens.example', // placeholder hasta tener correo real
} as const;

export const nav = [
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Cómo trabajamos', href: '#proceso' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
] as const;

export const services = [
  {
    id: 'software',
    tag: '01',
    title: 'Desarrollo de software',
    summary: 'Producto digital a medida, pensado para crecer con tu negocio.',
    items: [
      'Aplicaciones web y móviles',
      'Plataformas internas y APIs',
      'Integración con los sistemas que ya usas',
      'Mantenimiento y evolución continua',
    ],
  },
  {
    id: 'ia',
    tag: '02',
    title: 'Inteligencia artificial',
    summary: 'IA aplicada a tareas concretas, con resultados que se pueden medir.',
    items: [
      'IA integrada dentro de tu producto',
      'Análisis y predicción con tus propios datos',
      'Asistentes y agentes con modelos de lenguaje',
      'Automatización de procesos y documentos',
    ],
  },
] as const;

export const servicesIntro = {
  title: 'Dos áreas que se refuerzan entre sí.',
  subtitle: 'De la idea al producto funcionando.',
};

export const process = [
  { step: '01', title: 'Entender', text: 'Escuchamos el problema, revisamos tus datos y definimos qué significa que salga bien.' },
  { step: '02', title: 'Diseñar', text: 'Proponemos la solución más simple que cumple el objetivo, con alcance y plazos claros.' },
  { step: '03', title: 'Construir', text: 'Entregamos en ciclos cortos para que veas avances reales y puedas corregir el rumbo.' },
  { step: '04', title: 'Acompañar', text: 'Ponemos en marcha, medimos el resultado y seguimos mejorando el sistema contigo.' },
] as const;

export const stackTools = ['Gmail', 'Drive', 'WhatsApp', 'Telegram', 'Stripe', 'Supabase', 'HubSpot'] as const;

// Proyectos de ejemplo (no reales) para rellenar rejillas / carruseles.
export const projects = [
  { title: 'Agente de atención al cliente', area: 'IA', year: '2026', placeholder: true },
  { title: 'Plataforma interna de operaciones', area: 'Software', year: '2026', placeholder: true },
  { title: 'Clasificación automática de documentos', area: 'IA', year: '2025', placeholder: true },
  { title: 'App móvil para equipos de campo', area: 'Software', year: '2025', placeholder: true },
] as const;

export const contact = {
  title: 'Hablemos de tu proyecto.',
  lead: 'Cuéntanos tu proyecto y te respondemos lo antes posible.',
  endpoint: '/api/contact', // POST { name, email, company?, message } -> { ok: true }
};
