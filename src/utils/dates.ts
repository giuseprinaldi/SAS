import { DayOfWeek } from '../types';

/**
 * Returns the Monday of the week containing the given date.
 * Week is defined as Monday through Friday.
 */
export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

/**
 * Returns the current day index (0=Monday ... 4=Friday).
 * Returns null if it's a weekend.
 */
export function getCurrentDayIndex(): DayOfWeek | null {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return null;
  return (day - 1) as DayOfWeek;
}

/**
 * Returns the date string for a specific day of the current week.
 */
export function getDateForDayIndex(weekStart: string, dayIndex: DayOfWeek): string {
  const d = new Date(weekStart + 'T00:00:00');
  d.setDate(d.getDate() + dayIndex);
  return d.toISOString().split('T')[0];
}

/**
 * Formats a week start date into a readable range string.
 */
export function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const startMonth = monthNames[start.getMonth()];
  const endMonth = monthNames[end.getMonth()];

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}

/**
 * Returns the previous week's start date.
 */
export function getPreviousWeekStart(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00');
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
}

/**
 * Returns the next week's start date.
 */
export function getNextWeekStart(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00');
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}
