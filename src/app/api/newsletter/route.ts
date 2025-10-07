import {z} from 'zod';

const Body = z.object({email: z.string().email()});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {email} = Body.parse(data);

    // TODO: integrate with a real provider (e.g., Resend, MailerLite, ConvertKit)
    // For now, just log and pretend success.
    console.log('Newsletter signup:', email);

    return new Response(JSON.stringify({ok: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });
  } catch {
    return new Response(JSON.stringify({ok: false}), {
      status: 400,
      headers: {'Content-Type': 'application/json'}
    });
  }
}


