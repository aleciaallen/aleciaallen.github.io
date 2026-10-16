// Scans /samples for .md files and writes samples/index.json,
// which the homepage reads to build the Work section.
//
// Runs automatically in the GitHub Action on every push.
// To preview locally:  node scripts/build-manifest.mjs

import { readdir, readFile, writeFile } from "node:fs/promises";
import { parseFrontMatter, titleFromSlug } from "../assets/frontmatter.js";

const dir = new URL("../samples/", import.meta.url);

const files = (await readdir(dir))
  .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"));

const samples = [];
for (const file of files) {
  const slug = file.replace(/\.md$/i, "");
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(slug)) {
    console.warn(`Skipping "${file}": use letters, numbers and dashes only in file names.`);
    continue;
  }

  const { data, body } = parseFrontMatter(await readFile(new URL(file, dir), "utf8"));
  if (String(data.draft).toLowerCase() === "true") continue;

  samples.push({
    slug,
    title: data.title || titleFromSlug(slug),
    client: data.client || "",
    type: data.type || "",
    brief: data.brief || "",
    line: data.line || "",
    result: data.result || "",
    date: data.date || "",
    order: data.order !== undefined && data.order !== "" ? Number(data.order) : null,
    words: body.split(/\s+/).filter(Boolean).length
  });
}

// Pieces with an "order" come first (1, 2, 3...), the rest newest date first.
samples.sort((a, b) => {
  if (a.order !== null && b.order !== null) return a.order - b.order;
  if (a.order !== null) return -1;
  if (b.order !== null) return 1;
  return (b.date || "").localeCompare(a.date || "");
});

await writeFile(new URL("index.json", dir), JSON.stringify(samples, null, 2) + "\n");
console.log(`Built samples/index.json with ${samples.length} piece(s).`);
