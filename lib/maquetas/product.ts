// Contenido del PRODUCTO Cappens (mini CRM editable) para las maquetas.
// SOLO LECTURA para los agentes. Lo que sea de ejemplo va marcado como tal.

export const product = {
  name: 'Cappens',
  category: 'Empleados digitales + CRM a medida',
  heroTitle: ['Empleados digitales infinitos.', 'Un CRM que es tuyo.'],
  heroLead:
    'Cappens te da un equipo de empleados digitales que trabaja 24/7 dentro de un CRM hecho a tu medida. Ves todo lo que hacen, cliente por cliente, y lo ajustas cuando quieras.',
  heroCta: { primary: 'Pide tu demo', secondary: 'Ver cómo trabajan' },
  revealHint: 'Pasa el cursor para ver a tu equipo digital trabajando',
  before: ['Clientes_final_v3.xlsx', '43 correos sin leer', '27 chats sin responder', 'Presupuesto ¿enviado?', 'Reunión sin acta'],
} as const;

// Lo que nos diferencia: no solo empleados IA, sino el sistema donde trabajan y que controlas.
export const beyond = {
  title: 'Más allá de un asistente.',
  lead: 'Otros te dan empleados IA que trabajan a ciegas. Con Cappens trabajan dentro de tu CRM: cada acción queda registrada, enlazada a su cliente y bajo tu control.',
  rows: [
    { label: 'Empleados digitales', others: 'Un paquete cerrado', cappens: 'Infinitos, creas los que necesites' },
    { label: 'Dónde trabajan', others: 'En tus apps, sin trazabilidad', cappens: 'Dentro de tu CRM, con historial por cliente' },
    { label: 'Tu sistema', others: 'El que ya tenías', cappens: 'CRM a medida: tus campos, etapas y módulos' },
    { label: 'Control', others: 'Confías y esperas', cappens: 'Apruebas, corriges y ves métricas en vivo' },
    { label: 'Hardware', others: 'Una caja en tu oficina', cappens: 'Nada que instalar: en la nube y en tu móvil' },
  ],
} as const;

// Empleados digitales de ejemplo (nombres ficticios). Se pueden crear infinitos.
export const employees = [
  { id: 'lia', name: 'Lía', role: 'Atención al cliente', skill: 'Responde correos y WhatsApp, y abre incidencias.', color: 'sage' },
  { id: 'teo', name: 'Teo', role: 'Ventas', skill: 'Cualifica leads, mueve oportunidades y prepara propuestas.', color: 'sand' },
  { id: 'vera', name: 'Vera', role: 'Agenda', skill: 'Coordina reuniones, envía recordatorios y redacta actas.', color: 'sky' },
  { id: 'max', name: 'Max', role: 'Cobros', skill: 'Emite facturas, persigue pagos y concilia cobros.', color: 'clay' },
  { id: 'iris', name: 'Iris', role: 'Análisis', skill: 'Cruza ventas y soporte y te avisa de lo importante.', color: 'stone' },
  { id: 'nuevo', name: '+ Nuevo', role: 'El que necesites', skill: 'Describe la tarea y Cappens crea un empleado nuevo.', color: 'ink' },
] as const;

// Feed de actividad de ejemplo: lo que hacen los empleados dentro del CRM (datos ficticios)
export const activity = [
  { who: 'Lía', what: 'respondió a Clínica Arce sobre el cambio de cita', where: 'Contactos', t: 'hace 1 min' },
  { who: 'Teo', what: 'movió Estudio Brisa a Propuesta y adjuntó el presupuesto', where: 'Pipeline', t: 'hace 3 min' },
  { who: 'Vera', what: 'agendó reunión con Taller Norte el jueves 10:00', where: 'Agenda', t: 'hace 6 min' },
  { who: 'Max', what: 'recordó el pago pendiente a Panadería Lumen (1.800 €)', where: 'Facturas', t: 'hace 9 min' },
  { who: 'Iris', what: 'detectó 3 clientes sin compras en 60 días', where: 'Informes', t: 'hace 12 min' },
  { who: 'Teo', what: 'pide tu aprobación para enviar la propuesta a Academia Delta', where: 'Aprobaciones', t: 'ahora', approval: true },
] as const;

// Historia con scroll (estilo Necora): cada beat aparece y se va mientras el CRM se monta.
export const story = [
  {
    id: 'caos',
    kicker: 'Hoy',
    title: 'Tu semana se va en correos, chats y hojas de cálculo.',
    text: 'Cada cliente vive en un sitio distinto y cada tarea depende de que alguien se acuerde. Algo siempre se escapa.',
  },
  {
    id: 'orden',
    kicker: 'Con Cappens',
    title: 'Todo tu negocio en un CRM hecho a tu medida.',
    text: 'Contactos, oportunidades, agenda y facturas en un solo sitio, con tus campos, tus etapas y tus módulos.',
  },
  {
    id: 'equipo',
    kicker: 'Tu equipo digital',
    title: 'Y un equipo de empleados digitales trabajando dentro.',
    text: 'Responden, agendan, cobran y venden mientras tú decides. Cada acción queda registrada en su cliente y puedes aprobarla o corregirla.',
  },
] as const;

