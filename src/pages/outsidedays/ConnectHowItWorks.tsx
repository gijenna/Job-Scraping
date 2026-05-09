// Public explainer for Basecamp Connect at Outside Days. Linked from the
// signup branching screen and the map header. No auth required.

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Build your profile",
    body:
      "Pick the full profile if you've got 5 to 7 minutes, or just the essentials in 90 seconds. You can always come back and add more. Brands filter on full profiles, so completing yours makes you way more likely to get a follow-up.",
  },
  {
    title: "2. Browse the brand map",
    body:
      "Once you're in, you'll see every brand at the event laid out on the floorplan. Tap any brand bubble to see who's repping the booth, what they do, and whether they're hiring.",
  },
  {
    title: "3. Star and send a quick note (pre-event)",
    body:
      "Star the brands you want to meet so they're easy to find on the day. Send a short note to a specific rep or expert telling them what drew you to them. They'll get an email so they're ready to look for you.",
  },
  {
    title: "4. Walk up and say hi (during)",
    body:
      "When the event is live, the map switches modes. Notes pause and the focus shifts to logging real conversations. Tap a brand bubble after each chat to mark it as a connection.",
  },
  {
    title: "5. Follow up (post-event)",
    body:
      "After the event wraps, send thank-you notes to anyone you spoke with, or reach out to brands you missed. Reps can see your full profile right alongside your message.",
  },
];

const ConnectHowItWorks = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-events-teal text-events-cream">
      <header className="px-4 py-3 border-b border-events-cream/10 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => nav(-1)}
          className="text-events-cream/80"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </header>

      <main className="px-5 py-8 max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="font-afterparty text-4xl md:text-5xl">How Basecamp Connect works</h1>
          <p className="font-body text-events-cream/70">
            A quick tour of how candidates and brands meet, talk, and follow up.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title} className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
              <h2 className="font-display text-lg text-events-cream mb-2">{s.title}</h2>
              <p className="font-body text-events-cream/80 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="pt-2">
          <Button
            onClick={() => nav("/outsidedays26/connect")}
            className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
          >
            Got it — take me to Connect
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ConnectHowItWorks;
