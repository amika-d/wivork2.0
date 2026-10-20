import { useEffect, useRef, useState } from 'react';
import LandingSections from './LandingSections';
import WivorkHeader from './WivorkHeader';
import '../styles/home-dark.css';
import { useLenis } from '../lib/useLenis';
import { prefetchProcess } from '../lib/prefetchProcess';
import { creations } from '../data/products';
import { useSlideshow } from '../lib/useSlideshow';
import SlideArrow from './SlideArrow';
import CrossfadeImage from './CrossfadeImage';
import SlidePagination from './SlidePagination';
import FlexCarousel from './FlexCarousel';
import CreationModal, { type Creation } from './CreationModal';

const collections = creations;
const flexItems = creations.map(piece => ({ src: piece.image, alt: piece.alt, title: piece.name, subtitle: piece.kind }));
const photoAspect = 1672 / 941;

// Cards keep our 16:9 studio photos uncropped, so on narrow screens they shrink to fit 80% of the width.
// The lens grows with the card, so the bend only touches the neighbours and the centred piece stays flat.
function HeroCarousel({ onSelect }: { onSelect: (piece: Creation) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ cardHeight: .6, lensWidth: .74 });
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const width = element.clientWidth, height = element.clientHeight;
      const cardHeight = Math.min(.6, width * .8 / photoAspect / height);
      const cardWidth = cardHeight * height * photoAspect / width;
      const round = (value: number) => Math.round(value * 1000) / 1000;
      setSize({ cardHeight: round(cardHeight), lensWidth: round(Math.max(.74, cardWidth + .22)) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="wk-hero-stage" ref={stage} id="collection" aria-label="Our creations">
    <FlexCarousel items={flexItems} preset="liquid" intro="rise" cardHeight={size.cardHeight} lensWidth={size.lensWidth} gap={20} radius={16} bend={.18} reach={.42} dispersion={.3} squeeze={.12} captureWheel={false} focusOnClick={false} onSelect={(index: number) => onSelect(creations[index])} captions/>
  </div>;
}

// Browsers without WebGL2 keep the original crossfading slideshow.
function HeroSlideshow({ onSelect }: { onSelect: (piece: Creation) => void }) {
  const { selected, setSelected, paused, setPaused, reduced, playing, bindings } = useSlideshow(collections.map(item => item.image));
  return <div className="wk-collection" id="collection" {...bindings} role="region" aria-roledescription="carousel" aria-label="Our creations">
    <div className="wk-gallery">
      <SlideArrow direction="prev" onClick={() => setSelected((selected + collections.length - 1) % collections.length)} label="Previous creation"/>
      <div className="wk-photo wk-featured"><button className="wk-photo-open" type="button" onClick={() => onSelect(collections[selected])} aria-label={`See prices for ${collections[selected].name}`}/><CrossfadeImage src={collections[selected].image} alt={collections[selected].alt} priority={selected === 0}/><div className="wk-image-caption"><span className="wk-caption-label">{collections[selected].kind}</span><p>{collections[selected].name}</p></div><span className="wk-image-index">0{selected + 1} / 0{collections.length}</span></div>
      <SlideArrow direction="next" onClick={() => setSelected((selected + 1) % collections.length)} label="Next creation"/>
    </div>
    <div className="wk-gallery-footer"><p>Thoughtfully crafted. Personally yours.</p><SlidePagination labels={collections.map(item => item.name)} selected={selected} onSelect={setSelected} playing={playing}/>{!reduced && <button className="wk-slideshow-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play creations slideshow' : 'Pause creations slideshow'}>{paused ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 3 8 5-8 5Z"/></svg> : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>}</button>}<span>A CREATIVE STUDIO IN SRI LANKA ↗</span></div>
  </div>;
}

export default function App() {
  useLenis();
  useEffect(prefetchProcess, []);
  // Server render assumes WebGL2 so most visitors see no swap; the rest fall back once mounted.
  const [webgl, setWebgl] = useState(true);
  const [piece, setPiece] = useState<Creation | null>(null);
  useEffect(() => setWebgl(!!document.createElement('canvas').getContext('webgl2')), []);
  return <div className="wivork-page">
    <WivorkHeader/>
    <main>
      <section className="wk-hero" aria-labelledby="hero-title">
        <div className="wk-eyebrow"><img className="wk-spark" src="/wivork/symbol.png" alt="" width="27" height="12" /> Small figures. Big feelings.</div>
        <h1 id="hero-title">Your moments.<br/><span>Made real.</span></h1>
        <p className="wk-description">The people you love. The memories you keep.{' '}<br/>Turn them into beautifully crafted, hand-painted 3D miniatures.</p>
        <a className="wk-primary" href="/packages">Create your miniature <span>→</span></a>
        {webgl ? <HeroCarousel onSelect={setPiece}/> : <HeroSlideshow onSelect={setPiece}/>}
      </section>
      <LandingSections />
    </main>
    <CreationModal piece={piece} onClose={() => setPiece(null)}/>

  </div>;
}
