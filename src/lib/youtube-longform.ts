/** YouTube helpers. Shorts stay on the channel; the site and newsletter only show 16:9 longform. */

export function isoDurationToSeconds(iso: string | undefined): number {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!m) return 0;
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
}

export function isYouTubeShort(opts: {durationIso?: string; title?: string}): boolean {
  const sec = isoDurationToSeconds(opts.durationIso);
  if (sec > 0 && sec < 61) return true;
  const t = (opts.title || '').toLowerCase();
  return t.includes('#shorts') || t.includes('#short');
}
