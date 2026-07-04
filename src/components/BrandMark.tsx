/** Sherred & Sons mark — a Celtic triquetra within a ring. */
export default function BrandMark({ className }: { className?: string }) {
  const loop = "M0,2 C 5,-3 5,-11 0,-14 C -5,-11 -5,-3 0,2 Z";
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" strokeWidth="1.3" opacity="0.65" />
      <g transform="translate(20 21)" strokeWidth="1.5">
        <path d={loop} transform="rotate(0)" />
        <path d={loop} transform="rotate(120)" />
        <path d={loop} transform="rotate(240)" />
        <circle cx="0" cy="0" r="1.1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
