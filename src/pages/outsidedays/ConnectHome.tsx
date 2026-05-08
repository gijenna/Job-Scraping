// Candidate-facing home with Map / List toggle. Reuses EventMapCanvas,
// MapBrandPanel, and ExpertCardMinimal. View preference persists in a cookie
// (NOT localStorage). Mobile-first: 375px target.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { X } from "lucide-react";
import { useEventMapBrands, type MapBrand } from "@/hooks/useEventMapBrands";
import { useEventMapLayouts } from "@/hooks/useEventMapLayouts";
import { useDenverExperts } from "@/hooks/useDenverExperts";
import EventMapCanvas from "@/components/event/EventMapCanvas";
import MapBrandPanel from "@/components/event/MapBrandPanel";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import { Button } from "@/components/ui/button";
import { faviconFromUrl } from "@/lib/url-logo";
import ConnectionForm from "@/components/connect/ConnectionForm";

const EVENT_SLUG = "denver26";
const EXPERT_ZONE_NAME = "Industry Expert Zone";
const VIEW_COOKIE = "od_view";

type View = "map" | "list";

const getCookie = (name: string): string | null => {
  const m = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[2]) : null;
};
const setCookie = (name: string, value: string) => {
  // 30 days, path=/, no httpOnly so we can read it back. Not sensitive.
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax`;
};

const brandLogo = (b: MapBrand) =>
  b.logo_url ||
  (b.website_url ? `https://logo.clearbit.com/${b.website_url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}` : null) ||
  faviconFromUrl(b.website_url || `${b.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`);

const ConnectHome = () => {
  const nav = useNavigate();
  const [view, setView] = useState<View>(() => (getCookie(VIEW_COOKIE) === "list" ? "list" : "map"));
  const [selected, setSelected] = useState<MapBrand | null>(null);
  const [showExpertList, setShowExpertList] = useState(false);

  const { brands } = useEventMapBrands(EVENT_SLUG);
  const { layouts } = useEventMapLayouts(EVENT_SLUG, "live");
  const { experts } = useDenverExperts();

  useEffect(() => { setCookie(VIEW_COOKIE, view); }, [view]);

  const expertZoneBrand = useMemo(
    () => brands.find((b) => b.name === EXPERT_ZONE_NAME) || null,
    [brands],
  );
  const sortedBrands = useMemo(
    () => [...brands].filter((b) => b.name !== EXPERT_ZONE_NAME).sort((a, b) => a.name.localeCompare(b.name)),
    [brands],
  );

  const handleBrandClick = (brand: MapBrand) => {
    if (brand.name === EXPERT_ZONE_NAME) {
      setShowExpertList(true);
    } else {
      setSelected(brand);
    }
  };

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-events-cream/10 flex items-center justify-between gap-3 sticky top-0 bg-events-teal/95 backdrop-blur z-30">
          <div>
            <h1 className="font-afterparty text-2xl leading-none">Outside Days</h1>
            <p className="text-[11px] font-body text-events-cream/60">Denver 26</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-events-cream/10 border border-events-cream/15 rounded-full p-0.5">
              {(["map", "list"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-full text-xs font-display uppercase tracking-wider transition-colors ${
                    view === v ? "bg-events-coral text-events-cream" : "text-events-cream/70"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nav("/outsidedays26/connect/profile")}
              className="text-events-cream/80 text-xs"
            >
              Profile
            </Button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1">
          {view === "map" ? (
            <div className="w-full h-[calc(100vh-64px)] bg-events-teal touch-none">
              <TransformWrapper
                initialScale={0.4}
                minScale={0.2}
                maxScale={4}
                centerOnInit
                wheel={{ step: 0.15 }}
                pinch={{ step: 5 }}
                doubleClick={{ disabled: false, step: 0.7 }}
              >
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "max-content", height: "max-content" }}
                >
                  <EventMapCanvas
                    brands={brands}
                    layouts={layouts}
                    interactive={false}
                    onClick={handleBrandClick}
                    expertZoneExperts={experts.map((e) => ({
                      id: e.id,
                      full_name: e.full_name,
                      photo_url: e.photo_url,
                      current_company: e.current_company,
                      job_title: e.job_title,
                    }))}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          ) : (
            <ListView
              brands={sortedBrands}
              expertZoneBrand={expertZoneBrand}
              onBrandClick={handleBrandClick}
            />
          )}
        </main>

        {/* Brand modal (existing component, read-only by design) */}
        <MapBrandPanel brand={selected} onClose={() => setSelected(null)} />

        {/* Expert zone list */}
        {showExpertList && (
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowExpertList(false)}>
            <div
              className="absolute inset-x-0 bottom-0 top-12 bg-events-teal rounded-t-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-events-teal/95 backdrop-blur px-4 py-3 border-b border-events-cream/10 flex items-center justify-between">
                <h2 className="font-display text-lg">Industry Expert Zone</h2>
                <button onClick={() => setShowExpertList(false)} className="w-8 h-8 rounded-full bg-events-cream/10 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {experts.map((e) => (
                  <ExpertCardMinimal key={e.id} expert={e} />
                ))}
                {experts.length === 0 && (
                  <p className="col-span-full text-center text-events-cream/50 font-body text-sm py-12">
                    Experts will appear here once published.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ImpersonationGate>
  );
};

const ListView = ({
  brands, expertZoneBrand, onBrandClick,
}: { brands: MapBrand[]; expertZoneBrand: MapBrand | null; onBrandClick: (b: MapBrand) => void }) => (
  <div className="px-4 py-5">
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {brands.map((b) => (
        <BubbleTile key={b.id} brand={b} onClick={() => onBrandClick(b)} />
      ))}
    </div>
    {expertZoneBrand && (
      <div className="mt-8">
        <h2 className="font-display text-sm uppercase tracking-wider text-events-cream/60 mb-3">Also at the event</h2>
        <button
          onClick={() => onBrandClick(expertZoneBrand)}
          className="w-full bg-events-cream/5 hover:bg-events-cream/10 border border-events-cream/15 rounded-2xl p-5 flex items-center gap-4 transition-colors text-left"
        >
          <div className="w-14 h-14 rounded-full bg-events-coral/20 flex items-center justify-center font-display text-events-coral text-xs uppercase">
            Zone
          </div>
          <div>
            <div className="font-display text-events-cream">Industry Expert Zone</div>
            <div className="text-xs font-body text-events-cream/60">Tap to meet the experts.</div>
          </div>
        </button>
      </div>
    )}
  </div>
);

const BubbleTile = ({ brand, onClick }: { brand: MapBrand; onClick: () => void }) => {
  const src = brandLogo(brand);
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-events-cream overflow-hidden flex items-center justify-center shadow-md border-2 border-white group-active:scale-95 transition-transform">
        {src ? (
          <img
            src={src}
            alt={brand.name}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span className="font-display font-bold text-events-teal text-sm">
            {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs text-events-cream/80 text-center font-body line-clamp-2 leading-tight">
        {brand.name}
      </span>
    </button>
  );
};

export default ConnectHome;
