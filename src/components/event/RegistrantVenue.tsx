import { motion } from "framer-motion";
import { MapPin, Clock, CalendarDays, ArrowRight } from "lucide-react";

interface RegistrantVenueProps {
  venueName: string;
  address: string;
  googleMapsUrl: string;
  date: string;
  arrivalTime?: string;
  eventTime: string;
  description?: string;
  accentColor?: string;
  bgColor?: string;
  ticketUrl?: string;
  ticketLabel?: string;
}

const RegistrantVenue = ({
  venueName,
  address,
  googleMapsUrl,
  date,
  arrivalTime,
  eventTime,
  description,
  accentColor = "#E1B624",
  bgColor = "#F5E6D3",
  ticketUrl,
  ticketLabel = "Get Tickets",
}: RegistrantVenueProps) => {
  const textColor = bgColor === "#F5E6D3" ? "#19363B" : "#F5E6D3";
  const mutedTextColor = bgColor === "#F5E6D3" ? "#19363B99" : "#F5E6D399";

  return (
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>
            The Venue
          </p>
          <h2 className="font-headline font-bold text-3xl md:text-4xl" style={{ color: textColor }}>
            {venueName}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Google Maps embed */}
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${venueName}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accentColor }} />
            <div>
              <p className="font-display font-bold text-sm" style={{ color: textColor }}>{venueName}</p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm underline hover:opacity-80"
                style={{ color: mutedTextColor }}
              >
                {address}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accentColor }} />
            <div>
              <p className="font-display font-bold text-sm" style={{ color: textColor }}>Date</p>
              <p className="font-body text-sm" style={{ color: mutedTextColor }}>{date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accentColor }} />
            <div>
              <p className="font-display font-bold text-sm" style={{ color: textColor }}>Time</p>
              <p className="font-body text-sm" style={{ color: mutedTextColor }}>
                {eventTime}
                {arrivalTime && (
                  <>
                    <br />
                    <span className="text-xs">Doors: {arrivalTime}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 font-body text-sm text-center leading-relaxed max-w-2xl mx-auto"
            style={{ color: mutedTextColor }}
          >
            {description}
          </motion.p>
        )}

        {ticketUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold text-base shadow-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: accentColor, color: "#19363B" }}
            >
              {ticketLabel}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RegistrantVenue;
