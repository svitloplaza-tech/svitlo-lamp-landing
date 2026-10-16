// Cloudflare Pages Function: приймає замовлення і надсилає його в Telegram.
// Змінні середовища (Cloudflare → Settings → Variables): TG_TOKEN, TG_CHAT_ID
const esc = s => String(s ?? '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])).slice(0, 300);

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return new Response('bad json', { status: 400 }); }
  const phone = String(d.phone || '').replace(/[^\d+]/g, '');
  if (!/^\+380\d{9}$/.test(phone)) return new Response('bad phone', { status: 400 });
  if (!env.TG_TOKEN || !env.TG_CHAT_ID) return new Response('not configured', { status: 500 });

  const text = [
    '🛒 <b>Нове замовлення — світильник 60 см</b>',
    `📞 ${phone}`,
    d.name && `👤 ${esc(d.name)}`,
    d.np && `📦 НП: ${esc(d.np)}`,
    `🔢 ${Number(d.qty) || 1} шт · ${Number(d.sum) || ''} грн`,
    `💬 Зв'язок: ${esc(d.contact)}`,
    `📍 Джерело: ${esc(d.source) || 'прямий захід'}`,
    d.utm && `🏷 ${esc(d.utm)}`,
  ].filter(Boolean).join('\n');

  const r = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text, parse_mode: 'HTML' }),
  });
  return new Response(r.ok ? 'ok' : 'tg error', { status: r.ok ? 200 : 502 });
}
