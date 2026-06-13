import EditableText from "@/components/EditableText";
import p1 from "@/assets/mn26/AnthonyMarz_Basecamp-083.jpg.asset.json";
import p2 from "@/assets/mn26/AnthonyMarz_Basecamp-094.jpg.asset.json";
import p3 from "@/assets/mn26/AnthonyMarz_PopflyOutside-126.jpg.asset.json";
import p4 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-045.jpg.asset.json";
import p5 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-197.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const SAGE = "#A8B5A0";

const photos = [p1.url, p2.url, p3.url, p4.url, p5.url];

const MNGallery = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="max-w-6xl mx-auto">
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {photos.map((src, i) => (
          <div
            key={src}
            className={`overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""}`}
            style={{ aspectRatio: i === 0 ? "1 / 1" : "3 / 4" }}
          >
            <img
              src={src}
              alt="Basecamp gathering"
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MNGallery;
