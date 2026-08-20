export type NewsletterLocale = 'sv' | 'en';

const COPY = {
  sv: {
    brand: 'Luggisarna',
    fromName: 'Luggisarna',
    subject: (title: string) => `Ny video: ${title}`,
    greetingNamed: (name: string) => `Hej ${name}!`,
    greeting: 'Hej!',
    intro: 'En ny film med Lila, Gul och Blå finns nu på YouTube.',
    fallbackBlurb:
      'Mjuk, förutsägbar barnmusik — utan prat och utan blinkande text.',
    cta: 'Titta på YouTube',
    closing:
      'Gjort med intryckskänsliga barn i åtanke. Sänk skärmen om ljuset känns starkt.',
    signoff: 'Kram från Luggisarna',
    footer: 'Du får det här mejlet för att du prenumererar på Luggisarnas nyhetsbrev.',
    unsub: 'Avsluta prenumeration',
    site: 'https://theluggies.com/sv',
    channel: 'https://www.youtube.com/@Luggisarna',
  },
  en: {
    brand: 'The Luggies',
    fromName: 'The Luggies',
    subject: (title: string) => `New video: ${title}`,
    greetingNamed: (name: string) => `Hi ${name}!`,
    greeting: 'Hi!',
    intro: 'A new film with Purple, Yellow and Blue is on YouTube.',
    fallbackBlurb:
      'Soft, predictable kids music — no talking, no flashing text.',
    cta: 'Watch on YouTube',
    closing:
      'Made with sensory-sensitive kids in mind. Turn the brightness down if the screen feels bright.',
    signoff: 'Love from The Luggies',
    footer: 'You are getting this because you subscribed to The Luggies newsletter.',
    unsub: 'Unsubscribe',
    site: 'https://theluggies.com/en',
    channel: 'https://www.youtube.com/@TheLuggies',
  },
} as const;

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function cleanBlurb(raw: string | undefined, locale: NewsletterLocale): string {
  const t = COPY[locale];
  if (!raw) return t.fallbackBlurb;
  let s = raw.replace(/\r/g, '');
  s = s.split(/\n{2,}/)[0] || s;
  s = s.split(/\n(?=Kapitel|Chapters|#)/i)[0] || s;
  s = s.replace(/#[\wÅÄÖåäö]+/g, '').replace(/\s+/g, ' ').trim();
  if (s.length > 220) s = s.slice(0, 217).trimEnd() + '…';
  return s || t.fallbackBlurb;
}

export function fromAddress(locale: NewsletterLocale): string {
  return `${COPY[locale].fromName} <hello@theluggies.com>`;
}

export function buildVideoEmail(opts: {
  locale: NewsletterLocale;
  name: string | null;
  title: string;
  description?: string;
  youtubeId: string;
  unsubscribeUrl: string;
}): {subject: string; html: string} {
  const t = COPY[opts.locale];
  const title = escapeHtml(opts.title);
  const blurb = escapeHtml(cleanBlurb(opts.description, opts.locale));
  const greeting = escapeHtml(
    opts.name ? t.greetingNamed(opts.name) : t.greeting
  );
  const videoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(opts.youtubeId)}`;
  const thumb = `https://img.youtube.com/vi/${encodeURIComponent(opts.youtubeId)}/hqdefault.jpg`;
  const unsub = escapeHtml(opts.unsubscribeUrl);

  const html = `<!DOCTYPE html>
<html lang="${opts.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#fff8e7;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;border:3px solid #fde047;">
          <tr>
            <td style="padding:28px 28px 8px 28px;text-align:center;background:#fffbeb;">
              <p style="margin:0;font-size:13px;letter-spacing:.08em;color:#b45309;font-family:Arial,sans-serif;text-transform:uppercase;">${escapeHtml(t.brand)}</p>
              <h1 style="margin:8px 0 0 0;color:#1f2937;font-size:26px;line-height:1.25;">${greeting}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0;color:#4b5563;font-size:17px;line-height:1.55;font-family:Arial,sans-serif;">${escapeHtml(t.intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0 28px;">
              <h2 style="margin:0;color:#1f2937;font-size:22px;line-height:1.3;">${title}</h2>
              <p style="margin:10px 0 0 0;color:#6b7280;font-size:15px;line-height:1.55;font-family:Arial,sans-serif;">${blurb}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px 28px;">
              <a href="${videoUrl}" style="display:block;text-decoration:none;">
                <img src="${thumb}" alt="${title}" width="504" style="width:100%;height:auto;border-radius:14px;display:block;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px 28px;text-align:center;">
              <a href="${videoUrl}" style="display:inline-block;background:#facc15;color:#1f2937;padding:14px 28px;text-decoration:none;border-radius:9999px;font-weight:bold;font-size:16px;font-family:Arial,sans-serif;">${escapeHtml(t.cta)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px 28px;">
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.55;font-family:Arial,sans-serif;">${escapeHtml(t.closing)}</p>
              <p style="margin:16px 0 0 0;color:#1f2937;font-size:16px;font-family:Arial,sans-serif;">${escapeHtml(t.signoff)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#fffbeb;border-top:1px solid #fde68a;font-family:Arial,sans-serif;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
                ${escapeHtml(t.footer)}<br/>
                <a href="${unsub}" style="color:#9ca3af;">${escapeHtml(t.unsub)}</a>
                · <a href="${t.site}" style="color:#9ca3af;">${escapeHtml(t.brand)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {subject: t.subject(opts.title), html};
}

export function buildWelcomeEmail(opts: {
  locale: NewsletterLocale;
  confirmUrl: string;
  unsubscribeUrl: string;
}): {subject: string; html: string; from: string} {
  const isSv = opts.locale === 'sv';
  const brand = isSv ? 'Luggisarna' : 'The Luggies';
  const subject = isSv ? 'Välkommen till Luggisarna' : 'Welcome to The Luggies';
  const html = isSv
    ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff8e7;">
        <h1 style="color:#1f2937;text-align:center;">Välkommen till Luggisarna</h1>
        <p style="color:#4b5563;line-height:1.6;">Tack för att du vill ha mejl när Lila, Gul och Blå släpper en ny film.</p>
        <p style="color:#4b5563;line-height:1.6;">Klicka här om du vill lägga till ditt namn:</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${escapeHtml(opts.confirmUrl)}" style="background:#facc15;color:#1f2937;padding:12px 24px;text-decoration:none;border-radius:9999px;font-weight:bold;display:inline-block;">Komplettera ditt namn</a>
        </p>
        <p style="color:#4b5563;line-height:1.6;">Kram från Luggisarna</p>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          <a href="${escapeHtml(opts.unsubscribeUrl)}" style="color:#9ca3af;">Avsluta prenumeration</a>
        </p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff8e7;">
        <h1 style="color:#1f2937;text-align:center;">Welcome to The Luggies</h1>
        <p style="color:#4b5563;line-height:1.6;">Thanks for signing up. We email when Purple, Yellow and Blue have a new film.</p>
        <p style="color:#4b5563;line-height:1.6;">Add your name if you like:</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${escapeHtml(opts.confirmUrl)}" style="background:#facc15;color:#1f2937;padding:12px 24px;text-decoration:none;border-radius:9999px;font-weight:bold;display:inline-block;">Add your name</a>
        </p>
        <p style="color:#4b5563;line-height:1.6;">Love from The Luggies</p>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          <a href="${escapeHtml(opts.unsubscribeUrl)}" style="color:#9ca3af;">Unsubscribe</a>
        </p>
      </div>`;
  return {subject, html, from: `${brand} <hello@theluggies.com>`};
}
