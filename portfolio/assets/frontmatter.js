// Reads the "front matter" block at the top of a sample file:
//
//   ---
//   title: Fernhill Decaf launch
//   client: Fernhill Coffee
//   ---
//   The rest of the file is the write-up.
//
// Shared by the browser (sample.html) and the build script, so both read files the same way.

export function parseFrontMatter(text) {
  const match = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) value = value.slice(1, -1);
    data[kv[1].toLowerCase()] = value;
  }
  return { data, body: match[2] };
}

// Turns "fernhill-coffee.md" into a title if the file has none.
export function titleFromSlug(slug) {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
