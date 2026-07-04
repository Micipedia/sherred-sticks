/** A slim Celtic triquetra flanked by two rules — used between sections. */
export default function CelticDivider({ className }: { className?: string }) {
  const loop = "M0,3 C 8,-5 8,-18 0,-22 C -8,-18 -8,-5 0,3 Z";
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 240 34"
        width="240"
        height="34"
        className="mx-auto max-w-full text-gold"
        fill="none"
        stroke="currentColor"
      >
        <line x1="8" y1="17" x2="92" y2="17" strokeWidth="1" opacity="0.55" />
        <circle cx="96" cy="17" r="1.6" fill="currentColor" stroke="none" opacity="0.7" />
        <g transform="translate(120 18)" strokeWidth="1.5">
          <path d={loop} transform="rotate(0)" />
          <path d={loop} transform="rotate(120)" />
          <path d={loop} transform="rotate(240)" />
          <circle cx="0" cy="0" r="1.4" fill="currentColor" stroke="none" />
        </g>
        <circle cx="144" cy="17" r="1.6" fill="currentColor" stroke="none" opacity="0.7" />
        <line x1="148" y1="17" x2="232" y2="17" strokeWidth="1" opacity="0.55" />
      </svg>
    </div>
  );
}
