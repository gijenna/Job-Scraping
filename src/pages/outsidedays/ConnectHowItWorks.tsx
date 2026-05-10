// Public explainer for Basecamp Connect at Outside Days. Linked from the
// signup branching screen and the map header. No auth required.

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import ConnectBottomNav, { ConnectTopNav } from "@/components/connect/ConnectBottomNav";

const SECTIONS: { key: string; titleDefault: string; bodyDefault: string }[] = [
  {
    key: "how_s1",
    titleDefault: "1. Build your profile",
    bodyDefault:
      "Pick the full profile if you've got 5 to 7 minutes, or just the essentials in 90 seconds. You can always come back and add more. Brands filter on full profiles, so completing yours makes you way more likely to get a follow-up.",
  },
  {
    key: "how_s2",
    titleDefault: "2. Browse the brand map",
    bodyDefault:
      "Once you're in, you'll see every brand at the event laid out on the floorplan. Tap any brand bubble to see who's repping the booth, what they do, and whether they're hiring.",
  },
  {
    key: "how_s3",
    titleDefault: "3. Star and send a quick note (pre-event)",
    bodyDefault:
      "Star the brands you want to meet so they're easy to find on the day. Send a short note to a specific rep or expert telling them what drew you to them. They'll get an email so they're ready to look for you.",
  },
  {
    key: "how_s4",
    titleDefault: "4. Walk up and say hi (during)",
    bodyDefault:
      "When the event is live, the map switches modes. Notes pause and the focus shifts to logging real conversations. Tap a brand bubble after each chat to mark it as a connection.",
  },
  {
    key: "how_s5",
    titleDefault: "5. Follow up (post-event)",
    bodyDefault:
      "After the event wraps, send thank-you notes to anyone you spoke with, or reach out to brands you missed. Reps can see your full profile right alongside your message.",
  },
];

const ConnectHowItWorks = () => {
  const nav = useNavigate();
  return (
    <EditableTextProvider pageSlug="outsidedays26-connect">
      <div className="min-h-screen bg-events-teal text-events-cream">
        <header className="px-4 py-3 border-b border-events-cream/10 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => nav(-1)}
            className="text-events-cream/80"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> <EditableText settingKey="how_back" defaultText="Back" as="span" />
          </Button>
          <ConnectTopNav />
        </header>

        <main className="px-5 py-8 pb-28 sm:pb-8 max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <EditableText
              settingKey="how_title"
              defaultText="How Basecamp Connect works"
              as="h1"
              className="font-afterparty text-4xl md:text-5xl"
            />
            <EditableText
              settingKey="how_subtitle"
              defaultText="A quick tour of how candidates and brands meet, talk, and follow up."
              as="p"
              className="font-body text-events-cream/70"
            />
          </div>

          <div className="space-y-6">
            {SECTIONS.map((s) => (
              <section key={s.key} className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
                <EditableText
                  settingKey={`${s.key}_title`}
                  defaultText={s.titleDefault}
                  as="h2"
                  className="font-display text-lg text-events-cream mb-2"
                />
                <EditableText
                  settingKey={`${s.key}_body`}
                  defaultText={s.bodyDefault}
                  as="p"
                  className="font-body text-events-cream/80 leading-relaxed"
                  multiline
                />
              </section>
            ))}
          </div>

          <div className="pt-2">
            <Button
              onClick={() => nav("/outsidedays26/connect")}
              className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
            >
              <EditableText settingKey="how_cta" defaultText="Got it, take me to Connect" as="span" />
            </Button>
          </div>
        </main>
        <ConnectBottomNav />
      </div>
    </EditableTextProvider>
  );
};

export default ConnectHowItWorks;
