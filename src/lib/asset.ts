/**
 * Prefix a /public asset path with the deploy base path.
 * Locally this is empty; the GitHub Pages build sets NEXT_PUBLIC_BASE_PATH
 * to "/sherred-sticks" so raw <img src> paths resolve on the sub-path.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
