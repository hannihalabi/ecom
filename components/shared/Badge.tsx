const styles = {
  primary: "bg-rose-600 text-white",
  dark: "bg-slate-900 text-white",
  light: "bg-amber-100 text-amber-900",
  success: "bg-emerald-600 text-white",
};

type BadgeProps = {
  label: string;
  variant?: keyof typeof styles;
  className?: string;
};

export const Badge = ({ label, variant = "primary", className }: BadgeProps) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        styles[variant],
        className ?? "",
      ].join(" ")}
    >
      {label}
    </span>
  );
};
