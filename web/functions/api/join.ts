/**
 * Cloudflare Pages Function behind the join form: POST /api/join.
 *
 * Validates the submission and stores it in the `JOIN_SUBMISSIONS` KV
 * namespace, one key per email so a double submit updates rather than
 * duplicates. The namespace is bound in wrangler.toml; without the binding the
 * endpoint answers 503 and the form shows its fallback message.
 *
 * Safety net: when RESEND_API_KEY is set, each stored signup also emails a
 * notification (SIGNUP_NOTIFY_TO / SIGNUP_NOTIFY_FROM override the defaults).
 * The email is best-effort and never blocks or fails the stored signup.
 *
 * Read the list with:
 *   npx wrangler kv key list --binding JOIN_SUBMISSIONS
 */

type KV = { put(key: string, value: string): Promise<void> };
type Env = {
  JOIN_SUBMISSIONS?: KV;
  RESEND_API_KEY?: string;
  SIGNUP_NOTIFY_TO?: string;
  SIGNUP_NOTIFY_FROM?: string;
};
type Context = {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
};

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'];
const INTERESTS = ['Workshops', 'Leadership', 'Community', 'Professional Development'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

type Signup = {
  name: string;
  email: string;
  year: string;
  major: string;
  interests: string[];
  newsletter: boolean;
  submittedAt: string;
};

async function notifySignup(env: Env, record: Signup) {
  if (!env.RESEND_API_KEY) return;
  const payload = {
    from: env.SIGNUP_NOTIFY_FROM ?? 'Chapter Notes <onboarding@resend.dev>',
    to: [env.SIGNUP_NOTIFY_TO ?? 'colorstk@umn.edu'],
    subject: `New join signup: ${record.name}`,
    text: [
      `Name: ${record.name}`,
      `Email: ${record.email}`,
      `Year: ${record.year || '—'}`,
      `Major: ${record.major || '—'}`,
      `Interests: ${record.interests.length ? record.interests.join(', ') : '—'}`,
      `Newsletter: ${record.newsletter ? 'yes' : 'no'}`,
      `Submitted: ${record.submittedAt}`,
    ].join('\n'),
  };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error('Signup notification failed', res.status, await res.text());
}

export async function onRequestPost({ request, env, waitUntil }: Context) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot: real people never see this field.
  if (text(data.company, 200)) return json({ ok: true });

  const name = text(data.name, 120);
  const email = text(data.email, 200).toLowerCase();
  if (!name || !EMAIL.test(email)) return json({ ok: false, error: 'Name and a valid email are required.' }, 422);

  const year = YEARS.includes(text(data.year, 20)) ? text(data.year, 20) : '';
  const interests = Array.isArray(data.interests) ? data.interests.filter((i): i is string => INTERESTS.includes(i as string)) : [];

  if (!env.JOIN_SUBMISSIONS) return json({ ok: false, error: 'Signups are not configured yet.' }, 503);

  const record: Signup = { name, email, year, major: text(data.major, 120), interests, newsletter: data.newsletter !== false, submittedAt: new Date().toISOString() };
  await env.JOIN_SUBMISSIONS.put(`signup:${email}`, JSON.stringify(record));
  waitUntil(notifySignup(env, record));
  return json({ ok: true });
}
