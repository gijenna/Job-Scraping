import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useEditableTextContext } from "./EditableTextProvider";

interface EditableLinkProps {
  textKey: string;
  urlKey: string;
  defaultText: string;
  defaultUrl: string;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  children?: React.ReactNode;
}

const EditableLink = ({
  textKey,
  urlKey,
  defaultText,
  defaultUrl,
  className = "",
  style,
  target = "_blank",
}: EditableLinkProps) => {
  const { settings, isAdmin, setSetting } = useEditableTextContext();
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const textRef = useRef<HTMLInputElement>(null);

  const displayText = settings[textKey] || defaultText;
  const displayUrl = settings[urlKey] || defaultUrl;

  useEffect(() => {
    if (editing && textRef.current) {
      textRef.current.focus();
      textRef.current.select();
    }
  }, [editing]);

  const handleSave = async () => {
    const trimText = draftText.trim();
    const trimUrl = draftUrl.trim();
    if (trimText && trimText !== displayText) await setSetting(textKey, trimText);
    if (trimUrl && trimUrl !== displayUrl) await setSetting(urlKey, trimUrl);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") setEditing(false);
  };

  if (!isAdmin) {
    return (
      <a href={displayUrl} target={target} rel="noopener noreferrer" className={className} style={style}>
        {displayText}
      </a>
    );
  }

  if (editing) {
    return (
      <div className="inline-flex flex-col gap-1 w-full max-w-sm">
        <input
          ref={textRef}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Button text"
          className="w-full bg-black/20 border border-events-coral/50 rounded px-2 py-1 text-sm text-inherit"
        />
        <input
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="URL (https://...)"
          className="w-full bg-black/20 border border-events-coral/50 rounded px-2 py-1 text-xs text-inherit font-mono"
        />
        <div className="flex gap-1">
          <button onClick={handleSave} className="w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center hover:bg-green-500"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={() => setEditing(false)} className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center hover:bg-red-500"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`group/edit relative inline cursor-pointer ${className}`}
      style={style}
      onClick={() => { setDraftText(displayText); setDraftUrl(displayUrl); setEditing(true); }}
      title="Click to edit link"
    >
      {displayText}
      <Pencil className="inline-block w-3 h-3 ml-1 opacity-0 group-hover/edit:opacity-60 transition-opacity text-events-coral" />
    </span>
  );
};

export default EditableLink;
