// Sherred & Sons — photo upload backend (Cloudflare Worker).
//
// The website's /upload page shrinks each photo in the browser (so even a 12MB
// HEIC becomes a small JPEG), then POSTs the small images here. This Worker
// checks the password, saves the photos into the shop's repo and attaches them
// to the chosen stick/accessory — all in one commit — using a repo-scoped
// GitHub token. Because the photos arrive already-shrunk, the CMS size limit
// never applies.
//
// Secrets: GITHUB_TOKEN (fine-grained, Contents: read/write) + UPLOAD_PASSWORD.

const REPO = "Micipedia/sherred-sticks";
const GH = "https://api.github.com";

const KINDS = {
  stick: { json: "src/data/products", media: "public/products", ref: "/products" },
  accessory: { json: "src/data/accessories", media: "public/accessories", ref: "/accessories" },
};

const cors = {
  "Access-Control-Allow-Origin": "https://sherredsticks.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

async function gh(env, method, path, body) {
  const res = await fetch(`${GH}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "sherred-upload",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || `GitHub ${res.status}`), { status: res.status });
  return data;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!env.GITHUB_TOKEN || !env.UPLOAD_PASSWORD) return json({ error: "Uploads aren't set up yet." }, 503);

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Bad request" }, 400);
    }
    if (payload.password !== env.UPLOAD_PASSWORD) return json({ error: "Wrong password." }, 401);

    const kind = KINDS[payload.kind] ? payload.kind : "stick";
    const dirs = KINDS[kind];
    const slug = String(payload.slug || "");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return json({ error: "Please pick an item first." }, 400);

    const photos = Array.isArray(payload.photos) ? payload.photos : [];
    if (photos.length === 0) return json({ error: "No photos to upload." }, 400);
    if (photos.length > 12) return json({ error: "Please upload up to 12 photos at a time." }, 400);
    for (const p of photos) {
      if (typeof p.dataBase64 !== "string" || p.dataBase64.length > 3_000_000) {
        return json({ error: "One of the photos is too large or missing." }, 400);
      }
    }

    try {
      // Read the current item JSON (must exist).
      const jsonPath = `${dirs.json}/${slug}.json`;
      let file;
      try {
        file = await gh(env, "GET", `/repos/${REPO}/contents/${jsonPath}?ref=main`);
      } catch (e) {
        if (e.status === 404) return json({ error: "That item no longer exists." }, 404);
        throw e;
      }
      const bytes = Uint8Array.from(atob(file.content.replace(/\s/g, "")), (c) => c.charCodeAt(0));
      const item = JSON.parse(new TextDecoder().decode(bytes));

      // Base commit + tree.
      const ref = await gh(env, "GET", `/repos/${REPO}/git/ref/heads/main`);
      const baseSha = ref.object.sha;
      const baseCommit = await gh(env, "GET", `/repos/${REPO}/git/commits/${baseSha}`);

      // One blob per photo; collect their web paths.
      const tree = [];
      const newPaths = [];
      const stamp = Date.now();
      let i = 0;
      for (const p of photos) {
        const name = `${slug}-${stamp}-${i}.jpg`;
        const blob = await gh(env, "POST", `/repos/${REPO}/git/blobs`, { content: p.dataBase64, encoding: "base64" });
        tree.push({ path: `${dirs.media}/${slug}/${name}`, mode: "100644", type: "blob", sha: blob.sha });
        newPaths.push(`${dirs.ref}/${slug}/${name}`);
        i++;
      }

      // Append to the item's photo list and write it back in the same commit.
      item.photos = [...(Array.isArray(item.photos) ? item.photos : []), ...newPaths];
      tree.push({ path: jsonPath, mode: "100644", type: "blob", content: JSON.stringify(item, null, 2) + "\n" });

      const newTree = await gh(env, "POST", `/repos/${REPO}/git/trees`, { base_tree: baseCommit.tree.sha, tree });
      const commit = await gh(env, "POST", `/repos/${REPO}/git/commits`, {
        message: `Add ${photos.length} photo(s) to ${slug} (via uploader)`,
        tree: newTree.sha,
        parents: [baseSha],
      });
      await gh(env, "PATCH", `/repos/${REPO}/git/refs/heads/main`, { sha: commit.sha });

      return json({ ok: true, added: newPaths.length });
    } catch (e) {
      return json({ error: "Sorry — saving the photos failed. Please try again." }, 502);
    }
  },
};
