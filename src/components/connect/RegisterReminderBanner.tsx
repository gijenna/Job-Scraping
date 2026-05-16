// Small reminder banner shown on Connect entry/signup routes for visitors
// who arrived via a share link and may not yet have registered for the
// event itself. Not coral so it doesn't compete with primary CTAs.

import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";

const RegisterReminderBanner = () => {
  return (
    <div className="bg-events-cream/5 border border-events-cream/15 rounded-xl px-4 py-2.5 mb-4 text-center">
      <p className="font-body text-xs sm:text-sm text-events-cream/80 leading-snug">
        <EditableText
          settingKey="connect_register_reminder_prefix"
          defaultText="Haven't registered for Outside Days yet?"
          as="span"
        />
        {" "}
        <EditableLink
          textKey="connect_register_reminder_link_text"
          urlKey="connect_register_reminder_link_url"
          defaultText="Register here →"
          defaultUrl="https://basecampoutdoor.typeform.com/outsidedays"
          className="text-events-coral font-display font-semibold underline underline-offset-2 hover:text-events-coral/80"
        />
      </p>
    </div>
  );
};

export default RegisterReminderBanner;
