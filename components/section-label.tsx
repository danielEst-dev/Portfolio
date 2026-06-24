interface SectionLabelProps {
  label: string;
  className?: string;
  number?: string;
}

export function SectionLabel({ label, className = "", number }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 mb-8 ${className}`}>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap m-0">
        {label}
      </h2>
      <div className="flex-1 h-px bg-border" />
      {number && (
        <span className="font-mono text-[11px] text-accent/70 whitespace-nowrap">
          {number}
        </span>
      )}
    </div>
  );
}
