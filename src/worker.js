// minnier-family Worker
// Serves the static site from ./public (the Minnier Legacy site and /WhiteHouse/),
// plus one API route for the household hub:
//
//   GET /WhiteHouse/api/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD
//
// CALENDAR_V1 (2026-11-08, WhiteHouse Build Spec section 6): the family Google Calendar is
// public, so it is read from its public iCal feed by ID alone (no keys). Google is the
// record; nothing is stored. The route answers only signed-in family members (Supabase
// session checked against whitehouse.my_key), because the hub is private even though
// the feed is not. Read-only.

const CAL_ID = 'family11574325909658758561@group.calendar.google.com';
const FEED = 'https://calendar.google.com/calendar/ical/' + encodeURIComponent(CAL_ID) + '/public/basic.ics';
const SUPABASE_URL = 'https://dmajuxcquifpoflzggol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_E6ALn_PDACsAMXB5owuvvQ_MaV637OU'; // public key
const HOME_TZ = 'America/Phoenix';
const FEED_TTL_S = 300;
const MAX_RANGE_DAYS = 62;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/WhiteHouse/api/calendar') return calendarRoute(request, url, ctx);
    return env.ASSETS.fetch(request);
  },
};

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' }, extra || {}),
  });
}

async function isFamily(request) {
  const auth = request.headers.get('Authorization') || '';
  if (!/^Bearer\s+\S+/.test(auth)) return false;
  const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/my_key', {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: auth, 'Content-Type': 'application/json', 'Content-Profile': 'whitehouse' },
    body: '{}',
  });
  if (!r.ok) return false;
  const key = await r.json().catch(() => null);
  return key === 'mike' || key === 'heather';
}

async function calendarRoute(request, url, ctx) {
  if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
  if (!(await isFamily(request))) return json({ error: 'not signed in' }, 401);
  const today = ymdInTz(Date.now(), HOME_TZ);
  const from = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('from') || '') ? url.searchParams.get('from') : today;
  const to = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('to') || '') ? url.searchParams.get('to') : addDays(from, 14);
  if (dayDiff(from, to) < 0 || dayDiff(from, to) > MAX_RANGE_DAYS) return json({ error: 'range too large' }, 400);
  let text;
  try { text = await getFeed(ctx); } catch (e) { return json({ error: 'calendar unavailable' }, 502); }
  const events = expand(parseICS(text), from, to);
  return json({ from, to, events });
}

async function getFeed(ctx) {
  const cache = caches.default;
  const key = new Request('https://cache.internal/wh-calendar-feed');
  const hit = await cache.match(key);
  if (hit) return hit.text();
  const r = await fetch(FEED, { headers: { Accept: 'text/calendar' } });
  if (!r.ok) throw new Error('feed ' + r.status);
  const text = await r.text();
  const store = new Response(text, { headers: { 'Content-Type': 'text/calendar', 'Cache-Control': 'max-age=' + FEED_TTL_S } });
  if (ctx && ctx.waitUntil) ctx.waitUntil(cache.put(key, store)); else await cache.put(key, store);
  return text;
}

