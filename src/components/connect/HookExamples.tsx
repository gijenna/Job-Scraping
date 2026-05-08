import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const HOOK_EXAMPLE_PLACEHOLDER =
  "I'm the designer brands hire when they want soft goods that actually perform in the field.";

export const PITCH_EXAMPLE_PLACEHOLDER =
  "I'm a senior product designer with 8 years building soft goods for outdoor brands. My last role at a $30M growth-stage brand, I led the redesign of our flagship pack line and cut warranty returns by 22%. I'm drawn to brands that take materials and fit seriously. I'd love to talk to anyone hiring for product or design leadership.";

const CATEGORIES: { name: string; items: string[] }[] = [
  {
    name: "Marketing & growth",
    items: [
      "I cut content production time 60% with AI workflows while doubling output quality.",
      "I turn $5K paid social budgets into $50K in tracked revenue for outdoor brands under $10M.",
      "I built an email program that drove 38% of revenue at a DTC apparel brand last year.",
      "I make brands that nobody's heard of into the brand everyone's talking about.",
    ],
  },
  {
    name: "Design & creative",
    items: [
      "I design technical outerwear that cuts returns by 20%+ by fixing fit issues nobody documented.",
      "I'm the designer brands hire when they want soft goods that actually perform in the field.",
      "I shoot product photography that converts. My last brand saw 31% lift from new PDP imagery.",
      "I rebuild brand identities for outdoor companies stuck looking like their 2014 selves.",
    ],
  },
  {
    name: "Sales & business development",
    items: [
      "I closed $2.3M in new wholesale accounts last year, 80% in specialty outdoor retail.",
      "I open doors at REI, Backcountry, and Public Lands. Same buyers, different pitch.",
      "I'm the sales rep small outdoor brands hire when they need to graduate from farmers' markets to real distribution.",
    ],
  },
  {
    name: "Product & development",
    items: [
      "I take ideas from sketch to shelf in 9 months instead of 18.",
      "I've launched 40+ SKUs in technical apparel. None have ever been recalled.",
      "I build supply chains that survive tariffs, port strikes, and your CEO's last-minute color changes.",
    ],
  },
  {
    name: "Operations & supply chain",
    items: [
      "I take messy supply chains and make them boring. Cut lead times 40% at my last brand.",
      "I'm the operations hire that pays for themselves in the first quarter.",
      "I rebuild factory relationships for brands that have outgrown their original cut-and-sew partners.",
    ],
  },
  {
    name: "Retail & e-commerce",
    items: [
      "I run e-comm sites that convert at 4%+ in a category that averages 2.1%.",
      "I've opened 12 outdoor retail locations. Three of them in the wrong city, on purpose.",
      "I'm the merchandiser brands call when their inventory is upside down and they need to sell through without killing margin.",
    ],
  },
  {
    name: "People, HR & culture",
    items: [
      "I build hiring pipelines for outdoor brands that are tired of getting the same 5 candidates.",
      "I've reduced turnover at two outdoor brands by 40%+ without raising salaries.",
      "I'm the People person who actually likes the operations side of HR.",
    ],
  },
  {
    name: "Tech & engineering",
    items: [
      "I build internal tools that turn 4-hour weekly reports into automated dashboards.",
      "I'm the only Shopify dev I know who's also a wilderness EMT. I get the customer.",
      "I've shipped iOS apps for 3 outdoor brands. All in the App Store, all rated 4.5+.",
    ],
  },
  {
    name: "Guiding, outdoor education & field work",
    items: [
      "I've led 200+ multi-day backcountry trips with zero incidents and a 70% repeat client rate.",
      "I'm a WFR-certified guide who can also write your trail blog and run your Instagram.",
      "I'm the field staffer who shows up early, stays late, and trains the next person up.",
    ],
  },
  {
    name: "Writing, editing & journalism",
    items: [
      "I write the kind of brand stories that get reposted by Outside, not buried in your blog.",
      "I'm a freelance writer who can ghost your CEO's LinkedIn AND ship 3,000-word features.",
      "I edit gear reviews that don't sound like they were written by AI or a sycophant.",
    ],
  },
  {
    name: "Sustainability & conservation",
    items: [
      "I help outdoor brands turn vague sustainability claims into B Corp-defensible reports.",
      "I've run habitat restoration on 15,000+ acres. I know what 'land stewardship' actually costs.",
      "I'm a climate writer who can translate IPCC reports into copy that doesn't make readers tune out.",
    ],
  },
  {
    name: "Cheekier / personality-forward",
    items: [
      "I'm the marketer your brand consultant told you to hire 6 months ago.",
      "I do the unsexy operations work so your founder can keep doing podcasts.",
      "I'm a senior content strategist who hasn't burned out yet. Ask me how.",
      "I make spreadsheets that other operators screenshot and send to their friends.",
    ],
  },
  {
    name: "Career-transition framing",
    items: [
      "12 years in tech marketing, ready to apply it to brands I actually use every weekend.",
      "I'm a Big 4 consultant who's done with PowerPoint. I want to help an outdoor brand actually grow.",
      "I've sold $40M of enterprise software. Now I want to sell skis.",
    ],
  },
];

interface Props {
  onPick: (text: string) => void;
  maxLen?: number;
}

const HookExamples = ({ onPick, maxLen }: Props) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <div className="mt-4 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4 space-y-2">
      <div>
        <p className="font-display text-sm uppercase tracking-wider text-events-yellow">
          Stuck? Make one of these your own
        </p>
        <p className="text-[11px] text-events-cream/55 font-body mt-1">
          Examples only, not part of the quiz. Tap one to drop it into the field above and edit it from there.
        </p>
      </div>
      <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
        {CATEGORIES.map((cat) => {
          const isOpen = !!open[cat.name];
          return (
            <div key={cat.name} className="rounded-md bg-events-cream/5 border border-events-cream/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen((p) => ({ ...p, [cat.name]: !p[cat.name] }))}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-body text-events-cream hover:bg-events-cream/10"
              >
                <span>{cat.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <ul className="px-3 pb-3 pt-1 space-y-1.5">
                  {cat.items.map((it) => {
                    const tooLong = maxLen ? it.length > maxLen : false;
                    return (
                      <li key={it}>
                        <button
                          type="button"
                          onClick={() => onPick(maxLen ? it.slice(0, maxLen) : it)}
                          className="text-left text-[13px] font-body text-events-cream/85 hover:text-events-coral leading-snug w-full"
                          title={tooLong ? "Will be trimmed to fit the character limit" : undefined}
                        >
                          {it}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HookExamples;
