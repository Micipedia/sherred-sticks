"use client";

import { useEffect, useState } from "react";
import { btnPrimary } from "@/lib/ui";

const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;
const MAX_SIDE = 1400;

type Item = { slug: string; name: string; kind?: string };

// Turn a base64 data URL blob into just the base64 part.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// Shrink any photo (incl. HEIC) to a small JPEG, in the browser.
async function shrink(file: File): Promise<string> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Browser can't decode it natively (e.g. HEIC on Chrome) — use a decoder.
    const heic2any = (await import("heic2any")).default as (o: {
      blob: Blob;
      toType?: string;
      quality?: number;
    }) => Promise<Blob | Blob[]>;
    const jpeg = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    bitmap = await createImageBitmap(Array.isArray(jpeg) ? jpeg[0] : jpeg);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b as Blob), "image/jpeg", 0.82)
  );
  return blobToBase64(blob);
}

export default function UploadPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/store.json")
      .then((r) => r.json())
      .then((list: Item[]) => setItems(list))
      .catch(() => setItems([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return setMsg({ ok: false, text: "Pick which stick or accessory these photos are for." });
    if (!files || files.length === 0) return setMsg({ ok: false, text: "Choose one or more photos." });
    if (!UPLOAD_URL) return setMsg({ ok: false, text: "Uploads aren't switched on yet." });

    setBusy(true);
    setMsg({ ok: true, text: "Shrinking your photos…" });
    try {
      const kind = items.find((i) => i.slug === slug)?.kind || "stick";
      const photos: { dataBase64: string }[] = [];
      for (const file of Array.from(files)) {
        photos.push({ dataBase64: await shrink(file) });
      }
      setMsg({ ok: true, text: "Uploading…" });
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, slug, kind, photos }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      setMsg({
        ok: true,
        text: `Done — ${data.added} photo(s) added. They'll show on the item in about 2 minutes.`,
      });
      setFiles(null);
      (document.getElementById("photo-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("photo-input") as HTMLInputElement).value = "");
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page py-14">
      <header className="mx-auto max-w-lg text-center">
        <p className="eyebrow">Owner tools</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Add photos</h1>
        <p className="mt-4 text-parchment-dim">
          Drop in photos of any size — even straight off the phone. They&apos;re
          shrunk on your device before uploading, so nothing is ever &ldquo;too
          big&rdquo;.
        </p>
      </header>

      <form onSubmit={submit} className="mx-auto mt-10 max-w-lg space-y-5">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-line bg-ink px-3 py-2 text-parchment focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Which stick or accessory?
          </label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-sm border border-line bg-ink px-3 py-2 text-parchment focus:border-gold focus:outline-none"
          >
            <option value="">Choose one…</option>
            {items.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Photos
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*,.heic,.heif,.HEIC,.HEIF"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-sm text-parchment-dim file:mr-3 file:rounded-sm file:border-0 file:bg-gold file:px-4 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-[0.14em] file:text-ink"
          />
        </div>

        {msg && (
          <p
            className={`rounded-sm border p-3 text-sm ${
              msg.ok
                ? "border-gold/40 bg-gold/5 text-parchment-dim"
                : "border-oxblood/50 bg-oxblood/10 text-oxblood"
            }`}
          >
            {msg.text}
          </p>
        )}

        <button type="submit" disabled={busy} className={`${btnPrimary} w-full disabled:opacity-60`}>
          {busy ? "Working…" : "Add photos"}
        </button>
      </form>
    </div>
  );
}
