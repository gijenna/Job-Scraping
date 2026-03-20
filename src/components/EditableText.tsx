import { useState, useRef, useEffect, createElement, ReactNode } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useEditableTextContext } from "./EditableTextProvider";

interface EditableTextProps {
  settingKey: string;
  defaultText: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  children?: ReactNode;
}

const EditableText = ({
  settingKey,
  defaultText,
  as: Tag = "span",
  className = "",
  style,
  multiline = false,
}: EditableTextProps) => {
  const { settings, isAdmin, setSetting } = useEditableTextContext();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const displayText = settings[settingKey] || defaultText;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== displayText) {
      await setSetting(settingKey, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdmin) {
    return createElement(Tag, { className, style }, displayText);
  }

  if (editing) {
    return (
      <div className="relative inline-flex items-start gap-1 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-black/20 border border-events-coral/50 rounded px-2 py-1 text-inherit font-inherit resize-y min-h-[60px]"
            style={{ fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit", color: "inherit" }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-black/20 border border-events-coral/50 rounded px-2 py-1 text-inherit font-inherit"
            style={{ fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit", color: "inherit" }}
          />
        )}
        <button
          onClick={handleSave}
          className="shrink-0 w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center hover:bg-green-500 transition-colors"
          title="Save"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCancel}
          className="shrink-0 w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <span
      className={`group/edit relative inline cursor-pointer ${className}`}
      style={style}
      onClick={() => {
        setDraft(displayText);
        setEditing(true);
      }}
      title="Click to edit"
    >
      {createElement(Tag, { className, style }, displayText)}
      <Pencil className="inline-block w-3 h-3 ml-1 opacity-0 group-hover/edit:opacity-60 transition-opacity text-events-coral" />
    </span>
  );
};

export default EditableText;
