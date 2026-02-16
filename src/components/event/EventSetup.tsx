import { motion } from "framer-motion";
import { Check, MonitorSmartphone, Wifi, Plug, Table, Flag, Package, Users, MapPin } from "lucide-react";

interface SetupItem {
  icon: typeof Check;
  label: string;
}

interface EventSetupProps {
  variant: "pnw" | "denver";
}

const baseItems: SetupItem[] = [
  { icon: Table, label: "6-ft skirted table & 2 chairs" },
  { icon: Flag, label: "Space for pull-up banner or backdrop behind your table" },
  { icon: Plug, label: "Power outlets available on request" },
  { icon: Wifi, label: "Venue Wi-Fi access" },
  { icon: Package, label: "Room for product samples, swag bags & handouts" },
  { icon: MonitorSmartphone, label: "Free appetizers and beverages" },
  { icon: MapPin, label: "Branded name placard & table signage" },
  { icon: Users, label: "Up to 5 brand reps included (more with Deluxe tier)" },
];

const variantNote: Record<string, string> = {
  pnw: "Hosted at U of O Portland's Campus Center at 2800 NE Liberty St, Portland, OR, 97211 — a modern, open-plan venue with excellent natural light and easy attendee flow between tables, panel stage, and networking areas.",
  denver: "Set inside the Outside Days Festival grounds in Denver — a high-energy, outdoor-adjacent venue with festival foot traffic flowing directly past the Gather career activation zone.",
};

const EventSetup = ({ variant }: EventSetupProps) => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Your Physical Setup
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            What You Get On-Site
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Every hiring table comes ready to go — so your team can focus on conversations, not logistics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-card border border-border rounded-xl p-8 md:p-10 shadow-card"
        >
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-8">
            {baseItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground font-body text-sm leading-relaxed">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              <span className="text-primary font-semibold">Venue note: </span>
              {variantNote[variant]}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventSetup;
