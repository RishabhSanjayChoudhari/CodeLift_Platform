import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { studentEmail, studentName, amount, paidAt, mode, courseName } = await req.json();

    if (!studentEmail || !studentName || !amount) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const result = await resend.emails.send({
      from: 'CodeLift <onboarding@resend.dev>',
      to: studentEmail,
      subject: `Fee Receipt — ₹${amount} received`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #15803D;">Fee Receipt</h2>
          <p>Dear ${studentName},</p>
          <p>We have received your payment. Thank you.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #6B7280;">Amount</td><td style="padding: 8px 0; font-weight: 600;">₹${amount}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Date</td><td style="padding: 8px 0;">${new Date(paidAt).toLocaleDateString('en-IN')}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Mode</td><td style="padding: 8px 0;">${mode}</td></tr>
            ${courseName ? `<tr><td style="padding: 8px 0; color: #6B7280;">Course</td><td style="padding: 8px 0;">${courseName}</td></tr>` : ''}
          </table>
          <p style="color: #6B7280; font-size: 13px;">This is an automated receipt. Keep it for your records.</p>
          <p>Best regards,<br/>CodeLift Team</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, id: result.data?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
