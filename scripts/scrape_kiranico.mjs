// Scrapes Kiranico MHW quest index (single page) into JSON.
// Usage: node scripts/scrape_kiranico.mjs
// Output: src/data/quests.json

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'src', 'data', 'quests.json');
const URL = 'https://mhworld.kiranico.com/en/quests';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Tab id → kind label (kept as-is from Kiranico's labels)
const KIND_BY_TAB = {
  'q-1': 'Iceborne',
  'q0': 'Assigned',
  'q1': 'Optional',
  'q3': 'Event',
  'q5': 'Arena',
};

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function parseRankFromPrefix(prefix) {
  // prefix is like "★4" or "M★1"
  const mr = prefix.match(/^M★(\d+)$/);
  if (mr) return { rank: 'Master', stars: Number(mr[1]) };
  const lr = prefix.match(/^★(\d+)$/);
  if (lr) {
    const n = Number(lr[1]);
    return { rank: n <= 5 ? 'Low' : 'High', stars: n };
  }
  return { rank: 'Unknown', stars: 0 };
}

function splitTabs(html) {
  // Find each tab-pane's opening tag and the next one; everything between is that tab's content.
  const re = /<div class="tab-pane fade[^"]*" id="(q-?\d+)"/g;
  const matches = [];
  let m;
  while ((m = re.exec(html))) matches.push({ id: m[1], start: m.index });
  const out = {};
  for (let i = 0; i < matches.length; i += 1) {
    const { id, start } = matches[i];
    const end = i + 1 < matches.length ? matches[i + 1].start : html.length;
    out[id] = html.slice(start, end);
  }
  return out;
}

function parseQuestRow(rowHtml) {
  // First td has the quest link + title.
  const linkM = rowHtml.match(
    /<a href="https:\/\/mhworld\.kiranico\.com\/en\/quests\/([^/]+)\/([^"]+)"[^>]*>\s*<img[^>]*src="[^"]*quest_type_(\d+)\.png"[^>]*>\s*<span>([^<]+)<\/span>/,
  );
  if (!linkM) return null;
  const [, qid, slug, objectiveType, spanText] = linkM;
  const titleFull = decode(spanText).trim();
  const prefixM = titleFull.match(/^(M?★\d+)\s+(.+)$/);
  if (!prefixM) return null;
  const prefix = prefixM[1];
  const name = prefixM[2].trim();
  const { rank, stars } = parseRankFromPrefix(prefix);

  // Second td: location (small) and objective text (div).
  const locM = rowHtml.match(/<small>([^<]+)<\/small>\s*<div>([^<]+)<\/div>/);
  const location = locM ? decode(locM[1]).trim() : '';
  const objective = locM ? decode(locM[2]).trim() : '';

  // Third td: monster icons with title="Monster Name". Use title= to dedupe.
  const monsterSet = new Set();
  const monRe = /title="([^"]+)">\s*<img[^>]*em\d+(?:_\d+)?_ID\.png/g;
  let mm;
  while ((mm = monRe.exec(rowHtml))) monsterSet.add(decode(mm[1]).trim());

  return {
    id: qid,
    slug,
    name,
    rank,
    stars,
    objective,
    location,
    monsters: [...monsterSet],
    objectiveType: Number(objectiveType),
  };
}

function parseRows(tabHtml) {
  // Rows are `<tr>...</tr>` — split on balanced tr tags.
  const rows = [];
  const rowRe = /<tr>([\s\S]*?)<\/tr>/g;
  let r;
  while ((r = rowRe.exec(tabHtml))) rows.push(r[1]);
  return rows;
}

async function main() {
  const started = Date.now();
  console.error(`Fetching ${URL} …`);
  const res = await fetch(URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  console.error(`Got ${(html.length / 1024).toFixed(0)} KiB in ${Date.now() - started}ms`);

  const tabs = splitTabs(html);
  const quests = [];
  const seen = new Set();

  for (const [tabId, kind] of Object.entries(KIND_BY_TAB)) {
    const tabHtml = tabs[tabId];
    if (!tabHtml) {
      console.error(`  tab ${tabId} not found, skipping`);
      continue;
    }
    let count = 0;
    for (const rowHtml of parseRows(tabHtml)) {
      const q = parseQuestRow(rowHtml);
      if (!q) continue;
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      quests.push({ ...q, kind });
      count += 1;
    }
    console.error(`  ${kind.padEnd(10)}  ${count} quests`);
  }

  quests.sort((a, b) => {
    const rankOrder = { Low: 0, High: 1, Master: 2, Unknown: 3 };
    return (
      rankOrder[a.rank] - rankOrder[b.rank] ||
      a.stars - b.stars ||
      a.name.localeCompare(b.name)
    );
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        source: URL,
        scrapedAt: new Date().toISOString(),
        count: quests.length,
        quests,
      },
      null,
      2,
    ),
  );
  console.error(`\nWrote ${quests.length} quests → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
