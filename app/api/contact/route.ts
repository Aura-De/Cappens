import { NextResponse } from 'next/server';

/** TODO: conectar envío real cuando exista correo empresarial (Resend, SendGrid, etc.). */
const CONTACT_TO = process.env.CONTACT_TO;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message, company } = body as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ ok: false, error: 'Name required' }, { status: 400 });
  }
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ ok: false, error: 'Message required' }, { status: 400 });
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    company: typeof company === 'string' ? company.trim() : '',
    message: message.trim(),
    at: new Date().toISOString(),
    wouldSendTo: CONTACT_TO ?? '(CONTACT_TO not configured)',
  };

  if (process.env.NODE_ENV === 'development') {
    console.info('[contact stub]', payload);
  }

  return NextResponse.json({ ok: true });
}
