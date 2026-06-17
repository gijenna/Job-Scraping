import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import { MapPin, Users, Sparkles } from "lucide-react";
import bgPhoto from "@/assets/mn26/AnthonyMarz_Basecamp-046.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const APPLY = "https://basecampoutdoor.typeform.com/MNExperts";
const VENUE_MAP =
  "https://www.google.com/maps/search/?api=1&query=Minneapolis+Convention+Center";

const MNEventDetails = () => (
  <section className="relative py-16 md:py-24 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src={bgPhoto.url} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(242,231,213,0.92)" }} />
    </div>

    <div className="relative z-10 max-w-4xl mx-auto px-4">
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
            defaultText="Two intentional Gatherings on the OR show floor. Apply for one or both."
            as="span"
            multiline
          />
        </p>
      </div>

      {/* Two session boxes */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Session 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: "rgba(26,37,32,0.1)" }}>
          <p className="uppercase font-semibold" style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}>
            <EditableText
              settingKey="event_session1_when"
              defaultText="THURSDAY · AUG 20 · 3–5 PM"
              as="span"
            />
          </p>
          <h3 className="font-display font-bold mt-3" style={{ fontSize: 28, color: FOREST }}>
            <EditableText settingKey="event_session1_title" defaultText="Happy Hour" as="span" />
          </h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(26,37,32,0.75)" }}>
            <EditableText
              settingKey="event_session1_body"
              defaultText="Open to everyone. Light bites, N/A drinks, and the most relaxed networking in the building."
              as="span"
              multiline
            />
          </p>
          <div className="mt-5">
            <EditableLink
              textKey="event_session1_cta_text"
              urlKey="event_session1_cta_url"
              defaultText="Apply for this session →"
              defaultUrl={APPLY}
              className="inline-block rounded-full font-bold transition hover:opacity-90"
              style={{ backgroundColor: CORAL, color: CREAM, fontSize: 14, padding: "10px 22px" }}
            />
          </div>
        </div>

        {/* Session 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: "rgba(26,37,32,0.1)" }}>
          <p className="uppercase font-semibold" style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}>
            <EditableText
              settingKey="event_session2_when"
              defaultText="FRIDAY · AUG 21 · 10 AM–12 PM"
              as="span"
            />
          </p>
          <h3 className="font-display font-bold mt-3" style={{ fontSize: 28, color: FOREST }}>
            <EditableText settingKey="event_session2_title" defaultText="Women's Brunch" as="span" />
          </h3>
          <span
            className="inline-block uppercase rounded-full font-semibold mt-2"
            style={{
              backgroundColor: CORAL,
              color: CREAM,
              fontSize: 11,
              padding: "4px 10px",
              letterSpacing: "1px",
            }}
          >
            <EditableText
              settingKey="event_session2_tag"
              defaultText="WOMEN IN THE OUTDOOR INDUSTRY"
              as="span"
            />
          </span>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(26,37,32,0.75)" }}>
            <EditableText
              settingKey="event_session2_body"
              defaultText="Morning gathering for women in the industry, and women trying to break in. Coffee, food, and real talk."
              as="span"
              multiline
            />
          </p>
          <div className="mt-5">
            <EditableLink
              textKey="event_session2_cta_text"
              urlKey="event_session2_cta_url"
              defaultText="Apply for this session →"
              defaultUrl={APPLY}
              className="inline-block rounded-full font-bold transition hover:opacity-90"
              style={{ backgroundColor: CORAL, color: CREAM, fontSize: 14, padding: "10px 22px" }}
            />
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
            defaultText="Inside OR Summer Market — no OR badge required to attend either Gathering."
            as="span"
          />
        </p>
      </div>
    </div>
  </section>
);

export default MNEventDetails;
