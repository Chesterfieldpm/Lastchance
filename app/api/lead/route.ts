import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LeadPayload = {
  email: string;
  name?: string;
  phone?: string;
  city?: string;
  units?: string;
  address?: string;
  notes?: string;
  toEmail?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (!body?.email) {
      return NextResponse.json({ ok: false, error: 'email_required' }, { status: 400 });
    }

    const to = body.toEmail || process.env.LEADS_TO_EMAIL || 'brandon@chesterfieldgroup.ca';
    const subject = `New Rent Analysis Lead — ${body.city || 'City'} — ${body.email}`;
    const html = `<h2>New Rent Analysis Lead</h2>
<table border='1' cellpadding='6' cellspacing='0'>
<tr><td><b>Email</b></td><td>${body.email}</td></tr>
<tr><td><b>Name</b></td><td>${body.name || ''}</td></tr>
<tr><td><b>Phone</b></td><td>${body.phone || ''}</td></tr>
<tr><td><b>City</b></td><td>${body.city || ''}</td></tr>
<tr><td><b>Units</b></td><td>${body.units || ''}</td></tr>
<tr><td><b>Address</b></td><td>${body.address || ''}</td></tr>
<tr><td><b>Notes</b></td><td>${(body.notes || '').replace(/</g, '&lt;')}</td></tr>
<tr><td><b>Source</b></td><td>${body.source || 'web'}</td></tr>
</table>`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Leads <noreply@chesterfield.group>',
          to: [to],
          subject,
          html,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('Resend failed:', txt);
        return NextResponse.json({ ok: false, error: 'email_failed' }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    // Fallback if RESEND is not configured (still returns 200 so your form works)
    console.log('Lead (no RESEND configured) ->', { to, subject, body });
    return NextResponse.json({ ok: true, note: 'resend_not_configured' });
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }
}
