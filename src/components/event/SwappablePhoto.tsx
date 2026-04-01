import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import { supabase } from "@/integrations/supabase/client";

interface SwappablePhotoProps {
  settingKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  as?: "img" | "bg";
  children?: React.ReactNode;
}

const SwappablePhoto = ({
  settingKey,
  defaultSrc,
  alt = "",
  className = "",
  imgClassName = "",
  as = "img",
  children,
}: SwappablePhotoProps) => {
  const { isAdmin, settings, setSetting, pageSlug } = useEditableTextContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const currentSrc = settings[settingKey] || defaultSrc;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${pageSlug}/${settingKey}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from("event-photos")
        .getPublicUrl(path);
      await setSetting(settingKey, publicUrl);
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (as === "bg") {
    return (
      <div
        className={`relative ${className}`}
        style={{ backgroundImage: `url(${currentSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {children}
        {isAdmin && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-events-coral/80 text-white text-[10px] font-bold hover:bg-events-coral transition-colors shadow-lg"
            >
              <Camera className="w-3 h-3" />
              {uploading ? "Uploading…" : "Swap Photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img src={currentSrc} alt={alt} className={imgClassName} />
      {isAdmin && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-events-coral/80 text-white text-[10px] font-bold hover:bg-events-coral transition-colors shadow-lg"
          >
            <Camera className="w-3 h-3" />
            {uploading ? "Uploading…" : "Swap Photo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </>
      )}
    </div>
  );
};

export default SwappablePhoto;
