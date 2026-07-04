import { buildStickSvg } from "@/lib/stick-svg";
import type { HandleStyle } from "@/lib/types";

/**
 * Renders the parametric sample-stick illustration for a product.
 * The SVG is our own static markup (no user input), so dangerouslySetInnerHTML
 * is safe here and lets us reuse the same builder for visual QA.
 */
export default function StickImage({
  woodColor,
  handle,
  className,
}: {
  woodColor: string;
  handle: HandleStyle;
  className?: string;
}) {
  return (
    <div
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: buildStickSvg({ woodColor, handle }) }}
    />
  );
}
