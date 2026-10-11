import { useEffect, useState } from 'react';
import LandingSections from './LandingSections';
import WivorkHeader from './WivorkHeader';
import '../styles/home-dark.css';
import { useLenis } from '../lib/useLenis';
import { products, workCollections } from '../data/products';

const collections = [...products, ...workCollections];
const contact = 'https://wa.me/94722227440';
const SLIDE_MS = 5500;
function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dir === 'prev' ? { transform: 'scaleX(-1)' } : undefined}><path d="m2 2 8 8-8 8"/></svg>;
}
export default function App() {
  useLenis();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  // Advance on a timer; manual changes restart it, and it rests while hovered or focused.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setSelected((value) => (value + 1) % collections.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [selected, paused]);
  return <div className="wivork-page">
    <WivorkHeader light/>
    <main>
      <section className="wk-hero" aria-labelledby="hero-title">
        <div className="wk-eyebrow"><img className="wk-spark" src="/wivork/symbol.png" alt="" width="27" height="12" /> Small figures. Big feelings.</div>
        <h1 id="hero-title">Your moments.<br/><span>Made real.</span></h1>
        <p className="wk-description">The people you love. The memories you keep.<br/>Turn them into beautifully crafted, hand-painted 3D miniatures.</p>
        <a className="wk-primary" href={contact} target="_blank" rel="noreferrer">Create your miniature <span>↗</span></a>
        <div className="wk-collection" id="collection">
          
          <div className="wk-gallery" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
            <button className="wk-gallery-arrow wk-gallery-prev" onClick={() => setSelected((selected + collections.length - 1) % collections.length)} aria-label="Previous creation"><Chevron dir="prev"/></button>
            <div className="wk-photo wk-featured"><img className="wk-photo-bg" key={`bg${selected}`} src={collections[selected].image} alt="" aria-hidden="true"/><img key={selected} src={collections[selected].image} alt={collections[selected].alt}/><div className="wk-image-caption"><span className="wk-caption-label">{collections[selected].title}</span><p>{collections[selected].caption}</p></div><span className="wk-image-index">0{selected + 1} / 0{collections.length}</span></div>
            <button className="wk-gallery-arrow wk-gallery-next" onClick={() => setSelected((selected + 1) % collections.length)} aria-label="Next creation"><Chevron dir="next"/></button>
          </div>
          <div className="wk-gallery-footer"><p>Thoughtfully crafted. Personally yours.</p><div className="wk-tabs" aria-label="Choose a collection">{collections.map((item, index) => <button key={item.title} onClick={() => setSelected(index)} aria-label={item.label} aria-pressed={selected === index} className={selected === index ? 'active' : ''}/>)}</div><span>A CREATIVE STUDIO IN SRI LANKA ↗</span></div>
        </div>
      </section>
      <LandingSections />
    </main>

  </div>;
}
