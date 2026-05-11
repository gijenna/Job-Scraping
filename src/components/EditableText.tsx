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

  const handleSave = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const trimmed = draft.trim();
    if (trimmed && trimmed !== displayText) {
      await setSetting(settingKey, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraft(displayText);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="relative inline-flex items-start gap-1 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-black/20 border border-events-coral/50 rounded px-2 py-1 text-inherit font-inherit resize-y min-h-[60px]"
            style={{ fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit", color: "inherit" }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onClick={(e) => e.stopPropagation()}
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
    <>
      {createElement(Tag, { className, style }, displayText)}
      <button
        type="button"
        onClick={startEditing}
        onMouseDown={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center align-middle ml-1 w-5 h-5 rounded text-events-coral opacity-50 hover:opacity-100 hover:bg-events-coral/10 transition-opacity"
        title="Edit"
        aria-label="Edit"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </>
  );
};

export default EditableText;
