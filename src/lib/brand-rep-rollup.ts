// Shared helper for "which reps/experts show up under a brand's card?"
// Implements the parent-company rollup:
//   - Parent (e.g. VF Corp) sees reps from itself + every child brand.
//   - A child marked `primary_child` (e.g. The North Face) sees the same full rollup.
//   - Any other child sees the full rollup too, but anyone with
//     `restricted_to_brand_names` only appears under brands listed there.

export interface BrandLike {
  id: string;
  name: string;
  aliases?: string[] | null;
  parent_brand_id?: string | null;
  primary_child?: boolean | null;
}

export interface RepLike {
  current_company?: string | null;
  restricted_to_brand_names?: string[] | null;
}

const norm = (s?: string | null) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function brandKeys(b: BrandLike): string[] {
  return [b.name, ...(b.aliases || [])].map(norm).filter(Boolean);
}

/** All brands in the same family as `target` (parent + every child). */
export function rollupFamily(target: BrandLike, all: BrandLike[]): BrandLike[] {
  const parent = target.parent_brand_id
    ? all.find((b) => b.id === target.parent_brand_id) || target
    : target;
  const children = all.filter((b) => b.parent_brand_id === parent.id);
  return [parent, ...children];
}

export function repsForBrand<R extends RepLike>(
  target: BrandLike,
  all: BrandLike[],
  reps: R[],
): R[] {
  const family = rollupFamily(target, all);
  const familyKeys = new Set(family.flatMap(brandKeys));
  const targetKeys = new Set(brandKeys(target));

  return reps.filter((rep) => {
    const co = norm(rep.current_company);
    if (!co || !familyKeys.has(co)) return false;

    const restricted = (rep.restricted_to_brand_names || [])
      .map(norm)
      .filter(Boolean);
    if (restricted.length) {
      // Rep only appears under brands explicitly listed.
      const allowed = new Set(restricted);
      const matchesTarget = [...targetKeys].some((k) => allowed.has(k));
      if (!matchesTarget) return false;
    }
    return true;
  });
}
