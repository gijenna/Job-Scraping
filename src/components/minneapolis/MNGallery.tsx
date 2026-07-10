import EditableText from "@/components/EditableText";
import p1 from "@/assets/mn26/AnthonyMarz_Basecamp-083.jpg.asset.json";
import p2 from "@/assets/mn26/AnthonyMarz_Basecamp-094.jpg.asset.json";
import p3 from "@/assets/mn26/AnthonyMarz_PopflyOutside-126.jpg.asset.json";
import p4 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-045.jpg.asset.json";
import p5 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-197.jpg.asset.json";
import p6 from "@/assets/mn26/AnthonyMarz_Basecamp-139.jpg.asset.json";
import p7 from "@/assets/mn26/AnthonyMarz_Basecamp-169.jpg.asset.json";
import p8 from "@/assets/mn26/AnthonyMarz_Basecamp-179_1.jpg.asset.json";
import p9 from "@/assets/mn26/AnthonyMarz_Basecamp-211.jpg.asset.json";
import p10 from "@/assets/mn26/AnthonyMarz_Basecamp-022.jpg.asset.json";
import p11 from "@/assets/mn26/AnthonyMarz_Basecamp-025.jpg.asset.json";
import p12 from "@/assets/mn26/AnthonyMarz_Basecamp-037.jpg.asset.json";
import p13 from "@/assets/mn26/AnthonyMarz_Basecamp-046.jpg.asset.json";
import p14 from "@/assets/mn26/AnthonyMarz_Basecamp-057_1.jpg.asset.json";
import p15 from "@/assets/mn26/AnthonyMarz_Basecamp-138.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

const photos = [p6, p10, p7, p15, p8, p13, p11, p1, p12, p14, p2, p9, p3, p4, p5].map((p) => p.url);

const MNGallery = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center space-y-3 mb-12">
        <h2 className="font-normal" style={{ fontSize: 36, color: FOREST }}>
          <EditableText
            settingKey="gallery_headline"
            defaultText="What it actually feels like."
            as="span"
          />
        </h2>
        <p className="italic" style={{ fontSize: 16, color: FOREST, opacity: 0.7 }}>
          <EditableText
            settingKey="gallery_sub"
            defaultText="Moments from past Basecamp gatherings."
            as="span"
          />
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((src) => (
          <div
            key={src}
            className="overflow-hidden rounded-lg"
            style={{ aspectRatio: "3 / 4" }}
          >
            <img
              src={src}
              alt="Basecamp gathering"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MNGallery;