export const storyFinale = {
  title: 'Empleados del mes. Infinitos.',
  text: 'Crea los que necesites. Trabajan 24/7 y se actualizan solos.',
};

// Módulos activables del mini CRM
export const modules = [
  { id: 'contactos', name: 'Contactos', desc: 'Fichas de clientes y empresas con todo su historial.', core: true },
  { id: 'pipeline', name: 'Pipeline de ventas', desc: 'Oportunidades por etapas, arrastrando tarjetas.', core: true },
  { id: 'tareas', name: 'Tareas y recordatorios', desc: 'Seguimientos que no se olvidan.', core: true },
  { id: 'presupuestos', name: 'Presupuestos y facturas', desc: 'Del presupuesto a la factura en un clic.', core: false },
  { id: 'agenda', name: 'Agenda', desc: 'Citas y reuniones sincronizadas con tu calendario.', core: false },
  { id: 'soporte', name: 'Soporte', desc: 'Incidencias y peticiones de clientes con su estado.', core: false },
  { id: 'informes', name: 'Informes', desc: 'Ventas, conversión y previsión de un vistazo.', core: false },
  { id: 'ia', name: 'Asistente IA', desc: 'Resume conversaciones, propone el siguiente paso y redacta respuestas.', core: false },
] as const;

// Etapas y tarjetas de ejemplo para la demo del pipeline (datos ficticios)
export const demoPipeline = {
  stages: ['Nuevo', 'Contactado', 'Propuesta', 'Ganado'],
  deals: [
    { id: 'd1', company: 'Panadería Lumen', contact: 'Marta R.', value: 1800, stage: 'Nuevo' },
    { id: 'd2', company: 'Clínica Arce', contact: 'Dr. Vidal', value: 4200, stage: 'Contactado' },
    { id: 'd3', company: 'Taller Norte', contact: 'Iker S.', value: 950, stage: 'Nuevo' },
    { id: 'd4', company: 'Estudio Brisa', contact: 'Laura P.', value: 3100, stage: 'Propuesta' },
    { id: 'd5', company: 'Academia Delta', contact: 'Jon M.', value: 2600, stage: 'Ganado' },
  ],
  placeholder: true,
} as const;

// Qué incluye
export const includes = [
  { title: 'Empleados digitales ilimitados', text: 'Crea uno por tarea: atención, ventas, agenda, cobros, análisis o lo que necesites.' },
  { title: 'CRM a tu medida', text: 'Campos, etapas, módulos y permisos configurados contigo.' },
  { title: 'Importación de tus datos', text: 'Traemos tus clientes desde Excel, Google Sheets u otro CRM.' },
  { title: 'Conectado a todo', text: 'Correo, calendario, WhatsApp, facturación, documentos y lo que ya usas.' },
  { title: 'Aprobaciones y trazabilidad', text: 'Decides qué hacen solos y qué te piden antes. Todo queda en el historial.' },
  { title: 'Panel en vivo', text: 'Qué ha hecho cada empleado, cuánto tiempo te ha ahorrado y qué está pendiente.' },
  { title: 'Puesta en marcha y soporte', text: 'Lo configuramos contigo y lo ajustamos cuando tu negocio cambia.' },
  { title: 'Una cuota mensual', text: 'Empleados, CRM, actualizaciones y soporte en un único precio.' },
] as const;

// Qué puedes pedirle a tu equipo Cappens (por tipo de negocio)
export const useCases = [
  { sector: 'Agencia', ask: 'Lía, contesta a los clientes que llevan más de 24 h esperando.', result: 'Respuestas enviadas y registradas en cada ficha.' },
  { sector: 'Clínica', ask: 'Vera, confirma las citas de mañana y recoloca las anuladas.', result: 'Agenda llena y recordatorios por WhatsApp.' },
  { sector: 'Inmobiliaria', ask: 'Teo, cualifica los leads del portal y agenda visitas.', result: 'Leads puntuados y visitas en el calendario.' },
  { sector: 'Taller', ask: 'Max, factura las reparaciones terminadas y reclama lo pendiente.', result: 'Facturas emitidas y cobros en seguimiento.' },
  { sector: 'Academia', ask: 'Iris, dime qué alumnos tienen pagos o asistencia en riesgo.', result: 'Informe semanal con acciones sugeridas.' },
  { sector: 'Distribuidora', ask: 'Crea un empleado que prepare los pedidos recurrentes cada lunes.', result: 'Nuevo empleado activo en 2 minutos.' },
] as const;

export const productCta = {
  title: 'Pide tu demo y conoce a tu equipo digital.',
  lead: 'Cuéntanos cómo trabajas y te preparamos una demo de Cappens con tu CRM y tus primeros empleados digitales.',
  endpoint: '/api/contact', // POST { name, email, company?, message } -> { ok: true }
};
