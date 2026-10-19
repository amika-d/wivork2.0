import { useEffect, useRef, useState } from 'react';
import '../styles/gallery.css';
import '../styles/home-dark.css';
import WivorkHeader from './WivorkHeader';
import WivorkFooter from './WivorkFooter';
import InfiniteMenu from './InfiniteMenu';
import LoadingSplash from './LoadingSplash';
import { useLenis } from '../lib/useLenis';

const contact = 'https://wa.me/94722227440';
const ask = (piece: string) => `${contact}?text=${encodeURIComponent(`Hi wivork, I’d love a miniature like the ${piece} in your gallery.`)}`;
const items = [
  { image: '/work/hero-16x9/uncle-studio-v1.webp', title: 'Uncle', description: 'A portrait bust in a dark suit and red tie, painted by hand.', alt: 'Hand-painted portrait bust of a man with a moustache, dark suit and red patterned tie on a gray oval base' },
  { image: '/wivork/products/couple-bust.webp', title: 'Couple bust', description: 'Two people sculpted together on one oval base.', alt: 'Hand-painted portrait bust of a couple on a teal oval base' },
  { image: '/work/hero-16x9/thihara-2-5-blur-landscape.webp', title: 'White sari', description: 'A portrait miniature with a brooch, painted by hand.', alt: 'Hand-painted miniature of a woman in a white sari with a brooch' },
  { image: '/work/hero-16x9/yellow-sari-studio-v2.webp', title: 'Yellow sari', description: 'Patterned borders, picked out one stroke at a time.', alt: 'Hand-painted miniature of a woman in a yellow sari' },
  { image: '/work/hero-16x9/blue-sari-studio-v2.webp', title: 'Blue sari', description: 'Floral details on a full-length signature figure.', alt: 'Hand-painted miniature of a woman in a blue sari' },
  { image: '/work/hero-16x9/green-shirt-studio-v2.webp', title: 'Green shirt', description: 'Everyday clothes, with character in every detail.', alt: 'Hand-painted miniature of a man in a green shirt' },
  { image: '/work/hero-16x9/black-jacket-studio-v2.webp', title: 'Backpack', description: 'A black outfit and tan backpack, made to last.', alt: 'Hand-painted miniature in a black outfit with a tan backpack' },
  { image: '/wivork/products/signature-miniature.webp', title: 'Red sari', description: 'A head-to-toe likeness with a gold handbag.', alt: 'Hand-painted miniature of a woman in a red sari with a gold handbag' },
];

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
        <img src={item.image} alt={item.alt} width="1672" height="941" loading={index < 2 ? 'eager' : 'lazy'} decoding="async"/>
        <div><h2>{item.title}</h2><p>{item.description}</p><button className="gl-slider-pricing" type="button" onClick={() => onSelect(item)}>See prices ↗</button></div>
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
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected || !dialog.current) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [selected]);
  const isBust = selected?.title === 'Couple bust' || selected?.title === 'Uncle';
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
  return <>
    <LoadingSplash loading={loading} progress={loadProgress} message="Gathering our creations" onSkip={() => setLoading(false)}/>
    <WivorkHeader current="creations"/>
    <main className="wk-gallery-page">
      <section className="gl-intro"><p>OUR CREATIONS</p><h1>Made by hand.<br/>Kept for years.</h1><p>{sphere ? 'Drag the sphere to explore. Click the piece in front to see prices and make it yours.' : 'Swipe through a few of our favourite pieces.'}</p></section>
      {sphere
        ? <section className="gl-sphere" aria-label="Gallery of wivork miniatures" aria-busy={loading}>{!loading && <InfiniteMenu items={items} count={120} theme="dark" accentColor="#f4a950" autoplay={selected ? 0 : 3.5} onItemClick={(item: (typeof items)[number]) => setSelected(item)}/>}</section>
        : <section className="gl-mobile" aria-label="Gallery of wivork miniatures"><GallerySlider onSelect={setSelected}/></section>}
    </main>
    <dialog ref={dialog} className="gl-modal" aria-labelledby="gl-modal-title" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selected && <div className="gl-modal-content" data-lenis-prevent>
        <button className="gl-modal-close" type="button" aria-label="Close pricing" onClick={() => setSelected(null)} autoFocus>×</button>
        <div className="gl-modal-photo"><img src={selected.image} alt={`${selected.title}, a hand-painted ${isBust ? 'portrait bust' : 'miniature'}`} width="1672" height="941"/></div>
        <div className="gl-modal-copy">
          <span className="gl-modal-eyebrow">PERSONALLY YOURS</span>
          <h2 id="gl-modal-title">A little of your world.</h2>
          <p>{selected.description} We’ll create yours from your own photographs.</p>
          <dl className="gl-modal-prices">
            <div><dt>Single {isBust ? 'portrait bust' : 'miniature'}<small>{isBust ? '5cm · Upper-body portrait' : '18cm · Full-length figure'}</small></dt><dd>Rs. {isBust ? '1,800' : '10,000'}</dd></div>
            <div><dt>Couple {isBust ? 'portrait bust' : 'miniature'}<small>Two people, one personal piece</small></dt><dd>Rs. {isBust ? '3,500' : '20,000'}</dd></div>
          </dl>
          <p className="gl-modal-note">Hand-painted · Custom digital sculpting<br/>Prices may vary for custom sizes.</p>
          <a className="gl-modal-contact" href={ask(selected.title.toLowerCase())} target="_blank" rel="noreferrer">Let’s create yours <span aria-hidden="true">↗</span></a>
          <a className="gl-modal-packages" href="/packages">View all packages →</a>
        </div>
      </div>}
    </dialog>
    <WivorkFooter theme="dark"/>
  </>;
}
