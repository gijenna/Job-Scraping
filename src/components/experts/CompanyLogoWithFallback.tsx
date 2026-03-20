import { useState } from "react";
import { getCompanyLogoUrl } from "@/lib/expert-types";

interface CompanyLogoWithFallbackProps {
  company: string;
  domainOverrides?: Record<string, string>;
  className?: string;
  variant?: "primary" | "secondary";
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const CompanyLogoWithFallback = ({
  company,
  domainOverrides,
  className = "w-5 h-5",
  variant = "primary",
}: CompanyLogoWithFallbackProps) => {
  const logoUrl = getCompanyLogoUrl(company, domainOverrides);
  const [failed, setFailed] = useState(false);

  const renderInitials = () => {
    const initials = getInitials(company);
    return (
      <div
        className={`${className} rounded-sm flex items-center justify-center font-display font-bold shrink-0 ${
          variant === "primary"
            ? "bg-events-coral text-events-cream"
            : "bg-events-teal text-events-yellow"
        }`}
        style={{ fontSize: "clamp(6px, 45%, 11px)", lineHeight: 1 }}
        title={company}
      >
        {initials}
      </div>
    );
  };

  if (!logoUrl || failed) {
    return renderInitials();
  }

  return (
    <img
      src={logoUrl}
      alt={company}
      title={company}
      className={`${className} rounded-sm object-contain shrink-0`}
      onError={() => setFailed(true)}
    />
  );
};

export default CompanyLogoWithFallback;
