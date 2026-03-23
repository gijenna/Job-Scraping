import { useEffect } from "react";
import { useEditableTextContext } from "@/components/EditableTextProvider";

/**
 * Dynamically updates document title, favicon, and OG meta tags
 * based on event_settings for the current page slug.
 */
export const usePageMeta = (defaultTitle?: string) => {
  const { settings } = useEditableTextContext();

  useEffect(() => {
    // Title
    const title = settings["page_og_title"] || defaultTitle;
    if (title) document.title = title;

    // Favicon
    const favicon = settings["page_favicon"];
    if (favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon;
      link.type = favicon.endsWith(".svg") ? "image/svg+xml" : "image/png";
    }

    // OG / Twitter meta tags
    const metaMap: Record<string, string> = {
      "og:title": settings["page_og_title"] || defaultTitle || "",
      "og:description": settings["page_og_description"] || "",
      "og:image": settings["page_og_image"] || "",
      "twitter:title": settings["page_og_title"] || defaultTitle || "",
      "twitter:description": settings["page_og_description"] || "",
      "twitter:image": settings["page_og_image"] || "",
      "twitter:card": settings["page_og_image"] ? "summary_large_image" : "summary",
    };

    Object.entries(metaMap).forEach(([property, content]) => {
      if (!content) return;
      const isOg = property.startsWith("og:");
      const selector = isOg
        ? `meta[property="${property}"]`
        : `meta[name="${property}"]`;
      let el: HTMLMetaElement | null = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (isOg) el.setAttribute("property", property);
        else el.setAttribute("name", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    });
  }, [settings, defaultTitle]);
};
