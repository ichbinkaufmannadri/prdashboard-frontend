import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict, format } from 'date-fns';

interface RelativeTimeProps {
  iso?: string | null;
  className?: string;
}

export function RelativeTime({ iso, className }: RelativeTimeProps) {
  const [, tick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!iso) return <span className={className}>—</span>;

  const date = new Date(iso.endsWith('Z') || /[+-]\d\d:?\d\d$/.test(iso) ? iso : iso + 'Z');

  const relative = formatDistanceToNowStrict(date, { addSuffix: true })
    .replace('minutes', 'm')
    .replace('minute', 'm')
    .replace('hours', 'h')
    .replace('hour', 'h')
    .replace('days', 'd')
    .replace('day', 'd')
    .replace('months', 'mo')
    .replace('month', 'mo')
    .replace('years', 'y')
    .replace('year', 'y');

  return (
    <time dateTime={iso} title={format(date, 'PPpp')} className={className}>
      {relative}
    </time>
  );
}