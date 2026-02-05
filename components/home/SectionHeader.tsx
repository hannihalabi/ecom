type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};
