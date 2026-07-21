/**
 * Resolve a public asset path against Vite's base URL, so images work both
 * locally ("/") and on GitHub Pages ("/nammafishmart.com/").
 *   asset("/images/foo.jpg") -> "/nammafishmart.com/images/foo.jpg" (prod)
 *
 * Absolute URLs (uploaded images: data URLs, Supabase Storage http(s) URLs,
 * or protocol-relative) are already complete and pass through untouched.
 */
export const asset = (p: string) => {
  if (/^(https?:|data:|blob:|\/\/)/.test(p)) return p;
  return `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;
};
