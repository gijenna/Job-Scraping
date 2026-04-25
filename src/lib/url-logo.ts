/**
 * Helpers for deriving a logo image URL from a website URL.
 * Mirrors the pattern used across /pnw26 and other event pages: prefer an
 * explicit logo_url, otherwise fall back to the Google favicon service.
 */

export const domainFromUrl = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    const withProto = url.startsWith("http") ? url : `https://${url}`;
    return new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

export const faviconFromUrl = (url?: string | null, size = 128): string | null => {
  const domain = domainFromUrl(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
};

export const clearbitFromUrl = (url?: string | null): string | null => {
  const domain = domainFromUrl(url);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
};

/**
 * Resolve the best available image URL for a row that has an optional
 * `logo_url` and an optional `website_url`. Returns null only when neither is
 * usable.
 */
export const resolveLogoSrc = (
  logoUrl?: string | null,
  websiteUrl?: string | null,
): string | null => logoUrl || faviconFromUrl(websiteUrl);
