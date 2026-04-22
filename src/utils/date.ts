const DAY_MS = 24 * 60 * 60 * 1000;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatLocalDate(date: Date): string {
  return (
    date.getFullYear() +
    "-" +
    pad2(date.getMonth() + 1) +
    "-" +
    pad2(date.getDate())
  );
}

export function parseDateString(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) throw new Error("Invalid date string: " + dateStr);
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    0,
    0,
    0,
    0
  );
}

export function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatDate(offset = 0, baseDate = new Date()): string {
  const d = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    0,
    0,
    0,
    0
  );
  d.setDate(d.getDate() + offset);
  return formatLocalDate(d);
}

export function shiftDateString(dateStr: string, offset: number): string {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + offset);
  return formatLocalDate(date);
}

export function compareDateStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

export function getStartOfWeekString(baseDate = new Date()): string {
  const date = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    0,
    0,
    0,
    0
  );
  const weekdayIndex = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - weekdayIndex);
  return formatLocalDate(date);
}

export function dateDiffInDays(laterDateStr: string, earlierDateStr: string): number {
  const later = parseDateString(laterDateStr).getTime();
  const earlier = parseDateString(earlierDateStr).getTime();
  return Math.round((later - earlier) / DAY_MS);
}

export function countPositiveDateStreak(
  records: Array<{ date: string; total: number }>,
  anchorDate?: string
): number {
  if (!records.length && !anchorDate) return 0;

  const totalsByDate = new Map<string, number>();
  for (const record of records) {
    if (isValidDateString(record.date)) {
      totalsByDate.set(record.date, record.total);
    }
  }

  const currentDate =
    anchorDate ||
    (() => {
      const sortedDates = Array.from(totalsByDate.keys()).sort(compareDateStrings);
      return sortedDates[sortedDates.length - 1];
    })();
  if (!currentDate) return 0;

  let streak = 0;
  let cursor = currentDate;
  while ((totalsByDate.get(cursor) || 0) > 0) {
    streak++;
    cursor = shiftDateString(cursor, -1);
  }

  return streak;
}
