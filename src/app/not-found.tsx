import Link from "next/link";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <p className="eyebrow">Lost the trail</p>
      <h1 className="mt-4 font-display text-6xl text-parchment">404</h1>
      <p className="mt-4 max-w-sm text-muted">
        We could not find that page — it may have wandered off the path.
      </p>
      <Link href="/" className={`${btnPrimary} mt-8`}>
        Back to home
      </Link>
    </div>
  );
}
