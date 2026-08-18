export interface SourceInput {
  label: string;
  url?: string;
  note?: string;
}

export interface EntryInput {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  sources: SourceInput[];
  aiUse: string;
  body: string;
  draft: boolean;
}

/** "Writing a CV in English" -> "writing-a-cv-in-english" */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/**
 * YAML 1.2 is a superset of JSON, so JSON.stringify produces a correctly
 * escaped double-quoted scalar. That keeps quotes, colons and newlines in
 * titles from breaking the frontmatter.
 */
function scalar(value: string): string {
  return JSON.stringify(value);
}

export function validate(input: EntryInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push('Give the entry a title.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.push('Pick a date.');
  if (!input.summary.trim()) errors.push('Write a one-sentence summary.');
  if (!input.body.trim()) errors.push('The entry has no text yet.');
  if (!input.aiUse.trim()) {
    errors.push(
      'Fill in "How I used AI". If you used none, write that — the field is graded.',
    );
  }

  input.sources.forEach((source, index) => {
    if (!source.label.trim()) {
      errors.push(`Source ${index + 1} needs a name.`);
    }
    if (source.url) {
      try {
        new URL(source.url);
      } catch {
        errors.push(`Source ${index + 1} has an address that is not a valid URL.`);
      }
    }
  });

  if (!slugify(input.title)) {
    errors.push('The title needs at least one letter or number for the web address.');
  }

  return errors;
}

export function buildMarkdown(input: EntryInput): string {
  const lines: string[] = ['---'];

  lines.push(`title: ${scalar(input.title.trim())}`);
  lines.push(`date: ${scalar(input.date)}`);
  lines.push(`summary: ${scalar(input.summary.trim())}`);

  const tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
  lines.push(`tags: [${tags.map(scalar).join(', ')}]`);

  const sources = input.sources.filter((source) => source.label.trim());
  if (sources.length === 0) {
    lines.push('sources: []');
  } else {
    lines.push('sources:');
    for (const source of sources) {
      lines.push(`  - label: ${scalar(source.label.trim())}`);
      if (source.url?.trim()) lines.push(`    url: ${scalar(source.url.trim())}`);
      if (source.note?.trim()) lines.push(`    note: ${scalar(source.note.trim())}`);
    }
  }

  lines.push(`aiUse: ${scalar(input.aiUse.trim())}`);
  lines.push(`draft: ${input.draft ? 'true' : 'false'}`);
  lines.push('---', '');
  lines.push(input.body.trim(), '');

  return lines.join('\n');
}
