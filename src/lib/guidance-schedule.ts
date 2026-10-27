import {
  GUIDANCE_BOOKING_LEAD_HOURS,
  GUIDANCE_BOOKING_MINUTE_SLOTS,
} from '@/config/guidance';

const LEAD_MS = GUIDANCE_BOOKING_LEAD_HOURS * 60 * 60 * 1000;

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function quarterHourTimes(): string[] {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of GUIDANCE_BOOKING_MINUTE_SLOTS) {
      times.push(`${pad(hour)}:${pad(minute)}`);
    }
  }
  return times;
}

export function formatSlotLabel(time: string): string {
  const [hourStr, minute] = time.split(':');
  const hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }
  let hour = Number(map.hour);
  if (hour === 24) hour = 0;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
  };
}

function offsetMs(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
  return asUtc - date.getTime();
}

export function zonedDateTimeToUtc(date: string, time: string, timeZone: string): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch || !isValidTimeZone(timeZone)) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const firstOffset = offsetMs(utcGuess, timeZone);
  let result = new Date(utcGuess.getTime() - firstOffset);
  const secondOffset = offsetMs(result, timeZone);
  if (secondOffset !== firstOffset) {
    result = new Date(utcGuess.getTime() - secondOffset);
  }

  const check = getZonedParts(result, timeZone);
  if (
    check.year !== year ||
    check.month !== month ||
    check.day !== day ||
    check.hour !== hour ||
    check.minute !== minute
  ) {
    return null;
  }
  return result;
}

function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

export function earliestBookableSlot(
  now = new Date(),
  timeZone = 'Asia/Kolkata',
): { date: string; time: string } {
  const threshold = now.getTime() + LEAD_MS;
  let date = (() => {
    const parts = getZonedParts(new Date(threshold), timeZone);
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
  })();

  for (let day = 0; day < 3; day += 1) {
    for (const time of quarterHourTimes()) {
      const utc = zonedDateTimeToUtc(date, time, timeZone);
      if (utc && utc.getTime() >= threshold) {
        return { date, time };
      }
    }
    date = addCalendarDays(date, 1);
  }

  return { date, time: '00:00' };
}

export function availableTimesForDate(
  date: string,
  timeZone: string,
  now = new Date(),
): string[] {
  if (!isValidTimeZone(timeZone)) return [];
  const threshold = now.getTime() + LEAD_MS;
  return quarterHourTimes().filter((time) => {
    const utc = zonedDateTimeToUtc(date, time, timeZone);
    return utc != null && utc.getTime() >= threshold;
  });
}

export function guidanceSlotError(
  date: string,
  time: string,
  timeZone: string,
  now = new Date(),
): string | null {
  const normalized = time.length === 8 && time.endsWith(':00') ? time.slice(0, 5) : time;
  const minute = Number(normalized.slice(3, 5));
  const onSlot = GUIDANCE_BOOKING_MINUTE_SLOTS.includes(
    minute as (typeof GUIDANCE_BOOKING_MINUTE_SLOTS)[number],
  );

  if (!/^\d{2}:\d{2}$/.test(normalized) || !onSlot) {
    return 'Please choose a time on the hour or at 15, 30, or 45 minutes.';
  }
  if (!isValidTimeZone(timeZone)) {
    return 'Please choose a valid timezone.';
  }
  if (!availableTimesForDate(date, timeZone, now).includes(normalized)) {
    return 'Calls can be booked at least 24 hours in advance.';
  }
  return null;
}
