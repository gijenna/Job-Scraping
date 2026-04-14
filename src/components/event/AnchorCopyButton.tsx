import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface AnchorCopyButtonProps {
  anchor: string;
  label?: string;
  className?: string;
}

const AnchorCopyButton = ({ anchor, label, className = "" }: AnchorCopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors shadow-lg ${
        copied
          ? "bg-green-600/80 text-white"
          : "bg-events-teal/80 text-white hover:bg-events-teal"
      } ${className}`}
      title={`Copy anchor link${label ? ` for ${label}` : ""}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      {copied ? "Copied!" : "Link"}
    </button>
  );
};

export default AnchorCopyButton;
