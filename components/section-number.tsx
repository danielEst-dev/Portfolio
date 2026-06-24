interface SectionNumberProps {
  /** 1-based section index — rendered zero-padded and used to zigzag the side. */
  index: number;
  className?: string;
}

export function SectionNumber({ index, className = "" }: SectionNumberProps) {
  const label = String(index).padStart(2, "0");
  // Consistent zigzag: odd-numbered sections anchor top-right, even top-left.
  // Anchored flush to the side and translated ~25% off the edge so the numeral
  // bleeds into the margin (clipped by the section's overflow-hidden) — a
  // deliberate "entering from the edge" read. Vertical (top-6) is intentionally
  // untouched: only the side is clipped, never the top. Sits behind content
  // (z-0) at a quiet watermark opacity — see .section-number.
  const side = index % 2 === 1 ? "right-0 translate-x-1/4" : "left-0 -translate-x-1/4";
  return (
    <div className={`section-number top-6 ${side} ${className}`} aria-hidden="true">
      {label}
    </div>
  );
}