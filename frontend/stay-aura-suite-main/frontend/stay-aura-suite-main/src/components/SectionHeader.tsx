interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground font-body">{subtitle}</p>}
    </div>
  );
}
