"use client";
import {useEffect, useMemo, useState} from 'react';
import {formatInTimeZone} from 'date-fns-tz';
import {useTranslations} from '@/contexts/LocaleContext';

function getNextSaturdayAt15Stockholm(now = new Date()) {
  const stockholmTz = 'Europe/Stockholm';
  const day = now.getUTCDay();
  // Calculate days until next Saturday (6). If today is Saturday and past 15:00 local, go to next week
  const daysUntilSaturday = (6 - day + 7) % 7;
  const candidate = new Date(now);
  candidate.setUTCDate(now.getUTCDate() + daysUntilSaturday);
  // Set to 15:00 Stockholm in UTC by formatting a local date string
  const dateStr = formatInTimeZone(candidate, stockholmTz, 'yyyy-MM-dd');
  const targetLocal = new Date(`${dateStr}T15:00:00`);
  // targetLocal is interpreted in local TZ; rebuild via timezone formatting to UTC timestamp
  const targetIso = formatInTimeZone(targetLocal, stockholmTz, "yyyy-MM-dd'T'HH:mm:ssXXX");
  return new Date(targetIso);
}

export function YouTubeSchedule() {
  const t = useTranslations('site');
  const [now, setNow] = useState(() => new Date());
  const target = useMemo(() => getNextSaturdayAt15Stockholm(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const when = formatInTimeZone(target, 'Europe/Stockholm', "EEE d MMM, HH:mm 'CET'");

  return (
    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5">
      <h3 className="text-lg font-semibold mb-2">{t('nextEpisode')}</h3>
      <p className="opacity-80 mb-3">{when}</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          {label: t('days'), value: days}, 
          {label: t('hours'), value: hours}, 
          {label: t('minutes'), value: minutes}, 
          {label: t('seconds'), value: seconds}
        ].map((i) => (
          <div key={i.label} className="rounded-xl bg-foreground text-background p-3">
            <div className="text-2xl font-bold tabular-nums">{i.value}</div>
            <div className="text-xs uppercase tracking-wide opacity-85">{i.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


