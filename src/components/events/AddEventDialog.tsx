import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddEventDialogProps {
  onEventAdded: () => void;
}

const AddEventDialog = ({ onEventAdded }: AddEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("0");
  const [registrationLink, setRegistrationLink] = useState("");
  const [type, setType] = useState<"in-person" | "digital" | "workshop">("in-person");
  const [location, setLocation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setCost("0");
    setRegistrationLink("");
    setType("in-person");
    setLocation("");
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !registrationLink.trim()) {
      toast({ title: "Missing fields", description: "Please fill in title, date, and registration link.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let photoUrl: string | null = null;

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("event-photos")
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("event-photos")
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("events").insert({
        title: title.trim(),
        date: new Date(date).toISOString(),
        cost: parseFloat(cost) || 0,
        registration_link: registrationLink.trim(),
        type,
        location: type === "digital" ? "Digital" : location.trim() || null,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({ title: "Event added!", description: `"${title}" has been added.` });
      resetForm();
      setOpen(false);
      onEventAdded();
    } catch (err: any) {
      toast({ title: "Error adding event", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-events-coral text-events-teal hover:brightness-110 rounded-full gap-2">
          <Plus size={18} /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-events-cream text-xl">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-events-cream/80">Event Photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="bg-events-card border-events-cream/20 text-events-cream file:text-events-cream"
            />
          </div>
          <div>
            <Label className="text-events-cream/80">Event Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gather PNW 2026"
              className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/30"
              maxLength={200}
              required
            />
          </div>
          <div>
            <Label className="text-events-cream/80">Date *</Label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream"
              required
            />
          </div>
          <div>
            <Label className="text-events-cream/80">Cost (0 for free)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream"
            />
          </div>
          <div>
            <Label className="text-events-cream/80">Registration Link *</Label>
            <Input
              type="url"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="https://..."
              className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/30"
              maxLength={500}
              required
            />
          </div>
          <div>
            <Label className="text-events-cream/80">Type *</Label>
            <div className="flex gap-2 mt-1">
              {(["in-person", "digital", "workshop"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    type === t
                      ? "bg-events-coral text-events-teal"
                      : "bg-events-card text-events-cream/70 border border-events-cream/10"
                  }`}
                >
                  {t === "in-person" ? "In-Person" : t === "digital" ? "Digital" : "Workshop"}
                </button>
              ))}
            </div>
          </div>
          {type !== "digital" && (
            <div>
              <Label className="text-events-cream/80">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Portland, OR"
                className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/30"
                maxLength={200}
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-events-coral text-events-teal font-bold hover:brightness-110 rounded-full"
          >
            {loading ? "Adding..." : "Add Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
