import EditableText from "@/components/EditableText";
import { MapPin, Users, Sparkles } from "lucide-react";

interface MNEventDetailsProps {
  onApply?: () => void;
}

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const VENUE_MAP =
  "https://www.google.com/maps/search/?api=1&query=Minneapolis+Convention+Center";

const MNEventDetails = ({ onApply }: MNEventDetailsProps) => (
  <section className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: CREAM }}>
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <p className="font-display font-semibold text-sm uppercase tracking-widest" style={{ color: CORAL }}>
          <EditableText
            settingKey="event_tagline"
            defaultText="BASECAMP OUTDOOR × MINNEAPOLIS"
            as="span"
          />
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3" style={{ color: FOREST }}>
          <EditableText settingKey="event_headline" defaultText="The Event" as="span" />
        </h2>
        <p className="text-lg mt-3 max-w-xl mx-auto" style={{ color: "rgba(26,37,32,0.65)" }}>
          <EditableText
            settingKey="event_sub"
            defaultText="One intentional Gathering on the OR show floor. Apply to join as an Industry Expert."
            as="span"
            multiline
          />
        </p>
      </div>

      {/* Session box */}
      <div className="mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border max-w-xl mx-auto" style={{ borderColor: "rgba(26,37,32,0.1)" }}>
          <p className="uppercase font-semibold" style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}>
            <EditableText
              settingKey="event_session1_when"
              defaultText="THURSDAY · AUG 20 · 10:30 AM TO 12:30 PM"
              as="span"
            />
          </p>
          <h3 className="font-display font-bold mt-3" style={{ fontSize: 28, color: FOREST }}>
            <EditableText settingKey="event_session1_title" defaultText="Basecamp Outdoor Lounge" as="span" />
          </h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(26,37,32,0.75)" }}>
            <EditableText
              settingKey="event_session1_body"
              defaultText="A focused Thursday morning session for intentional conversations, mentoring, and industry connection."
              as="span"
              multiline
            />
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={onApply}
              className="inline-block rounded-full font-bold transition hover:opacity-90"
              style={{ backgroundColor: CORAL, color: CREAM, fontSize: 14, padding: "10px 22px" }}
            >
              <EditableText
                settingKey="event_session1_cta_text"
                defaultText="Build your Expert card →"
                as="span"
              />
            </button>
          </div>

        </div>

      </div>

      {/* Attendance + Venue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-xl p-5 shadow-sm border text-center" style={{ borderColor: "rgba(26,37,32,0.1)" }}>
          <Users className="w-6 h-6 mx-auto" style={{ color: CORAL }} />
          <p className="font-display font-bold mt-3 text-lg" style={{ color: FOREST }}>
            <EditableText settingKey="event_attendance" defaultText="150–250 people" as="span" />
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(26,37,32,0.55)" }}>
            <EditableText
              settingKey="event_attendance_note"
              defaultText="outdoor professionals & passive talent · intentionally intimate"
              as="span"
            />
          </p>
        </div>
        <a
          href={VENUE_MAP}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl p-5 shadow-sm border text-center hover:shadow-md transition-all group"
          style={{ borderColor: "rgba(26,37,32,0.1)" }}
        >
          <MapPin className="w-6 h-6 mx-auto" style={{ color: CORAL }} />
          <p className="font-display font-bold mt-3 text-sm leading-tight group-hover:text-events-coral transition-colors" style={{ color: FOREST }}>
            <EditableText
              settingKey="event_venue"
              defaultText="Minneapolis Convention Center"
              as="span"
            />
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(26,37,32,0.45)" }}>
            View on map ↗
          </p>
        </a>
      </div>

      <div className="rounded-xl px-6 py-4 text-center" style={{ backgroundColor: FOREST }}>
        <p className="font-display font-medium text-sm" style={{ color: CREAM }}>
          <Sparkles className="w-4 h-4 inline mr-2" style={{ color: "#E1B624" }} />
          <EditableText
            settingKey="event_year_note"
            defaultText="Inside OR Summer Market. Experts receive a free Outdoor Retailer badge."
            as="span"
          />
        </p>
      </div>
    </div>
  </section>
);

export default MNEventDetails;
