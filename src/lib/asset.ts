/**
 * Resolve a public asset path against Vite's base URL, so images work both
 * locally ("/") and on GitHub Pages ("/nammafishmart.com/").
 *   asset("/images/foo.jpg") -> "/nammafishmart.com/images/foo.jpg" (prod)
 */
export const asset = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;
