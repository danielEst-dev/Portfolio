interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 mb-8 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
