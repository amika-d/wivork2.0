import { TOTAL_FRAMES, framePath, keyframes, pickFrameSet } from './film';

type Connection = { saveData?: boolean; effectiveType?: string };

// Warms the browser cache for /process while the visitor is elsewhere, so its film opens without a wait.
// The film's worker fetches the same URLs, so it reuses these cached responses.
export function prefetchProcess() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (connection?.saveData || /2g/.test(connection?.effectiveType ?? '')) return () => {};
  let cancelled = false;
  const set = pickFrameSet();
  const warmed = new Set<string>();
  async function warm(urls: string[]) {
    for (const url of urls) {
      if (cancelled) return;
      if (warmed.has(url)) continue;
      warmed.add(url);
      try { await fetch(url, { priority: 'low' } as RequestInit); } catch { /* the film loads it later */ }
    }
  }
  function prefetchPage() {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/process';
    document.head.append(link);
  }
  // On idle: the page, the keyframes and the opening seconds (~0.4 MB on phones, ~0.6 MB on desktop).
  const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1500));
  const start = () => idle(() => {
    prefetchPage();
    const opening = Array.from({ length: 24 }, (_, index) => index);
    void warm([...keyframes(set), ...opening].map(index => framePath(set, index)));
  });
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  // Pointing at a link to /process signals intent: warm the whole film.
  function intent(event: Event) {
    const link = (event.target as Element).closest?.('a[href="/process"], a[href^="/process#"]');
    if (!link) return;
    void warm(Array.from({ length: TOTAL_FRAMES }, (_, index) => framePath(set, index)));
  }
  document.addEventListener('pointerover', intent, { passive: true });
  document.addEventListener('touchstart', intent, { passive: true });
  document.addEventListener('focusin', intent);
  return () => {
    cancelled = true;
    window.removeEventListener('load', start);
    document.removeEventListener('pointerover', intent);
    document.removeEventListener('touchstart', intent);
    document.removeEventListener('focusin', intent);
  };
}
