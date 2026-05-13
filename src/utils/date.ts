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

export function getDayOfWeek(dateStr: string): number {
  return parseDateString(dateStr).getDay();
}

export function isMonday(dateStr: string): boolean {
  return getDayOfWeek(dateStr) === 1;
}

export function isLastDayOfMonth(dateStr: string): boolean {
  const d = parseDateString(dateStr);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return d.getDate() === lastDay;
}

export function getPreviousWeekBounds(dateStr: string): { start: string; end: string } {
  const d = parseDateString(dateStr);
  const weekdayIndex = (d.getDay() + 6) % 7;
  const weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - weekdayIndex);
  const prevWeekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 1);
  const prevWeekStart = new Date(prevWeekEnd.getFullYear(), prevWeekEnd.getMonth(), prevWeekEnd.getDate() - 6);
  return { start: formatLocalDate(prevWeekStart), end: formatLocalDate(prevWeekEnd) };
}

export function getPreviousMonthBounds(dateStr: string): { start: string; end: string; month: string } {
  const d = parseDateString(dateStr);
  const prevMonthEnd = new Date(d.getFullYear(), d.getMonth(), 0);
  const prevMonthStart = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1);
  const month =
    prevMonthStart.getFullYear() + "-" + String(prevMonthStart.getMonth() + 1).padStart(2, "0");
  return { start: formatLocalDate(prevMonthStart), end: formatLocalDate(prevMonthEnd), month };
}

export function getNextMonday(dateStr: string): string {
  const d = parseDateString(dateStr);
  const day = d.getDay();
  const daysUntilMonday = day === 1 ? 7 : day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return formatLocalDate(d);
}

export function getNextMonthLastDay(dateStr: string): string {
  const d = parseDateString(dateStr);
  const nextMonthLast = new Date(d.getFullYear(), d.getMonth() + 2, 0);
  return formatLocalDate(nextMonthLast);
}

export function getMonthWeekNumber(dateStr: string): number {
  const d = parseDateString(dateStr);
  const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const firstWeekdayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  return Math.floor((d.getDate() + firstWeekdayIndex - 1) / 7) + 1;
}

export function getMonthWeekLabel(dateStr: string): string {
  return "第" + getMonthWeekNumber(dateStr) + "周";
}

export function getReportFolderSegments(dateStr: string): [string, string, string] {
  const d = parseDateString(dateStr);
  return [
    String(d.getFullYear()),
    pad2(d.getMonth() + 1),
    getMonthWeekLabel(dateStr),
  ];
}

export function countDateStreak(
  records: Array<{ date: string; total: number }>,
  anchorDate?: string,
  threshold = 0
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
  while ((totalsByDate.get(cursor) || 0) > threshold) {
    streak++;
    cursor = shiftDateString(cursor, -1);
  }

  return streak;
}

export function countPositiveDateStreak(
  records: Array<{ date: string; total: number }>,
  anchorDate?: string
): number {
  return countDateStreak(records, anchorDate, 0);
}
