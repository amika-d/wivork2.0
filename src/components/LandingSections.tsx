import { useEffect, useRef } from 'react';
import '../styles/landing-sections.css';
import WivorkFooter from './WivorkFooter';
import ProductShowcase from './ProductShowcase';
import SlideArrow from './SlideArrow';
import CrossfadeImage from './CrossfadeImage';
import SlidePagination from './SlidePagination';
import { useSlideshow } from '../lib/useSlideshow';

const contact = 'https://wa.me/94722227440';
const services = [
  { title: 'Send photos', description: 'Your reference, captured', image: '/process/reference-upload-woman-v3.webp', alt: 'A customer sending front and side reference photographs of a woman on a phone', detail: 'Send us clear, well-lit reference photos. Include front and side views so we can capture your likeness.', icon: 3 },
  { title: 'We sculpt', description: 'Your idea, digitally sculpted', image: '/process/digital-sculpting-v2.webp', alt: 'An artist sculpting a digital portrait miniature of a woman in a cream sari', detail: 'Our digital artists sculpt a detailed 3D model of you, capturing your signature features and structure.', icon: 0 },
  { title: 'We print', description: 'From digital to physical', image: '/process/3d-printing-v2.webp', alt: 'A resin printer creating an unpainted portrait miniature of a woman in a sari', detail: 'Ultra-high precision 3D printing brings the digital model into physical form with remarkable depth and texture.', icon: 1 },
  { title: 'We paint', description: 'Character in every brushstroke', image: '/process/hand-painting-woman-v4.webp', alt: 'An artist painting a portrait miniature of a woman in a cream sari', detail: 'Each miniature is carefully hand-painted to match natural skin tones, hair textures and clothing highlights.', icon: 2 },
];
function Icon({ type }: { type: number }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 0 ? <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9"/></> : type === 1 ? <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v5h8V3M8 16h8M8 12h8"/></> : type === 2 ? <><path d="m14 4 6 6M5 19l2-7L17 2l5 5-10 10-7 2Z"/></> : <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/></>}
  </svg>;
}
export default function LandingSections() {
  const { selected: active, setSelected: setActive, paused, setPaused, reduced, playing, bindings } = useSlideshow(services.length);
  const sectionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panels = sectionsRef.current?.querySelectorAll('.wk-product-panel');
    if (!panels) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const configure = () => {
      observer?.disconnect();
      panels.forEach(panel => panel.classList.remove('is-expanded'));
      if (motion.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('is-expanded', entry.isIntersecting));
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      panels.forEach(panel => observer?.observe(panel));
    };
    configure();
    motion.addEventListener('change', configure);
    return () => { observer?.disconnect(); motion.removeEventListener('change', configure); };
  }, []);
  return <div className="wk-sana-sections" ref={sectionsRef}>
    <ProductShowcase />


    <section className="wk-product-panel wk-making-panel" id="process" aria-labelledby="making-title">
      <div className="wk-panel-heading"><h2 id="making-title">How it’s made</h2><p>From your reference photos to a hand-painted miniature.<br/>A little care at every step.</p></div>
      <div className="wk-making-carousel" {...bindings} role="region" aria-roledescription="carousel" aria-label="How your miniature is made">
        <div className="wk-feature-row wk-service-selector" aria-label="Choose a making step">{services.map((service, index) => <button className={`wk-feature${active === index ? ' active' : ''}`} key={service.title} aria-pressed={active === index} aria-controls="making-image" onClick={() => setActive(index)}><Icon type={service.icon}/><span className="wk-feature-title">{service.title}</span><span className="wk-feature-description">{service.description}</span></button>)}</div>
        <div className="wk-making-visual" id="making-image">
          <CrossfadeImage src={services[active].image} alt={services[active].alt}/>
          <SlideArrow direction="prev" onClick={() => setActive((active + services.length - 1) % services.length)} label="Previous making step"/>
          <SlideArrow direction="next" onClick={() => setActive((active + 1) % services.length)} label="Next making step"/>
          <span className="wk-image-index">0{active + 1} / 04</span>
        </div>
        <div className="wk-making-toolbar"><SlidePagination labels={services.map(item => item.title)} selected={active} onSelect={setActive} playing={playing}/>{!reduced && <button className="wk-slideshow-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play making slideshow' : 'Pause making slideshow'}>{paused ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 3 8 5-8 5Z"/></svg> : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>}</button>}</div>
        <div className="wk-making-details">
          <div className="wk-making-description" aria-live={paused || reduced ? 'polite' : 'off'} aria-atomic="true"><span className="wk-step-count">STEP 0{active + 1} OF 04</span><h3>{services[active].title}</h3><p>{services[active].detail}</p></div>
          <div className="wk-making-actions"><a className="wk-primary" href={`${contact}?text=${encodeURIComponent('Hi wivorK, I’d like to send reference photos for a custom miniature.')}`} target="_blank" rel="noreferrer">Send your photos ↗</a><a className="wk-secondary" href="/process">See the full process →</a></div>
        </div>
      </div>
    </section>

    <section className="wk-contact-banner" id="contact" aria-labelledby="contact-title"><img src="/wivork/products/black-outfit-cutout.webp" alt="A wivorK hand-painted miniature in a black outfit with a tan backpack on a textured base" loading="lazy"/><div className="wk-contact-copy"><span className="wk-banner-tag">Made for you</span><h2 id="contact-title">Your imagination.<br/><span>Made real.</span></h2><p>Start with a photo. We’ll help with the rest.</p><a className="wk-primary" href={contact} target="_blank" rel="noreferrer">Let’s create on WhatsApp ↗</a></div></section>
    <WivorkFooter backHref="#hero-title"/>
  </div>;
}
