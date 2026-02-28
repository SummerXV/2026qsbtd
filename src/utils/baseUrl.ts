/**
 * Base URL for public assets (images, music) so they work on GitHub Pages
 * and when opening with or without trailing slash.
 */
export function getPublicBaseUrl(): string {
  if (typeof window === 'undefined') {
    return import.meta.env.BASE_URL;
  }
  const pathname = window.location.pathname;
  // If we're at /2026qsbtd or /2026qsbtd/..., use first path segment as base
  const match = pathname.match(/^(\/[^/]+\/)/);
  if (match) return match[1];
  // Fallback: build-time base or root
  return import.meta.env.BASE_URL || '/';
}
