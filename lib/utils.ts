export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Strict URL sanitization to prevent XSS. Only allows http, https, and mailto.
 */
export function safeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();
  try {
    // If it's mailto:
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed)) {
      return trimmed;
    }
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    // If relative or invalid
    if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
      return trimmed;
    }
  }
  return "#";
}

/**
 * Extracts a readable domain/host from a URL for the card badge
 */
export function extractHost(urlStr?: string | null): string {
  if (!urlStr || urlStr === "#") return "local";
  try {
    const u = new URL(urlStr);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

/**
 * Returns user initials from a name (e.g. "Aarav Mehta" -> "AM")
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Checks if a due date is in the past
 */
export function isOverdue(due?: string | null, status?: string): boolean {
  if (!due || status === "done") return false;
  const today = new Date().toISOString().split("T")[0];
  return due < today;
}

/**
 * Format date nicely (e.g. "2026-11-30" -> "30 Nov 2026")
 */
export function formatDue(due?: string | null): string {
  if (!due) return "";
  try {
    const d = new Date(due + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return due;
  }
}
