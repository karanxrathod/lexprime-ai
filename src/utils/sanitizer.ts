/**
 * Security utilities: HTML and URL sanitization
 */

/**
 * Validates whether a URL is a safe http/https web link.
 * Prevents javascript: or malicious protocol exploits.
 */
export function isSafeUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (/^javascript:/i.test(trimmed) || /^data:text\/html/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return false;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Strips potentially malicious tags and attributes from HTML strings
 * to prevent XSS attacks when rendering HTML reports or summaries.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  return html
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, object, embed, form, link, style tags
    .replace(/<(iframe|object|embed|form|link|meta|style)\b[^>]*>.*?<\/\1>/gis, '')
    .replace(/<(iframe|object|embed|form|link|meta|style)\b[^>]*\/?>/gis, '')
    // Remove dangerous attributes like onerror, onload, onclick, etc.
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    // Neutralize javascript: hrefs/srcs
    .replace(/(href|src)\s*=\s*(['"]?)\s*javascript:[^'"]*\2/gi, '$1="#"');
}

/**
 * Escapes characters for safe plain-text rendering in HTML.
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
