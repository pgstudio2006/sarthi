const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatISODateDisplay(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return formatDisplayDate(date);
}

export function parseISODate(iso: string): Date | undefined {
  if (!iso) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function parseDateInput(input: string): Date | undefined {
  if (!input) return undefined;

  const fromIso = parseISODate(input);
  if (fromIso) return fromIso;

  const parts = input.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = MONTHS.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (month >= 0 && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function calculateAgeLabel(dobIso: string): string {
  const date = parseISODate(dobIso);
  if (!date) return 'Age';

  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  let months = now.getMonth() - date.getMonth();

  if (now.getDate() < date.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} yrs ${months} mos`;
}

export function calculateAgeInMonths(dobIso: string): number {
  const date = parseISODate(dobIso);
  if (!date) return 0;

  const now = new Date();
  let months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  if (now.getDate() < date.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}