// ---------------- iCal parsing ----------------
export function parseICS(text) {
  const lines = String(text).replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = { exdates: [] }; continue; }
    if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const i = line.indexOf(':'); if (i < 0) continue;
    const head = line.slice(0, i), value = line.slice(i + 1);
    const parts = head.split(';'); const name = parts[0].toUpperCase();
    const params = {}; parts.slice(1).forEach((p) => { const j = p.indexOf('='); if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, ''); });
    if (name === 'UID') cur.uid = value;
    else if (name === 'SUMMARY') cur.title = unescapeText(value);
    else if (name === 'LOCATION') cur.location = unescapeText(value);
    else if (name === 'STATUS') cur.status = value.toUpperCase();
    else if (name === 'DTSTART') cur.start = parseDate(value, params);
    else if (name === 'DTEND') cur.end = parseDate(value, params);
    else if (name === 'RRULE') cur.rrule = parseRule(value);
    else if (name === 'EXDATE') value.split(',').forEach((v) => { const d = parseDate(v, params); if (d) cur.exdates.push(d.ms); });
    else if (name === 'RECURRENCE-ID') cur.recurrenceId = parseDate(value, params);
  }
  return events.filter((e) => e.start && e.status !== 'CANCELLED');
}
function unescapeText(s) { return s.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim(); }
function parseRule(v) {
  const r = {}; v.split(';').forEach((kv) => { const [k, val] = kv.split('='); if (k) r[k.toUpperCase()] = val; });
  return {
    freq: r.FREQ, interval: Math.max(1, parseInt(r.INTERVAL || '1', 10) || 1), count: r.COUNT ? parseInt(r.COUNT, 10) : null,
    until: r.UNTIL ? parseDate(r.UNTIL, /^\d{8}$/.test(r.UNTIL) ? { VALUE: 'DATE' } : {}) : null,
    byday: r.BYDAY ? r.BYDAY.split(',').map((d) => d.replace(/^[+-]?\d+/, '')) : null,
    bymonthday: r.BYMONTHDAY ? r.BYMONTHDAY.split(',').map((n) => parseInt(n, 10)) : null,
    byhour: r.BYHOUR && !r.BYHOUR.includes(',') ? parseInt(r.BYHOUR, 10) : null,
    byminute: r.BYMINUTE && !r.BYMINUTE.includes(',') ? parseInt(r.BYMINUTE, 10) : null,
  };
}
// Returns { ms (UTC instant), allDay, tz, wall: {y,m,d,h,mi,s} }
export function parseDate(v, params) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(String(v).trim());
  if (!m) return null;
  const wall = { y: +m[1], m: +m[2], d: +m[3], h: +(m[4] || 0), mi: +(m[5] || 0), s: +(m[6] || 0) };
  if (params && params.VALUE === 'DATE' || !m[4]) return { allDay: true, tz: HOME_TZ, wall, ms: Date.UTC(wall.y, wall.m - 1, wall.d) };
  if (m[7] === 'Z') { const ms = Date.UTC(wall.y, wall.m - 1, wall.d, wall.h, wall.mi, wall.s); return { allDay: false, tz: 'UTC', wall, ms }; }
  const tz = (params && params.TZID) || HOME_TZ; // floating times are taken as home time
  return { allDay: false, tz, wall, ms: wallToUtc(wall, tz) };
}
function tzOffsetMs(ms, tz) {
  try {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ms;
  } catch (e) { return tzOffsetMs(ms, HOME_TZ); }
}
function wallToUtc(w, tz) {
  const guess = Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s);
  let ms = guess - tzOffsetMs(guess, tz);
  ms = guess - tzOffsetMs(ms, tz);
  return ms;
}
function ymdInTz(ms, tz) { return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date(ms)); }
function addDays(ymd, n) { const d = new Date(ymd + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function dayDiff(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000); }

// ---------------- recurrence expansion ----------------
const DOW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export function expand(events, from, to) {
  const out = [];
  const overrides = new Map(); // uid|originalStart -> true
  events.filter((e) => e.recurrenceId).forEach((e) => overrides.set(e.uid + '|' + e.recurrenceId.ms, true));
  const rangeStart = Date.parse(from + 'T00:00:00Z') - 2 * 86400000; // pad for time zones
  const rangeEnd = Date.parse(addDays(to, 1) + 'T00:00:00Z') + 2 * 86400000;
  for (const e of events) {
    const dur = e.end ? Math.max(0, e.end.ms - e.start.ms) : (e.start.allDay ? 86400000 : 3600000);
    const emit = (startW) => {
      const startMs = e.start.allDay ? Date.UTC(startW.y, startW.m - 1, startW.d) : (e.start.tz === 'UTC' ? Date.UTC(startW.y, startW.m - 1, startW.d, startW.h, startW.mi, startW.s) : wallToUtc(startW, e.start.tz));
      if (e.exdates.includes(startMs)) return;
      if (!e.recurrenceId && e.rrule && overrides.has(e.uid + '|' + startMs)) return;
      out.push(shape(e, startMs, dur));
    };
    if (!e.rrule || e.recurrenceId) { if (e.start.ms < rangeEnd && e.start.ms + dur > rangeStart) out.push(shape(e, e.start.ms, dur)); continue; }
    const r = e.rrule; const w0 = e.start.wall;
    const untilMs = r.until ? r.until.ms : Infinity;
    let n = 0, guard = 0;
    const base = new Date(Date.UTC(w0.y, w0.m - 1, w0.d));
    const step = (k) => { // k-th period start (UTC date at midnight of the wall date)
      const d = new Date(base);
      if (r.freq === 'DAILY') d.setUTCDate(d.getUTCDate() + k * r.interval);
      else if (r.freq === 'WEEKLY') d.setUTCDate(d.getUTCDate() + k * 7 * r.interval - d.getUTCDay()); // week starts Sunday
      else if (r.freq === 'MONTHLY') { d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + k * r.interval); }
      else if (r.freq === 'YEARLY') d.setUTCFullYear(d.getUTCFullYear() + k * r.interval);
      return d;
    };
    for (let k = 0; guard < 5000; k++) {
      const p = step(k);
      let days;
      if (r.freq === 'WEEKLY') {
        const by = r.byday && r.byday.length ? r.byday : [DOW[base.getUTCDay()]];
        days = by.map((dd) => { const x = new Date(p); x.setUTCDate(x.getUTCDate() + DOW.indexOf(dd)); return x; }).sort((a, b) => a - b);
      } else if (r.freq === 'MONTHLY') {
        const mdays = r.bymonthday || [w0.d];
        days = mdays.map((md) => { const x = new Date(p); const last = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate(); if (md > last) return null; x.setUTCDate(md); return x; }).filter(Boolean);
      } else days = [p];
      let past = false;
      for (const d of days) {
        guard++;
        const wall = { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: r.byhour != null ? r.byhour : w0.h, mi: r.byminute != null ? r.byminute : w0.mi, s: w0.s };
        const startMs = e.start.allDay ? Date.UTC(wall.y, wall.m - 1, wall.d) : (e.start.tz === 'UTC' ? Date.UTC(wall.y, wall.m - 1, wall.d, wall.h, wall.mi, wall.s) : wallToUtc(wall, e.start.tz));
        if (startMs < e.start.ms && !(wall.y === w0.y && wall.m === w0.m && wall.d === w0.d)) continue;
        if (startMs > untilMs || (r.count && n >= r.count)) { past = true; break; }
        n++;
        if (startMs >= rangeEnd) { past = true; break; }
        if (startMs + dur > rangeStart) emit(wall);
      }
      if (past || !['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(r.freq)) break;
    }
  }
  // keep only events that touch [from, to] in home time
  return out.filter((x) => x.endDay >= from && x.startDay <= to).sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
}
function shape(e, startMs, dur) {
  const allDay = e.start.allDay;
  const endMs = startMs + dur;
  const startDay = allDay ? new Date(startMs).toISOString().slice(0, 10) : ymdInTz(startMs, HOME_TZ);
  const endDay = allDay ? new Date(Math.max(startMs, endMs - 1)).toISOString().slice(0, 10) : ymdInTz(Math.max(startMs, endMs - 1), HOME_TZ);
  return { title: e.title || 'Busy', location: e.location || null, allDay, start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString(), startDay, endDay };
}
