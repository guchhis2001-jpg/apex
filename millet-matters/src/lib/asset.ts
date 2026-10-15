/** Resolves a public asset path against Vite's base, so the build works at a domain root or under a sub-path. */
export const asset = (path: string) => (/^(https?:|data:|blob:)/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//, ''));
