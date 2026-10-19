import { useEffect } from 'react';
import LandingSections from './LandingSections';
import WivorkHeader from './WivorkHeader';
import '../styles/home-dark.css';
import { useLenis } from '../lib/useLenis';
import { prefetchProcess } from '../lib/prefetchProcess';
import { products, workCollections } from '../data/products';
import { useSlideshow } from '../lib/useSlideshow';
import SlideArrow from './SlideArrow';
import CrossfadeImage from './CrossfadeImage';
import SlidePagination from './SlidePagination';

const collections = [...products, ...workCollections];
export default function App() {
  useLenis();
  useEffect(prefetchProcess, []);
  const { selected, setSelected, paused, setPaused, reduced, playing, bindings } = useSlideshow(collections.map(item => item.image));
  return <div className="wivork-page">
    <WivorkHeader light/>
    <main>
      <section className="wk-hero" aria-labelledby="hero-title">
        <div className="wk-eyebrow"><img className="wk-spark" src="/wivork/symbol.png" alt="" width="27" height="12" /> Small figures. Big feelings.</div>
        <h1 id="hero-title">Your moments.<br/><span>Made real.</span></h1>
        <p className="wk-description">The people you love. The memories you keep.<br/>Turn them into beautifully crafted, hand-painted 3D miniatures.</p>
        <a className="wk-primary" href="/packages">Create your miniature <span>→</span></a>
        <div className="wk-collection" id="collection" {...bindings} role="region" aria-roledescription="carousel" aria-label="Our creations">
          
          <div className="wk-gallery">
            <SlideArrow direction="prev" onClick={() => setSelected((selected + collections.length - 1) % collections.length)} label="Previous creation"/>
            <div className="wk-photo wk-featured"><CrossfadeImage src={collections[selected].image} alt={collections[selected].alt} priority={selected === 0}/><div className="wk-image-caption"><span className="wk-caption-label">{collections[selected].title}</span><p>{collections[selected].caption}</p></div><span className="wk-image-index">0{selected + 1} / 0{collections.length}</span></div>
            <SlideArrow direction="next" onClick={() => setSelected((selected + 1) % collections.length)} label="Next creation"/>
          </div>
          <div className="wk-gallery-footer"><p>Thoughtfully crafted. Personally yours.</p><SlidePagination labels={collections.map(item => item.label)} selected={selected} onSelect={setSelected} playing={playing}/>{!reduced && <button className="wk-slideshow-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play creations slideshow' : 'Pause creations slideshow'}>{paused ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 3 8 5-8 5Z"/></svg> : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>}</button>}<span>A CREATIVE STUDIO IN SRI LANKA ↗</span></div>
        </div>
      </section>
      <LandingSections />
    </main>

  </div>;
}
