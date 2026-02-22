type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-px w-7 bg-[rgba(166,123,78,0.5)]" />
          <h2 className="[font-family:var(--font-display)] text-2xl leading-tight text-[var(--lux-ink)] md:text-3xl">
            {title}
          </h2>
          <span className="h-px w-7 bg-[rgba(166,123,78,0.5)]" />
        </div>
        {subtitle && <p className="text-sm text-[var(--lux-muted)] md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};
