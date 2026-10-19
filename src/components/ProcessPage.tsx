import { useEffect, useRef, useState } from 'react';
import '../styles/process.css';
import '../styles/home-dark.css';
import WivorkFooter from './WivorkFooter';
import WivorkHeader from './WivorkHeader';
import { useLenis } from '../lib/useLenis';

const TOTAL_FRAMES = 481;
const LAST_FRAME = TOTAL_FRAMES - 1;
const contact = 'https://wa.me/94722227440';
const chapters = [
  { title: 'Your photograph', text: 'Every miniature begins with a moment worth keeping.', progress: 0 },
  { title: 'Sculpted in 3D', text: 'Your likeness takes shape, one detail at a time.', progress: .2 },
  { title: '3D printed', text: 'The digital sculpture becomes something you can hold.', progress: .4 },
  { title: 'Painted by hand', text: 'Color and careful finishing bring your miniature to life.', progress: .58 },
];
const framePath = (frame: number) => `/process/frames/f_${String(frame).padStart(4, '0')}.webp`;
export function progressToFrame(progress: number) {
  return Math.round(Math.min(1, Math.max(0, (progress - .04) / .92)) * LAST_FRAME);
}

export default function ProcessPage() {
  useLenis();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!root.current || !stage.current || !canvas.current) return;
    const section = root.current;
    const sticky = stage.current;
    const surface = canvas.current;
    const context = surface.getContext('2d');
    if (!context) { setLoading(false); setFallback(true); return; }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let scheduled = 0;
    let frame = 0;
    let targetFrame = 0;
    let renderedPicture: HTMLImageElement | undefined;
    const frameUrls = new Map<number, string>();
    const controller = new AbortController();
    let currentChapter = -1;
    const detailed = new Map<number, HTMLImageElement>();
    const overview = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    let lastDetailed: HTMLImageElement | undefined;
    // A small LRU cache avoids decoding all 481 frames into memory at once.
    const cacheLimit = 24;
    function draw() {
      const exact = detailed.get(frame);
      if (exact) { detailed.delete(frame); detailed.set(frame, exact); }
      let picture = exact;
      if (!picture) {
        let distance = Infinity;
        for (const [index, image] of [...overview, ...detailed]) {
          if (Math.abs(index - frame) < distance) {
            distance = Math.abs(index - frame); picture = image;
          }
        }
      }
      picture ||= lastDetailed;
      if (!picture || picture === renderedPicture) return;
      renderedPicture = picture;
      // Keep a decoded detailed frame on screen while the next one downloads.
      // A thumbnail fallback would visibly reduce resolution during scrubbing.
      lastDetailed = picture;
      const scale = Math.max(surface.width / picture.naturalWidth, surface.height / picture.naturalHeight);
      const width = picture.naturalWidth * scale;
      const height = picture.naturalHeight * scale;
      context!.fillStyle = '#111';
      context!.fillRect(0, 0, surface.width, surface.height);
      context!.drawImage(picture, (surface.width - width) / 2, (surface.height - height) / 2, width, height);
      setReady(true);
      const shownIndex = [...overview, ...detailed].find(([, image]) => image === picture)?.[0];
      if (shownIndex !== undefined) {
        const shownProgress = shownIndex / LAST_FRAME * .92 + .04;
        const nextChapter = chapters.reduce((result, entry, index) => shownProgress >= entry.progress ? index : result, 0);
        if (nextChapter !== currentChapter) { currentChapter = nextChapter; setChapter(nextChapter); }
      }
    }
    function loadFrame(index: number, priority = false) {
      if (disposed || detailed.has(index) || pending.has(index) || pending.size >= (priority ? 7 : 4)) return;
      pending.add(index);
      const picture = new Image();
      picture.decoding = 'async';
      picture.fetchPriority = priority ? 'high' : 'low';
      picture.onload = async () => {
        try { await picture.decode(); }
        catch { pending.delete(index); return; }
        pending.delete(index);
        if (disposed) return;
        detailed.set(index, picture);
        while (detailed.size > cacheLimit) detailed.delete(detailed.keys().next().value!);
        draw();
        // Catch up if a fast scroll changed the target while this frame loaded.
        if (!detailed.has(frame)) loadFrame(frame, true);
        bufferFrames();
      };
      picture.onerror = () => { pending.delete(index); };
      picture.src = frameUrls.get(index) || framePath(index);
    }
    function bufferFrames() {
      if (motion.matches) return;
      const direction = targetFrame >= frame ? 1 : -1;
      for (let offset = 1; offset <= 10; offset++) {
        loadFrame(Math.min(LAST_FRAME, Math.max(0, frame + offset * direction)));
      }
      loadFrame(Math.min(LAST_FRAME, Math.max(0, frame - direction)));
    }
    function update() {
      scheduled = 0;
      if (disposed) return;
      const range = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      targetFrame = progressToFrame(progress);
      const gap = targetFrame - frame;
      frame = motion.matches || Math.abs(gap) <= 1 ? targetFrame : frame + Math.sign(gap) * Math.max(1, Math.round(Math.abs(gap) * .2));
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      draw();
      loadFrame(frame, true);
      bufferFrames();
      if (frame !== targetFrame) schedule();
    }
    function schedule() { if (!scheduled && !disposed) scheduled = requestAnimationFrame(update); }
    function resize() {
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 600 ? 1 : 1.5);
      renderedPicture = undefined;
      surface.width = Math.max(1, Math.round(bounds.width * ratio));
      surface.height = Math.max(1, Math.round(bounds.height * ratio));
      schedule();
    }
    function motionChanged() { setReduced(motion.matches); schedule(); }
    setReduced(motion.matches);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', motionChanged);
    resize();
    schedule();
    // Decode a sparse overview first so every stage is available before detail loads.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const overviewCount = window.innerWidth <= 600 ? 9 : 17;
    const overviewFrames = motion.matches ? [LAST_FRAME] : Array.from({ length: overviewCount }, (_, index) => Math.round(index * LAST_FRAME / (overviewCount - 1)));
    let completed = 0;
    let overviewCursor = 0;
    let timeout = window.setTimeout(() => {
      if (disposed) return;
      setLoading(false);
      if (!overview.size && !detailed.size) setFallback(true);
    }, 8000);
    async function fetchFrame(index: number) {
      const response = await fetch(framePath(index), { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(6000)]) });
      if (!response.ok) throw new Error('Frame unavailable');
      const blob = await response.blob();
      if (disposed) return;
      const url = URL.createObjectURL(blob);
      frameUrls.set(index, url);
      return url;
    }
    async function preloadOverview() {
      while (!disposed && overviewCursor < overviewFrames.length) {
        const index = overviewFrames[overviewCursor++];
        try {
          const url = await fetchFrame(index);
          if (!url || disposed) return;
          const image = new Image();
          image.src = url;
          await image.decode();
          if (disposed) return;
          overview.set(index, image);
          draw();
        } catch {
          if (disposed) return;
        }
        completed++;
        setLoadProgress(Math.round(completed / overviewFrames.length * 100));
      }
    }
    async function preloadDetails() {
      if (motion.matches || saveData || disposed) return;
      let nextIndex = 0;
      async function worker() {
        while (!disposed && nextIndex < TOTAL_FRAMES) {
          const index = nextIndex++;
          if (frameUrls.has(index)) continue;
          try { await fetchFrame(index); } catch { if (disposed) return; }
        }
      }
      await Promise.all(Array.from({ length: 3 }, worker));
    }
    Promise.all(Array.from({ length: 4 }, preloadOverview)).then(() => {
      if (disposed) return;
      clearTimeout(timeout);
      setLoading(false);
      setFallback(!overview.size && !detailed.size);
      schedule();
      void preloadDetails();
    });
    return () => {
      clearTimeout(timeout);
      controller.abort();
      for (const url of frameUrls.values()) URL.revokeObjectURL(url);
      disposed = true;
      cancelAnimationFrame(scheduled);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', motionChanged);
      detailed.clear();
      overview.clear();
      lastDetailed = undefined;
    };
  }, []);

  function jumpTo(progress: number) {
    if (!root.current || !stage.current) return;
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    const range = root.current.offsetHeight - stage.current.offsetHeight;
    const y = top + range * progress;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  return <>
    <WivorkHeader current="process"/>
    <main className="wk-process-page">
      <section className="process-intro"><p>THE WIVORK PROCESS</p><h1>A moment.<br/>A miniature.</h1><p>Your photo becomes a sculpture, a resin print,<br/>and a hand-painted keepsake.</p><a href="#process-film" className="process-discover"><span>See how it’s made</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v10m-4-4 4 4 4-4"/></svg></a></section>
      <section className={`process-scroll${reduced || fallback ? ' reduced-motion' : ''}${fallback ? ' process-static' : ''}`} id="process-film" ref={root} aria-label="Scroll through the miniature-making process">
        <div className="process-sticky" aria-busy={loading} ref={stage} data-side={chapter % 2 === 0 ? 'left' : 'right'}>
          {fallback && <div className="process-fallback">
            <h2>From photo to keepsake</h2>
            <div>{chapters.map((entry, index) => <article key={entry.title}>
              <img src={['/process/reference-upload-woman-v3.webp', '/process/digital-sculpting-v2.webp', '/process/3d-printing-v2.webp', '/process/hand-painting-woman-v4.webp'][index]} alt="" loading="lazy" width="1280" height="720"/>
              <span>0{index + 1}</span><h3>{entry.title}</h3><p>{entry.text}</p>
            </article>)}</div>
          </div>}
          {loading && <div className="process-loader" role="status" aria-live="polite">
            <img src="/wivork/logo.png" alt="Wivork" width="154" height="18"/>
            <p>Preparing your miniature’s journey</p>
            <div className="process-loader-track" role="progressbar" aria-label="Loading animation" aria-valuenow={loadProgress} aria-valuemin={0} aria-valuemax={100}><span style={{ transform: `scaleX(${loadProgress / 100})` }}/></div>
            <span>{loadProgress}%</span>
            <button onClick={() => setLoading(false)}>Continue while loading →</button>
          </div>}
          <img className="process-poster" src="/process/frames/f_0000.webp" alt="A portrait photograph at the beginning of the miniature-making process" style={{opacity: ready ? 0 : 1}}/>
          <canvas ref={canvas} aria-label="Your photograph transforms into a digital sculpture, a resin print, and a painted miniature" role="img"/>
          <div className="process-scrim process-scrim-left" aria-hidden="true"/><div className="process-scrim process-scrim-right" aria-hidden="true"/>
          {chapters.map((entry, index) => <article key={entry.title} className={`process-chapter ${index % 2 === 0 ? 'is-left' : 'is-right'}`} data-active={index === chapter} aria-hidden={index !== chapter}>
            <span className="process-chapter-count">0{index + 1} <i>/ 04</i></span>
            <h2>{entry.title}</h2><p>{entry.text}</p>
          </article>)}
          <span className="process-scroll-hint">{reduced ? 'The finished miniature' : 'Scroll ↓'}</span>
          {!reduced && <nav className="process-chapter-nav" aria-label="Jump to a process stage">{chapters.map((entry, index) => <button key={entry.title} onClick={() => jumpTo(entry.progress)} aria-current={index === chapter ? 'step' : undefined}>{entry.title}</button>)}</nav>}
          <div className="process-progress" aria-hidden="true"><div ref={progressBar}/></div>
        </div>
      </section>
      <section className="process-after"><div className="process-next"><h2>Your moment could be next.</h2><p>Send us a photo. We’ll help bring it to life.</p><a className="wk-primary" href={contact} target="_blank" rel="noreferrer">Create your miniature ↗</a></div></section>
    </main>
    <WivorkFooter theme="dark" backHref="#process-film" backLabel="Back to the film ↑"/>
  </>;
}
