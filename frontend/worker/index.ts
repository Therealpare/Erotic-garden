/**
 * Cloudflare Worker for eroticgardenchiangmai.com.
 *
 * Serves the Angular site (static assets) and one endpoint, POST /api/booking: a visit
 * request from the website form is checked and pushed to the garden's LINE Official
 * Account as an alert for staff (LINE Messaging API). Guests therefore don't need LINE
 * themselves — staff reply by email, WhatsApp/phone or LINE, whichever the guest gave.
 *
 * Nothing is stored here: the LINE message is the record.
 * Secrets (Worker → Settings → Variables and Secrets, never in this repo):
 *   LINE_CHANNEL_ACCESS_TOKEN — Messaging API channel access token (long-lived)
 *   LINE_ADMIN_USER_ID        — who receives alerts (user "U…" or group "C…" id)
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BOOKING_RATE_LIMIT?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  LINE_ADMIN_USER_ID?: string;
  /** Tests only: point the push at a fake LINE API. */
  LINE_API_BASE?: string;
}

export interface BookingRequest {
  name: string;
  visitDate: string;
  preferredTime: string;
  guestCount: number;
  email: string;
  phone: string;
  lineId: string;
  contactPreference: string;
  message: string;
  language: string;
  /** Honeypot: hidden from people, filled in by bots. */
  website: string;
}

const CONTACT_PREFERENCES = ['EMAIL', 'PHONE', 'WHATSAPP', 'LINE'];
const PREFERENCE_TH: Record<string, string> = { EMAIL: 'อีเมล', PHONE: 'โทรศัพท์', WHATSAPP: 'WhatsApp', LINE: 'LINE' };
const LANGUAGE_TH: Record<string, string> = { en: 'อังกฤษ', th: 'ไทย', de: 'เยอรมัน' };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s()-]{5,38}$/;

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/** Today's date (YYYY-MM-DD) in Thailand, where the garden is. */
function todayInThailand(now = new Date()): string {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

const text = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

/** Returns the cleaned request, or the name of the first invalid field. */
export function validateBooking(input: unknown, now = new Date()): BookingRequest | { invalid: string } {
  const body = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const request: BookingRequest = {
    name: text(body['name'], 120),
    visitDate: text(body['visitDate'], 10),
    preferredTime: text(body['preferredTime'], 5),
    guestCount: Number(body['guestCount']),
    email: text(body['email'], 255),
    phone: text(body['phone'], 40),
    lineId: text(body['lineId'], 60),
    contactPreference: text(body['contactPreference'], 10).toUpperCase(),
    message: typeof body['message'] === 'string' ? body['message'].trim().slice(0, 1000) : '',
    language: text(body['language'], 2),
    website: text(body['website'], 200),
  };
  if (request.name.length < 2) return { invalid: 'name' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.visitDate) || request.visitDate < todayInThailand(now)) return { invalid: 'visitDate' };
  if (request.preferredTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(request.preferredTime)) return { invalid: 'preferredTime' };
  if (!Number.isInteger(request.guestCount) || request.guestCount < 1 || request.guestCount > 50) return { invalid: 'guestCount' };
  if (request.email && !EMAIL.test(request.email)) return { invalid: 'email' };
  if (request.phone && !PHONE.test(request.phone)) return { invalid: 'phone' };
  if (!request.email && !request.phone && !request.lineId) return { invalid: 'contact' };
  if (!CONTACT_PREFERENCES.includes(request.contactPreference)) request.contactPreference = request.email ? 'EMAIL' : request.phone ? 'PHONE' : 'LINE';
  return request;
}

/** Short code the guest can quote, e.g. EG-1220-4K7Q (visit month/day + random). */
export function referenceCode(visitDate: string): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const random = crypto.getRandomValues(new Uint8Array(4));
  return `EG-${visitDate.slice(5, 7)}${visitDate.slice(8, 10)}-${Array.from(random, (byte) => alphabet[byte % alphabet.length]).join('')}`;
}

/** The alert staff read in LINE (always Thai labels; the guest's own words unchanged). */
export function alertText(booking: BookingRequest, reference: string): string {
  const [year, month, day] = booking.visitDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('th-TH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const details = [
    `รหัส: ${reference}`,
    `ชื่อ: ${booking.name}`,
    `วันที่มา: ${date}${booking.preferredTime ? ` เวลา ${booking.preferredTime}` : ''}`,
    `จำนวน: ${booking.guestCount} คน`,
    booking.email ? `อีเมล: ${booking.email}` : null,
    booking.phone ? `โทร/WhatsApp: ${booking.phone}` : null,
    booking.lineId ? `LINE ID: ${booking.lineId}` : null,
    `ติดต่อกลับทาง: ${PREFERENCE_TH[booking.contactPreference] ?? booking.contactPreference}`,
    `ภาษา: ${LANGUAGE_TH[booking.language] ?? (booking.language || '-')}`,
    booking.message ? `หมายเหตุ: ${booking.message}` : null,
  ].filter((line): line is string => line !== null);
  return ['🌿 คำขอจองเข้าชมสวน (จากเว็บไซต์)', ...details, '', 'กรุณาติดต่อลูกค้าเพื่อยืนยันการจอง'].join('\n').slice(0, 4900);
}

async function pushToLine(env: Env, message: string): Promise<boolean> {
  const token = env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  const to = env.LINE_ADMIN_USER_ID?.trim();
  if (!token || !to) {
    console.error('LINE alert not sent: LINE_CHANNEL_ACCESS_TOKEN or LINE_ADMIN_USER_ID is not set');
    return false;
  }
  try {
    const response = await fetch(`${env.LINE_API_BASE ?? 'https://api.line.me'}/v2/bot/message/push`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, messages: [{ type: 'text', text: message }] }),
    });
    if (!response.ok) console.error(`LINE push failed: HTTP ${response.status}`); // never log the token or body
    return response.ok;
  } catch {
    console.error('LINE push failed: network error');
    return false;
  }
}

async function handleBooking(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'method' });
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return json(415, { error: 'content-type' });

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.BOOKING_RATE_LIMIT && !(await env.BOOKING_RATE_LIMIT.limit({ key: ip })).success) {
    return json(429, { error: 'rate-limited' });
  }

  const raw = await request.text();
  if (raw.length > 8000) return json(413, { error: 'too-large' });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid', field: 'body' });
  }

  const booking = validateBooking(body);
  if ('invalid' in booking) return json(400, { error: 'invalid', field: booking.invalid });

  const reference = referenceCode(booking.visitDate);
  // Bots fill the hidden field: pretend success so they learn nothing, but send nothing.
  if (booking.website) return json(200, { reference });

  const sent = await pushToLine(env, alertText(booking, reference));
  return sent ? json(200, { reference }) : json(502, { error: 'not-delivered' });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/booking') return handleBooking(request, env);
    if (pathname.startsWith('/api/')) return json(404, { error: 'not-found' });
    return env.ASSETS.fetch(request);
  },
};
