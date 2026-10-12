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
  { title: 'Printed in resin', text: 'The digital sculpture becomes something you can hold.', progress: .4 },
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

  useEffect(() => {
    if (!root.current || !stage.current || !canvas.current) return;
    const section = root.current;
    const sticky = stage.current;
    const surface = canvas.current;
    const context = surface.getContext('2d');
    if (!context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let scheduled = 0;
    let frame = 0;
    let currentChapter = -1;
    const detailed = new Map<number, HTMLImageElement>();
    const previews = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    // A small LRU cache avoids decoding all 481 frames into memory at once.
    const cacheLimit = 18;
    function draw() {
      const exact = detailed.get(frame);
      if (exact) { detailed.delete(frame); detailed.set(frame, exact); }
      let picture = exact;
      if (!picture) {
        let distance = Infinity;
        for (const [index, image] of [...previews, ...detailed]) {
          if (Math.abs(index - frame) < distance) {
            distance = Math.abs(index - frame); picture = image;
          }
        }
      }
      if (!picture) return;
      const scale = Math.max(surface.width / picture.naturalWidth, surface.height / picture.naturalHeight);
      const width = picture.naturalWidth * scale;
      const height = picture.naturalHeight * scale;
      context!.fillStyle = '#111';
      context!.fillRect(0, 0, surface.width, surface.height);
      context!.drawImage(picture, (surface.width - width) / 2, (surface.height - height) / 2, width, height);
      setReady(true);
    }
    function loadFrame(index: number) {
      if (disposed || detailed.has(index) || pending.has(index) || pending.size >= 6) return;
      pending.add(index);
      const picture = new Image();
      picture.decoding = 'async';
      picture.onload = () => {
        pending.delete(index);
        if (disposed) return;
        detailed.set(index, picture);
        while (detailed.size > cacheLimit) detailed.delete(detailed.keys().next().value!);
        draw();
        // Catch up if a fast scroll changed the target while this frame loaded.
        if (!detailed.has(frame)) loadFrame(frame);
      };
      picture.onerror = () => { pending.delete(index); };
      picture.src = framePath(index);
    }
    function update() {
      scheduled = 0;
      if (disposed) return;
      const range = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      frame = progressToFrame(progress);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      const nextChapter = motion.matches ? 3 : chapters.reduce((result, entry, index) => progress >= entry.progress ? index : result, 0);
      if (nextChapter !== currentChapter) { currentChapter = nextChapter; setChapter(nextChapter); }
      draw();
      loadFrame(frame);
      if (!motion.matches) {
        for (const offset of [-2, -1, 1, 2]) loadFrame(Math.min(LAST_FRAME, Math.max(0, frame + offset)));
      }
    }
    function schedule() { if (!scheduled && !disposed) scheduled = requestAnimationFrame(update); }
    function resize() {
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
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
    // Low-resolution samples cover the entire clip while detailed frames load.
    if (!motion.matches) {
      for (let sample = 0; sample <= 19; sample++) {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => { if (!disposed) { previews.set(sample * 24, image); schedule(); } };
        image.src = `/process/t_${String(sample).padStart(2, '0')}.webp`;
      }
    }
    resize();
    schedule();
    // Warm the HTTP cache with every frame once the page is idle so scrubbing never waits on the network.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let warmed = 0;
    let warmTimer = 0;
    function warm() {
      if (disposed || motion.matches || saveData) return;
      let inflight = 0;
      const next = () => {
        while (!disposed && inflight < 3 && warmed < TOTAL_FRAMES) {
          const probe = new Image();
          inflight++;
          probe.onload = probe.onerror = () => { inflight--; next(); };
          probe.src = framePath(warmed++);
        }
      };
      next();
    }
    warmTimer = window.setTimeout(warm, 1500);
    return () => {
      clearTimeout(warmTimer);
      disposed = true;
      cancelAnimationFrame(scheduled);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', motionChanged);
      detailed.clear(); previews.clear();
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
      <section className={`process-scroll${reduced ? ' reduced-motion' : ''}`} id="process-film" ref={root} aria-label="Scroll through the miniature-making process">
        <div className="process-sticky" ref={stage} data-side={chapter % 2 === 0 ? 'left' : 'right'}>
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
