/** Formats a date the way every entry heading shows it: "12 September 2025". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Short form used inside the Year Spine markers: "12 Sep". */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/** Machine-readable value for <time datetime="..."> . */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rough reading time at 200 words per minute, minimum one minute. */
export function readingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Two-digit entry number, so the list reads 01, 02, ... 12. */
export function entryNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}
