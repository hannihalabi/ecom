const styles = {
  primary:
    "border border-[rgba(182,143,91,0.6)] bg-[rgba(232,208,171,0.75)] text-[var(--lux-dark)]",
  dark:
    "border border-[rgba(205,165,111,0.6)] bg-[linear-gradient(145deg,#2c1d12,#18100b)] text-[var(--lux-gold)]",
  light:
    "border border-[rgba(163,124,75,0.48)] bg-[rgba(249,239,221,0.9)] text-[var(--lux-accent-strong)]",
  success:
    "border border-[rgba(160,132,95,0.6)] bg-[rgba(236,222,199,0.86)] text-[var(--lux-dark)]",
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
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
        styles[variant],
        className ?? "",
      ].join(" ")}
    >
      {label}
    </span>
  );
};
