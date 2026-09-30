/**
 * Cloudflare Pages Function behind the join form: POST /api/join.
 *
 * Validates the submission and stores it in the `JOIN_SUBMISSIONS` KV
 * namespace, one key per email so a double submit updates rather than
 * duplicates. Bind the namespace once in the Pages project settings
 * (Settings → Functions → KV namespace bindings). Without the binding the
 * endpoint answers 503 and the form shows its fallback message.
 *
 * Read the list with:
 *   npx wrangler kv key list --binding JOIN_SUBMISSIONS
 */

type KV = { put(key: string, value: string): Promise<void> };
type Context = { request: Request; env: { JOIN_SUBMISSIONS?: KV } };

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'];
const INTERESTS = ['Workshops', 'Leadership', 'Community', 'Professional Development'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function onRequestPost({ request, env }: Context) {
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

  const record = { name, email, year, major: text(data.major, 120), interests, newsletter: data.newsletter !== false, submittedAt: new Date().toISOString() };
  await env.JOIN_SUBMISSIONS.put(`signup:${email}`, JSON.stringify(record));
  return json({ ok: true });
}
