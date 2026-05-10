// Candidate-facing home with Map / List toggle. Reuses EventMapCanvas,
// MapBrandPanel, and ExpertCardMinimal. View preference persists in a cookie
// (NOT localStorage). Mobile-first: 375px target.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { X, HelpCircle, Star, Users, User } from "lucide-react";
import connectLogo from "@/assets/connect-basecamp-outside-days.png";
import { useEventMapBrands, type MapBrand } from "@/hooks/useEventMapBrands";
import {
  candidateMe, candidateListStars, candidateMarkSeenIntro,
  connectNotesListMine,
} from "@/lib/connect-session";
import { useEventMapLayouts } from "@/hooks/useEventMapLayouts";
import { useDenverExperts } from "@/hooks/useDenverExperts";
import EventMapCanvas from "@/components/event/EventMapCanvas";
import MapBrandPanel from "@/components/event/MapBrandPanel";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import { Button } from "@/components/ui/button";
import { faviconFromUrl } from "@/lib/url-logo";
import ConnectPersonSheet from "@/components/connect/ConnectPersonSheet";
import NoteComposer, { NoteRecipient } from "@/components/connect/NoteComposer";
import { useEventMode, MODE_HEADER_COPY, MODE_INTRO_COPY } from "@/lib/connect-event-mode";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";

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
  const [sheetExpert, setSheetExpert] = useState<any | null>(null);
  const [completeness, setCompleteness] = useState<number | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [noteRecipientIds, setNoteRecipientIds] = useState<Set<string>>(new Set());
  const [showIntro, setShowIntro] = useState(false);
  const [headerStripDismissed, setHeaderStripDismissed] = useState(false);
  const [noteTarget, setNoteTarget] = useState<NoteRecipient | null>(null);

  const mode = useEventMode();
  const headerCopy = MODE_HEADER_COPY[mode];
  const introCopy = MODE_INTRO_COPY[mode];

  useEffect(() => {
    candidateMe().then((r) => {
      const subj = r?.session?.subject;
      const score = subj?.profile_completeness_score;
      if (typeof score === "number") setCompleteness(score);
      if (subj && subj.has_seen_map_intro === false) setShowIntro(true);
    }).catch(() => {});
    candidateListStars().then((r) => setStarred(new Set(r.starred_brand_ids || []))).catch(() => {});
    connectNotesListMine().then((r) => {
      setNoteRecipientIds(new Set((r.notes || []).map((n) => n.recipient_id)));
    }).catch(() => {});
  }, []);

  const dismissIntro = async () => {
    setShowIntro(false);
    try { await candidateMarkSeenIntro(); } catch {}
  };

  const { brands } = useEventMapBrands(EVENT_SLUG);
  const { layouts } = useEventMapLayouts(EVENT_SLUG, "draft");
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
    <EditableTextProvider pageSlug="outsidedays26-connect">
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream flex flex-col">
        {/* Header */}
        <header className="px-3 sm:px-4 py-3 border-b border-events-cream/10 flex items-center justify-between gap-1.5 sm:gap-3 sticky top-0 bg-events-teal/95 backdrop-blur z-30">
          <div className="flex items-center gap-2 min-w-0">
            <img src={connectLogo} alt="Outside Days" className="h-8 sm:h-10 w-auto shrink-0" />
            <EditableText settingKey="home_header_subtitle" defaultText="Denver 26" as="p" className="hidden sm:block text-[11px] font-body text-events-cream/60" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex bg-events-cream/10 border border-events-cream/15 rounded-full p-0.5">
              {(["map", "list"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors ${
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
              onClick={() => nav("/outsidedays26/connect/how-it-works")}
              aria-label="How this works"
              className="text-events-cream/70 w-10 h-10 p-0"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nav("/outsidedays26/connect/connections")}
              aria-label="Connections"
              className="text-events-cream/80 text-xs w-10 h-10 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-2"
            >
              <Users className="w-4 h-4 sm:hidden" />
              <EditableText settingKey="home_nav_connections" defaultText="Connections" as="span" className="hidden sm:inline" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nav("/outsidedays26/connect/profile")}
              aria-label="Profile"
              className="text-events-cream/80 text-xs w-10 h-10 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-2"
            >
              <User className="w-4 h-4 sm:hidden" />
              <EditableText settingKey="home_nav_profile" defaultText="Profile" as="span" className="hidden sm:inline" />
            </Button>
          </div>
        </header>

        {/* Mode-aware header strip */}
        {!headerStripDismissed && (
          <div className="border-l-4 border-events-coral bg-events-cream/5 px-4 py-2.5 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-display text-sm text-events-cream">{headerCopy.title}</div>
              <div className="font-body text-[12px] text-events-cream/70 leading-snug">{headerCopy.body}</div>
            </div>
            <button
              onClick={() => setHeaderStripDismissed(true)}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Your shortlist */}
        {starred.size > 0 && (
          <div className="px-4 py-3 border-b border-events-cream/10">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-3.5 h-3.5 fill-events-coral text-events-coral" />
              <span className="font-display text-[11px] uppercase tracking-wider text-events-cream/70">
                Your shortlist ({starred.size})
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {brands.filter((b) => starred.has(b.id)).map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBrandClick(b)}
                  className="shrink-0 flex flex-col items-center gap-1 w-14"
                >
                  <div className="w-12 h-12 rounded-full bg-events-cream overflow-hidden flex items-center justify-center border-2 border-events-coral shadow-sm">
                    {brandLogo(b) ? (
                      <img src={brandLogo(b)!} alt={b.name} className="w-9 h-9 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <span className="font-display text-[10px] text-events-teal">
                        {b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-body text-events-cream/70 line-clamp-1">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile completeness banner */}
        {completeness !== null && completeness < 80 && !bannerDismissed && (
          <div className="px-4 py-3 bg-events-coral text-events-teal flex items-center gap-3">
            <p className="flex-1 font-body text-sm">
              Brands filter on full profiles. Yours is {completeness}% complete.
            </p>
            <button
              onClick={() => nav("/outsidedays26/connect/full")}
              className="font-display text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-events-teal text-events-cream hover:bg-events-teal/90"
            >
              Complete it
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full bg-events-teal/10 hover:bg-events-teal/20 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
              starred={starred}
              noteBrandIds={noteRecipientIds}
            />
          )}
        </main>

        {/* Brand modal (candidate mode for tap-to-log) */}
        <MapBrandPanel
          brand={selected}
          onClose={() => setSelected(null)}
          candidateMode
          starredBrandIds={starred}
          onStarChanged={(brandId, isStarred) => {
            setStarred((prev) => {
              const next = new Set(prev);
              if (isStarred) next.add(brandId); else next.delete(brandId);
              return next;
            });
          }}
          onSendNote={(rec) => setNoteTarget(rec)}
          noteRecipientIds={noteRecipientIds}
        />

        <NoteComposer
          open={!!noteTarget}
          recipient={noteTarget}
          onClose={() => setNoteTarget(null)}
          onSaved={(rid, hasNote) => {
            setNoteRecipientIds((prev) => {
              const next = new Set(prev);
              if (hasNote) next.add(rid); else next.delete(rid);
              return next;
            });
          }}
        />

        {/* First-time intro modal */}
        {showIntro && (
          <div className="fixed inset-0 z-[55] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={dismissIntro}>
            <div
              className="bg-events-teal text-events-cream rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-afterparty text-3xl">{introCopy.title}</h2>
              <p className="font-body text-events-cream/80">{introCopy.body}</p>
              <div className="flex gap-2 pt-2">
                <Button onClick={dismissIntro} className="flex-1 bg-events-coral hover:bg-events-coral/90 text-events-cream">
                  Got it
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { dismissIntro(); nav("/outsidedays26/connect/how-it-works"); }}
                  className="text-events-cream/70"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Expert zone list */}
        {showExpertList && (
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowExpertList(false)}>
            <div
              className="absolute inset-x-0 bottom-0 top-12 bg-events-teal rounded-t-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-events-teal/95 backdrop-blur px-4 py-3 border-b border-events-cream/10 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg">Industry Expert Zone</h2>
                  <p className="text-[11px] font-body text-events-cream/60">Tap a face to view their card.</p>
                </div>
                <button onClick={() => setShowExpertList(false)} className="w-8 h-8 rounded-full bg-events-cream/10 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {experts.map((e) => (
                  <ExpertCardMinimal key={e.id} expert={e} disableExpand onClick={() => setSheetExpert(e)} />
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

        <ConnectPersonSheet
          open={!!sheetExpert}
          expert={sheetExpert}
          subjectType="expert"
          onClose={() => setSheetExpert(null)}
          onNoteChanged={(rid, hasNote) => {
            setNoteRecipientIds((prev) => {
              const next = new Set(prev);
              if (hasNote) next.add(rid); else next.delete(rid);
              return next;
            });
          }}
        />
      </div>
    </ImpersonationGate>
    </EditableTextProvider>
  );
};

const ListView = ({
  brands, expertZoneBrand, onBrandClick, starred, noteBrandIds,
}: {
  brands: MapBrand[]; expertZoneBrand: MapBrand | null; onBrandClick: (b: MapBrand) => void;
  starred: Set<string>; noteBrandIds: Set<string>;
}) => {
  const [starredOnly, setStarredOnly] = useState(false);
  const visible = starredOnly ? brands.filter((b) => starred.has(b.id)) : brands;
  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setStarredOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-display uppercase tracking-wider border transition-colors ${
            starredOnly
              ? "bg-events-coral text-events-cream border-events-coral"
              : "bg-events-cream/5 text-events-cream/70 border-events-cream/15 hover:border-events-cream/40"
          }`}
        >
          <Star className={`w-3 h-3 inline mr-1 -mt-0.5 ${starredOnly ? "fill-current" : ""}`} />
          Starred only
        </button>
        {starredOnly && (
          <span className="text-[10px] font-body text-events-cream/50">{visible.length} shown</span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {visible.map((b) => (
          <BubbleTile
            key={b.id}
            brand={b}
            onClick={() => onBrandClick(b)}
            starred={starred.has(b.id)}
            hasNote={noteBrandIds.has(b.id)}
          />
        ))}
        {visible.length === 0 && (
          <p className="col-span-full text-center text-events-cream/50 font-body text-sm py-8">
            Star a few brands to build your shortlist.
          </p>
        )}
      </div>
      {expertZoneBrand && !starredOnly && (
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
};

const BubbleTile = ({
  brand, onClick, starred, hasNote,
}: { brand: MapBrand; onClick: () => void; starred: boolean; hasNote: boolean }) => {
  const src = brandLogo(brand);
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-events-cream overflow-hidden flex items-center justify-center shadow-md border-2 border-white group-active:scale-95 transition-transform">
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
        {starred && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-events-coral text-events-cream flex items-center justify-center shadow ring-2 ring-events-teal">
            <Star className="w-2.5 h-2.5 fill-current" />
          </span>
        )}
        {hasNote && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-events-yellow text-events-teal flex items-center justify-center shadow ring-2 ring-events-teal text-[10px]">
            ✉
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
