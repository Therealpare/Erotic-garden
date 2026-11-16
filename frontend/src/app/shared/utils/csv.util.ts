/**
 * Minimal RFC 4180 CSV reader (quoted fields, "" escapes, commas and line breaks inside
 * quotes, CRLF or LF). Enough for a Google Sheet published as CSV; no dependency needed.
 * Returns one object per data row, keyed by the trimmed, lower-cased header names.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  const input = text.replace(/^﻿/, '');
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...data] = rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
  if (!header) return [];
  const keys = header.map((key) => key.trim().toLowerCase());
  return data.map((cells) => Object.fromEntries(keys.map((key, index) => [key, (cells[index] ?? '').trim()])));
}
