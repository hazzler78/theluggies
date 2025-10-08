export const runtime = 'edge';

import {z} from 'zod';

const Body = z.object({
  token: z.string(),
  name: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {token, name} = Body.parse(data);

    const env = (globalThis as unknown as {DB: D1Database});
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Find subscriber by token
    const subscriber = await db.prepare(
      'SELECT id, email FROM newsletter_subscribers WHERE confirmation_token = ? AND confirmed = 0'
    )
      .bind(token)
      .first();

    if (!subscriber) {
      return new Response(JSON.stringify({ok: false, error: 'Invalid token'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Update with name and mark as confirmed
    await db.prepare(
      `UPDATE newsletter_subscribers 
       SET name = ?, confirmed = 1, confirmation_token = NULL, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(name, subscriber.id)
      .run();

    return new Response(JSON.stringify({ok: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return new Response(JSON.stringify({ok: false}), {
      status: 400,
      headers: {'Content-Type': 'application/json'}
    });
  }
}

