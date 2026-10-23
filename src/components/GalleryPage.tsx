import { useEffect, useRef, useState } from 'react';
import '../styles/gallery.css';
import WivorkHeader from './WivorkHeader';
import WivorkFooter from './WivorkFooter';
import InfiniteMenu from './InfiniteMenu';
import LoadingSplash from './LoadingSplash';
import CreationModal from './CreationModal';
import { useLenis } from '../lib/useLenis';
import { creations } from '../data/products';

const items = creations.map(piece => ({ ...piece, title: piece.name }));

// The sphere captures every touch on it, which would trap page scrolling on phones and tablets.
const sphereQuery = '(min-width: 701px) and (hover: hover) and (pointer: fine)';
const canUseSphere = () => window.matchMedia(sphereQuery).matches && !!document.createElement('canvas').getContext('webgl2');

function GallerySlider({ onSelect }: { onSelect: (item: (typeof items)[number]) => void }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const slides = track.current?.querySelectorAll('li');
    if (!slides) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
    }, { root: track.current, threshold: .6 });
    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, []);
  function go(index: number) {
    const slide = track.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  return <div className="gl-slider" role="region" aria-roledescription="carousel" aria-label="Our creations">
    <ul ref={track} className="gl-track">
      {items.map((item, index) => <li key={item.title} data-index={index} aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}: ${item.title}`}>
        <button className="gl-slider-photo" type="button" onClick={() => onSelect(item)} aria-label={`See prices for ${item.title}`}><img src={item.image} alt={item.alt} width="1672" height="941" loading={index < 2 ? 'eager' : 'lazy'} decoding="async"/></button>
        <div><span className="gl-kind">{item.kind}</span><h2>{item.title}</h2><p>{item.description}</p><button className="gl-slider-pricing" type="button" onClick={() => onSelect(item)}>See prices <span className="wk-arrow" aria-hidden="true">↗</span></button></div>
      </li>)}
    </ul>
    <div className="gl-slider-nav">
      <button type="button" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label="Previous piece">←</button>
      <span aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => go(Math.min(items.length - 1, active + 1))} disabled={active === items.length - 1} aria-label="Next piece">→</button>
    </div>
  </div>;
}

export default function GalleryPage() {
  useLenis();
  const [selected, setSelected] = useState<(typeof items)[number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  useEffect(() => {
    // Hold the splash until every gallery photo is downloaded, so the sphere or slider appears complete.
    let cancelled = false;
    let done = 0;
    const timeout = window.setTimeout(() => setLoading(false), 8000);
    const images = items.map(item => {
      const image = new Image();
      image.onload = image.onerror = () => {
        if (cancelled) return;
        setLoadProgress(Math.round(++done / items.length * 100));
        if (done === items.length) { clearTimeout(timeout); setLoading(false); }
      };
      image.src = item.image;
      return image;
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      for (const image of images) image.onload = image.onerror = null;
    };
  }, []);
  // Server render and phones get the slider; desktop upgrades to the sphere once mounted.
  const [sphere, setSphere] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(sphereQuery);
    const update = () => setSphere(canUseSphere());
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  // A one-time "drag to explore" cue for first visits; it fades for good after the first drag.
  const [hinted, setHinted] = useState(true);
  useEffect(() => { try { setHinted(localStorage.getItem('wk-gallery-dragged') === '1'); } catch { setHinted(false); } }, []);
  const dismissHint = () => {
    if (hinted) return;
    setHinted(true);
    try { localStorage.setItem('wk-gallery-dragged', '1'); } catch {}
  };
  return <>
    <LoadingSplash loading={loading} progress={loadProgress} message="Gathering our creations" onSkip={() => setLoading(false)}/>
    <WivorkHeader current="creations" theme="dark"/>
    <main className="wk-gallery-page">
      <section className="gl-intro"><p>Our creations</p><h1>Made by hand.<br/>Kept for years.</h1><p>{sphere ? 'Drag the sphere to explore. Click the piece in front to see prices and make it yours.' : 'Swipe through a few of our favourite pieces.'}</p></section>
      {sphere
        ? <section className="gl-sphere" aria-label="Gallery of wivork miniatures" aria-busy={loading} onPointerDownCapture={dismissHint}>{!loading && !hinted && <div className="gl-drag-hint" aria-hidden="true"><span className="gl-drag-arrow">←</span>Drag to explore<span className="gl-drag-arrow">→</span></div>}{!loading && <InfiniteMenu items={items} count={120} theme="dark" accentColor="#f4a950" autoplay={selected ? 0 : 3.5} onItemClick={(item: (typeof items)[number]) => setSelected(item)}/>}</section>
        : <section className="gl-mobile" aria-label="Gallery of wivork miniatures"><GallerySlider onSelect={setSelected}/></section>}
    </main>
    <CreationModal piece={selected} onClose={() => setSelected(null)}/>
    <WivorkFooter theme="dark"/>
  </>;
}
