import { useEffect, useRef, useState } from 'react';
import '../styles/landing-sections.css';
import WivorkFooter from './WivorkFooter';
import ProductShowcase from './ProductShowcase';

const contact = 'https://wa.me/94722227440';
const services = [
  { title: 'Photos', description: 'Your reference, captured', image: '/process/reference-photos.webp', alt: 'A phone showing front and side reference photos of a person', detail: 'Send us clear, well-lit reference photos. A direct frontal view of the face helps us capture authentic expressions.', icon: 3 },
  { title: 'Model', description: 'Your idea, digitally sculpted', image: '/process/digital-sculpting.webp', alt: 'A sculptor refining a digital 3D model on a pen display', detail: 'Our digital artists sculpt a detailed 3D model of you, capturing your signature features and structure.', icon: 0 },
  { title: 'Print', description: 'From digital to physical', image: '/process/3d-printing.webp', alt: 'A 3D printer building a miniature figure', detail: 'Ultra-high precision 3D printing brings the digital model into physical form with remarkable depth and texture.', icon: 1 },
  { title: 'Paint', description: 'Character in every brushstroke', image: '/process/hand-painting.webp', alt: 'An artist hand-painting a miniature figure in a white saree', detail: 'Each miniature is carefully hand-painted to match natural skin tones, hair textures and clothing highlights.', icon: 2 },
];
function Icon({ type }: { type: number }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 0 ? <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9"/></> : type === 1 ? <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v5h8V3M8 16h8M8 12h8"/></> : type === 2 ? <><path d="m14 4 6 6M5 19l2-7L17 2l5 5-10 10-7 2Z"/></> : <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/></>}
  </svg>;
}
export default function LandingSections() {
  const [active, setActive] = useState(0);
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
    return () => {
      observer?.disconnect();
      motion.removeEventListener('change', configure);
    };
  }, []);
  return <div className="wk-sana-sections" ref={sectionsRef}>
    <ProductShowcase />


    <section className="wk-product-panel wk-making-panel" id="process" aria-labelledby="making-title"><div className="wk-panel-heading"><h2 id="making-title">The art of making</h2><p>From the first digital sketch to the final brushstroke.<br/>Everything your idea needs to become real.</p><a className="wk-primary" href={contact} target="_blank" rel="noreferrer">Explore your idea ↗</a></div>
      <div className="wk-feature-row wk-service-selector" aria-label="Explore our services">{services.map((service, index) => <button className={`wk-feature${active === index ? ' active' : ''}`} key={service.title} aria-pressed={active === index} aria-controls="making-image" onClick={() => setActive(index)}><Icon type={service.icon}/><h3>{service.title}</h3><p>{service.description}</p></button>)}</div>
      <div className="wk-making-visual" id="making-image"><img key={active} src={services[active].image} alt={services[active].alt} loading="lazy"/><p aria-live="polite">{services[active].detail}</p></div>
    </section>

    <section className="wk-contact-banner" id="contact" aria-labelledby="contact-title"><img src="/wivork/products/signature-cutout.webp" alt="A wivorK hand-painted miniature in a red sari with a gold handbag" loading="lazy"/><div className="wk-contact-copy"><span className="wk-banner-tag">Made for you</span><h2 id="contact-title">Your imagination.<br/><span>Made real.</span></h2><p>Start with a photo. We’ll help with the rest.</p><a className="wk-primary" href={contact} target="_blank" rel="noreferrer">Let’s create on WhatsApp ↗</a></div></section>
    <WivorkFooter backHref="#hero-title"/>
  </div>;
}
