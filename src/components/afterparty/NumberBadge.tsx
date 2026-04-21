type Role = "creator" | "brand" | "industry_expert" | string;

interface Props {
  number: number;
  role?: Role;
  size?: number;
  className?: string;
}

const ROLE_COLORS: Record<string, { fill: string; border: string; text: string }> = {
  creator: { fill: "#4A1B0C", border: "#D85A30", text: "#F5C4B3" },
  brand: { fill: "#1a1830", border: "#7F77DD", text: "#CECBF6" },
  industry_expert: { fill: "#04342C", border: "#1D9E75", text: "#9FE1CB" },
};

const NumberBadge = ({ number, role = "brand", size = 46, className = "" }: Props) => {
  const c = ROLE_COLORS[role] || ROLE_COLORS.brand;
  return (
    <div
      className={`inline-flex items-center justify-center font-medium tabular-nums shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 11,
        backgroundColor: c.fill,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: Math.round(size * 0.4),
        lineHeight: 1,
      }}
    >
      #{number}
    </div>
  );
};

export default NumberBadge;
