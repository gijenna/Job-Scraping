import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  expectedName: string;
  onUnlock: () => void;
  onCancel: () => void;
}

const EditNameGate = ({ expectedName, onUnlock, onCancel }: Props) => {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim().toLowerCase() === expectedName.trim().toLowerCase()) {
      onUnlock();
    } else {
      setErr(true);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 p-5 rounded-xl" style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.09)" }}>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
        Type your name to unlock editing.
      </p>
      <Input
        value={val}
        onChange={(e) => { setVal(e.target.value); setErr(false); }}
        placeholder="Your full name"
        className="border-0"
        style={{ backgroundColor: "#080808", color: "#fff", border: "1px solid rgba(255,255,255,0.09)" }}
      />
      {err && <p className="text-xs" style={{ color: "#D85A30" }}>That doesn't match the name on this invite.</p>}
      <div className="flex gap-2">
        <Button type="submit" style={{ backgroundColor: "#fff", color: "#080808" }} className="hover:opacity-90">Unlock</Button>
        <Button type="button" variant="ghost" onClick={onCancel} style={{ color: "rgba(255,255,255,0.7)" }}>Cancel</Button>
      </div>
    </form>
  );
};

export default EditNameGate;
