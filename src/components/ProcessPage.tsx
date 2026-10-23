import { useEffect, useRef, useState } from 'react';
import '../styles/process.css';
import WivorkFooter from './WivorkFooter';
import WivorkHeader from './WivorkHeader';
import LoadingSplash from './LoadingSplash';
import { useLenis } from '../lib/useLenis';
import { canDecodeFrames, createFrameDecoder } from '../lib/frameDecoder';
import { LAST_FRAME, TOTAL_FRAMES, framePath, keyframes as keyframeIndices, pickFrameSet } from '../lib/film';

const contact = 'https://wa.me/94722227440';
const chapters = [
  { title: 'Your photograph', text: 'Every miniature begins with a moment worth keeping.', progress: 0 },
  { title: 'Sculpted in 3D', text: 'Your likeness takes shape, one detail at a time.', progress: .2 },
  { title: '3D printed', text: 'The digital sculpture becomes something you can hold.', progress: .4 },
  { title: 'Painted by hand', text: 'Color and careful finishing bring your miniature to life.', progress: .58 },
];
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
    if (!context || !canDecodeFrames()) { setLoading(false); setFallback(true); return; }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const decoder = createFrameDecoder();
    let disposed = false;
    let scheduled = 0;
    let frame = 0;
    let targetFrame = 0;
    let currentChapter = -1;
    let set = pickFrameSet();
    // Bumped whenever the frame set changes, so results for the old set are dropped.
    let generation = 0;
    let rendered: ImageBitmap | undefined;
    // Keyframes stay decoded so every part of the film has something to show; the rest is a small LRU.
    const keyframes = new Map<number, ImageBitmap>();
    const cache = new Map<number, ImageBitmap>();
    const pending = new Set<number>();
    const cacheLimit = () => set === 'm' ? 40 : 30;

    function shownFrame(picture: ImageBitmap) {
      for (const [index, image] of cache) if (image === picture) return index;
      for (const [index, image] of keyframes) if (image === picture) return index;
    }
    function draw() {
      let picture = cache.get(frame);
      if (picture) { cache.delete(frame); cache.set(frame, picture); }
      else {
        // Show the closest decoded frame while the exact one is on its way.
        let distance = Infinity;
        for (const source of [keyframes, cache]) for (const [index, image] of source) {
          if (Math.abs(index - frame) < distance) { distance = Math.abs(index - frame); picture = image; }
        }
      }
      if (!picture || picture === rendered) return;
      rendered = picture;
      const scale = Math.max(surface.width / picture.width, surface.height / picture.height);
      const width = picture.width * scale;
      const height = picture.height * scale;
      context!.fillStyle = '#111';
      context!.fillRect(0, 0, surface.width, surface.height);
      context!.drawImage(picture, (surface.width - width) / 2, (surface.height - height) / 2, width, height);
      setReady(true);
      const shownIndex = shownFrame(picture);
      if (shownIndex !== undefined) {
        // Exposed for checking in devtools whether the film keeps up with scrolling.
        surface.dataset.frame = `${shownIndex}/${targetFrame}`;
        const shownProgress = shownIndex / LAST_FRAME * .92 + .04;
        const nextChapter = chapters.reduce((result, entry, index) => shownProgress >= entry.progress ? index : result, 0);
        if (nextChapter !== currentChapter) { currentChapter = nextChapter; setChapter(nextChapter); }
      }
    }
    function store(index: number, bitmap: ImageBitmap) {
      cache.set(index, bitmap);
      while (cache.size > cacheLimit()) {
        const [oldest, image] = cache.entries().next().value!;
        cache.delete(oldest);
        if (image !== rendered && ![...keyframes.values()].includes(image)) image.close();
      }
    }
    function loadFrame(index: number, priority = false) {
      if (disposed || cache.has(index) || pending.has(index) || pending.size >= (priority ? 6 : 4)) return;
      pending.add(index);
      const requested = generation;
      decoder.load(framePath(set, index), true).then(bitmap => {
        if (disposed || requested !== generation || !bitmap) { bitmap?.close(); return; }
        store(index, bitmap);
        draw();
      }, () => {}).finally(() => {
        if (requested !== generation) return;
        pending.delete(index);
        // Catch up if a fast scroll moved the target while this frame loaded.
        if (!disposed && !cache.has(frame)) loadFrame(frame, true);
        bufferFrames();
      });
    }
    function bufferFrames() {
      if (motion.matches) return;
      const direction = targetFrame >= frame ? 1 : -1;
      for (let offset = 1; offset <= 8; offset++) loadFrame(Math.min(LAST_FRAME, Math.max(0, frame + offset * direction)));
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
    function clearFrames() {
      generation++;
      pending.clear();
      for (const image of new Set([...cache.values(), ...keyframes.values()])) image.close();
      cache.clear();
      keyframes.clear();
      rendered = undefined;
    }
    function resize() {
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 600 ? 1 : 1.5);
      rendered = undefined;
      surface.width = Math.max(1, Math.round(bounds.width * ratio));
      surface.height = Math.max(1, Math.round(bounds.height * ratio));
      // Rotating a phone switches between the portrait and landscape frame sets.
      const nextSet = pickFrameSet();
      if (nextSet !== set) { set = nextSet; clearFrames(); void preload(); }
      schedule();
    }
    // iOS can discard canvas pixels while the tab is in the background; repaint on return.
    function repaint() { if (!document.hidden) { rendered = undefined; schedule(); } }
    function motionChanged() { setReduced(motion.matches); schedule(); }
    setReduced(motion.matches);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', repaint);
    window.addEventListener('pageshow', repaint);

    const timeout = window.setTimeout(() => {
      if (disposed) return;
      setLoading(false);
      if (!keyframes.size && !cache.size) setFallback(true);
    }, 8000);
    async function preload() {
      const requested = generation;
      // Decode a sparse set of keyframes first so every stage is available before detail loads.
      const indices = motion.matches ? [LAST_FRAME] : keyframeIndices(set);
      let completed = 0;
      await Promise.all(indices.map(async index => {
        try {
          const bitmap = await decoder.load(framePath(set, index), true);
          if (disposed || requested !== generation || !bitmap) { bitmap?.close(); return; }
          keyframes.set(index, bitmap);
          draw();
        } catch { /* a missing keyframe just leaves a wider gap */ }
        if (requested !== generation) return;
        setLoadProgress(Math.round(++completed / indices.length * 100));
      }));
      if (disposed || requested !== generation) return;
      clearTimeout(timeout);
      setLoading(false);
      setFallback(!keyframes.size && !cache.size);
      schedule();
      // Warm the worker's compressed cache, nearest frames first, so later decodes need no network.
      if (motion.matches || saveData) return;
      const order = Array.from({ length: TOTAL_FRAMES }, (_, index) => index).sort((a, b) => Math.abs(a - frame) - Math.abs(b - frame));
      let next = 0;
      async function warm() {
        while (!disposed && requested === generation && next < order.length) {
          try { await decoder.load(framePath(set, order[next++]), false); } catch { /* retried on demand */ }
        }
      }
      await Promise.all([warm(), warm()]);
    }
    resize();
    schedule();
    void preload();
    return () => {
      clearTimeout(timeout);
      disposed = true;
      cancelAnimationFrame(scheduled);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', repaint);
      window.removeEventListener('pageshow', repaint);
      decoder.dispose();
      clearFrames();
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
    <WivorkHeader current="process" theme="dark"/>
    <main className="wk-process-page">
      <LoadingSplash loading={loading} progress={loadProgress} message="Preparing your miniature’s journey" onSkip={() => setLoading(false)}/>
      <section className="process-intro"><p className="process-label">The wivork process</p><h1>A moment.<br/>A miniature.</h1><p>Your photo becomes a sculpture, a resin print,<br/>and a hand-painted keepsake.</p><a href="#process-film" className="process-discover"><span>See how it’s made</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v10m-4-4 4 4 4-4"/></svg></a></section>
      <section className={`process-scroll${reduced || fallback ? ' reduced-motion' : ''}${fallback ? ' process-static' : ''}`} id="process-film" ref={root} aria-label="Scroll through the miniature-making process">
        <div className="process-sticky" aria-busy={loading} ref={stage} data-side={chapter % 2 === 0 ? 'left' : 'right'}>
          {fallback && <div className="process-fallback">
            <h2>From photo to keepsake</h2>
            <div>{chapters.map((entry, index) => <article key={entry.title}>
              <img src={['/process/reference-upload-fictional-white-sari-v4.webp', '/process/digital-sculpting-white-sari-v5.webp', '/process/3d-printing-white-sari-v3.webp', '/process/hand-painting-white-sari-v5.webp'][index]} alt="" loading="lazy" width="1280" height="720"/>
              <span>0{index + 1}</span><h3>{entry.title}</h3><p>{entry.text}</p>
            </article>)}</div>
          </div>}
          <picture><source media="(max-aspect-ratio: 1/1)" srcSet="/process/film/m/f_000.webp"/><img className="process-poster" src="/process/film/d/f_000.webp" alt="A portrait photograph at the beginning of the miniature-making process" style={{opacity: ready ? 0 : 1}}/></picture>
          <canvas ref={canvas} aria-label="Your photograph transforms into a digital sculpture, a resin print, and a painted miniature" role="img"/>
          <div className="process-scrim process-scrim-left" aria-hidden="true"/><div className="process-scrim process-scrim-right" aria-hidden="true"/>
          {chapters.map((entry, index) => <article key={entry.title} className={`process-chapter ${index % 2 === 0 ? 'is-left' : 'is-right'}`} data-active={index === chapter} aria-hidden={index !== chapter}>
            <span className="process-chapter-count">0{index + 1} <i>/ 04</i></span>
            <h2>{entry.title}</h2><p>{entry.text}</p>
          </article>)}
          <span className="process-scroll-hint">{reduced ? 'The finished miniature' : 'Scroll ↓'}</span>
          {!reduced && <nav className="process-chapter-nav" aria-label="Jump to a process stage">{chapters.map((entry, index) => <button key={entry.title} type="button" onClick={() => jumpTo(entry.progress)} aria-current={index === chapter ? 'step' : undefined}><span aria-hidden="true">0{index + 1}</span><b>{entry.title}</b></button>)}</nav>}
          <div className="process-progress" aria-hidden="true"><div ref={progressBar}/></div>
        </div>
      </section>
      <section className="process-cta" aria-labelledby="process-cta-title"><h2 id="process-cta-title">Your moment could be next.</h2><p>Send us a photo. We’ll help bring it to life.</p><a className="process-button" href={contact} target="_blank" rel="noreferrer">Create your miniature <span aria-hidden="true">↗</span></a></section>
    </main>
    <WivorkFooter theme="dark" backHref="#process-film" backLabel="Back to the film ↑"/>
  </>;
}
