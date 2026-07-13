// Emit public/feed.xml — an RSS 2.0 feed of every stick, listed newest-first.
//
// This is the engine behind the "email me every new stick" option on the
// mailing list. The site is static, so there is no server to fire a
// notification when Steve adds a stick. Instead we publish this feed, and the
// newsletter service (Brevo) watches it: when a new <item> appears, it emails
// the subscribers who asked to hear about every new stick. The same feed also
// feeds the weekly / monthly digests.
//
// Runs AFTER emit-store.mjs in the deploy workflow (order: images -> store ->
// feed -> build). output:"export" copies public/feed.xml verbatim into out/,
// so it is served at https://sherredsticks.com/feed.xml.
//
// pubDate correctness (the load-bearing bit): each stick's <pubDate> is the
// date its .json file was FIRST ADDED to git. That commit never changes, so a
// stick keeps the same pubDate across every future rebuild — editing another
// stick, or redeploying, never re-dates it. If pubDate moved on each build,
// every item would look "new" again and subscribers would be re-emailed the
// whole catalogue. Because the date is immutable, that can't happen.
// (Requires the deploy checkout to use fetch-depth: 0 so full history exists.)

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ORIGIN = "https://sherredsticks.com";
const PROD_DIR = "src/data/products";

// Escape the five XML-significant characters for safe text/attribute content.
const xml = (s) =>
  String(s ?? "").replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );

// Product photo paths are stored root-relative ("/products/stick-1/01.jpg");
// email clients and feed readers need absolute URLs.
const abs = (p) => (!p ? null : p.startsWith("http") ? p : ORIGIN + p);
const mime = (p) => (/\.png$/i.test(p) ? "image/png" : "image/jpeg");

// The date the file was first committed = the day the stick appeared. Returns
// an ISO string, or null if git history isn't available (falls back to now).
function firstSeen(relPath) {
  try {
    const out = execSync(
      `git log --diff-filter=A --format=%aI -- "${relPath}"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    // git logs newest-first, so the earliest (the add) is the last line.
    const lines = out.split("\n").filter(Boolean);
    return lines.length ? lines[lines.length - 1] : null;
  } catch {
    return null;
  }
}

// A one-line availability note used in the title and body.
function availability(d) {
  if (d.sold) return "Sold";
  if (d.priceCents != null) return `£${(d.priceCents / 100).toFixed(2)}`;
  return "Enquire";
}

const items = fs
  .readdirSync(PROD_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const slug = f.replace(/\.json$/, "");
    const rel = path.join(PROD_DIR, f);
    const d = JSON.parse(fs.readFileSync(rel, "utf8"));
    return { slug, d, date: firstSeen(rel) || new Date().toISOString() };
  })
  // Newest stick first — every RSS-to-email tool reads from the top / by pubDate.
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function itemXml({ slug, d, date }) {
  const url = `${ORIGIN}/product/${slug}/`;
  const photo = abs(d.photos?.[0]);
  const note = availability(d);
  const summary = d.shortDescription || d.description || "";
  const bodyHtml =
    (photo ? `<p><img src="${xml(photo)}" alt="${xml(d.name)}" /></p>` : "") +
    `<p>${xml(d.description || summary)}</p>` +
    `<p><strong>${xml(note)}</strong></p>` +
    `<p><a href="${xml(url)}">View this stick</a></p>`;
  return `    <item>
      <title>${xml(`${d.name.trim()} — ${note}`)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="false">tag:sherredsticks.com,2026:${xml(slug)}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>${
        d.category ? `\n      <category>${xml(d.category)}</category>` : ""
      }
      <description>${xml(summary)}</description>
      <content:encoded><![CDATA[${bodyHtml}]]></content:encoded>${
        photo ? `\n      <enclosure url="${xml(photo)}" type="${mime(photo)}" length="0" />` : ""
      }
    </item>`;
}

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sherred &amp; Sons — New Walking Sticks</title>
    <link>${ORIGIN}/</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Hand-finished walking sticks, listed as each new one is made.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.map(itemXml).join("\n")}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(process.cwd(), "public/feed.xml"), feed);
console.log(`wrote public/feed.xml (${items.length} sticks)`);
