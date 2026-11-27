/**
 * Read-through cache with a hard limit on how old a served copy can be.
 *
 * Entries live in the shared `cache` storage mount (fs driver, one directory
 * for all pm2 processes, see nuxt.config.ts), next to Nitro's own entries.
 *
 * WHY NOT defineCachedFunction({ swr: true })
 * Nitro's stale-while-revalidate returns an expired entry however old it is
 * and refreshes it in the background. A route that nobody requested for an
 * hour therefore answered its next request (a visitor, or Googlebot) with the
 * hour-old copy — news-sitemap.xml was missing the last 5-10 articles until
 * someone reloaded it. Here a copy is never served past `maxAge` while the CMS
 * is answering:
 *
 *   age < maxAge                → the cached copy
 *   older, or no copy           → rebuilt now; the caller waits for it
 *                                 (one rebuild per key per process at a time)
 *   rebuild fails, copy exists  → the old copy (late beats missing)
 *   rebuild fails, no copy      → throws
 *
 * Use it where freshness matters (the newest articles). The frozen archive
 * chunks keep Nitro's SWR: they don't change, so serving them stale is free.
 */

/** Bump when the shape of a cached value changes, so old entries are ignored. */
const VERSION = 1;

interface Entry<T> {
  value: T;
  /** When the value was built (ms since epoch). */
  builtAt: number;
}

export interface FreshCache<A extends unknown[], T> {
  (...args: A): Promise<T>;
  /** Rebuilds now whatever the age of the cached copy. */
  refresh(...args: A): Promise<T>;
}

export function defineFreshCache<A extends unknown[], T>(
  options: {
    name: string;
    /** Seconds. */
    maxAge: number;
    getKey: (...args: A) => string;
  },
  build: (...args: A) => Promise<T>
): FreshCache<A, T> {
  const pending = new Map<string, Promise<T>>();
  const storageKey = (key: string) => `fresh:v${VERSION}:${options.name}:${key}`;

  function rebuild(key: string, args: A): Promise<T> {
    let running = pending.get(key);
    if (!running) {
      running = (async () => {
        const value = await build(...args);
        const entry: Entry<T> = { value, builtAt: Date.now() };
        await useStorage("cache")
          .setItem(storageKey(key), entry)
          .catch((error) => console.warn(`[cache] ${options.name} ${key}: write failed`, error));
        return value;
      })().finally(() => pending.delete(key));
      pending.set(key, running);
    }
    return running;
  }

  const get = async (...args: A): Promise<T> => {
    const key = options.getKey(...args);
    const entry = await useStorage("cache")
      .getItem<Entry<T>>(storageKey(key))
      .catch(() => null);
    const cached = entry && entry.value !== undefined && entry.value !== null ? entry : null;

    if (cached && Date.now() - cached.builtAt < options.maxAge * 1000) {
      return cached.value;
    }
    try {
      return await rebuild(key, args);
    } catch (error) {
      if (cached) return cached.value;
      throw error;
    }
  };

  return Object.assign(get, {
    refresh: (...args: A) => rebuild(options.getKey(...args), args),
  });
}
