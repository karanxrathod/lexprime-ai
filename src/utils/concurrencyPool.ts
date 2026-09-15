/**
 * Concurrency Limiter Pool
 * Controls the number of simultaneous asynchronous tasks (e.g. Gemini API calls)
 * to avoid hitting API rate limits or overwhelming system resources.
 */

export async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  maxConcurrency = 3
): Promise<R[]> {
  if (items.length === 0) return [];

  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runner(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const poolSize = Math.min(maxConcurrency, items.length);
  const workers = Array.from({ length: poolSize }, () => runner());
  await Promise.all(workers);

  return results;
}
