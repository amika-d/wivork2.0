import { useEffect, useRef, useState } from 'react';
import WivorkHeader from './WivorkHeader';
import WivorkFooter from './WivorkFooter';
import '../styles/home-light.css';
import { useLenis } from '../lib/useLenis';
import { prefetchProcess } from '../lib/prefetchProcess';
import { creations } from '../data/products';
import { faqs } from '../data/faqs';
import CreationModal, { type Creation } from './CreationModal';
import { groups } from '../data/packages';

const contact = 'https://wa.me/94722227440';
const say = (text: string) => `${contact}?text=${encodeURIComponent(text)}`;
const loveBirds = creations[0];
const sundayBest = creations[2];
const quietGrace = creations[3];

const steps = [
  { title: 'You send photos', text: 'Clear front and side views, sent on WhatsApp.', image: '/process/reference-upload-fictional-white-sari-v4.webp', alt: 'Illustrative example of sending front and side reference photos on a phone' },
  { title: 'We sculpt', text: 'A detailed 3D likeness, revised until it feels right.', image: '/process/digital-sculpting-white-sari-v5.webp', alt: 'Illustrative scene of a miniature being digitally sculpted' },
  { title: 'We 3D print', text: 'High-precision 3D printing brings the model into your hands.', image: '/process/3d-printing-white-sari-v3.webp', alt: 'Illustrative 3D printer scene with an unpainted miniature' },
  { title: 'We paint', text: 'Skin, hair and clothing, matched by hand.', image: '/process/hand-painting-white-sari-v5.webp', alt: 'Illustrative scene of an artist hand-painting a miniature' },
];

// Words brighten as the statement scrolls through the middle of the screen; reduced motion shows it whole.
function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = Array.from(element.querySelectorAll<HTMLSpanElement>('span'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight * .85 - box.top) / (box.height + window.innerHeight * .35), 0), 1);
      const lit = progress * words.length;
      words.forEach((word, index) => { word.style.opacity = String(.2 + .8 * Math.min(Math.max(lit - index, 0), 1)); });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <p ref={ref} className="hl-statement">{text.split(' ').map((word, index) => <span key={index}>{word} </span>)}</p>;
}

// A radio group with one tab stop; arrow keys move the choice, as the ARIA radio pattern expects.
function Segmented({ label, options, value, onChange }: { label: string; options: { name: string; detail?: string }[]; value: number; onChange: (index: number) => void }) {
  return <div className="hl-choice">
    <span className="hl-choice-label" id={`choice-${label}`}>{label}</span>
    <div className="hl-toggle" role="radiogroup" aria-labelledby={`choice-${label}`} onKeyDown={event => {
      const step = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = (value + step + options.length) % options.length;
      onChange(next);
      (event.currentTarget.children[next] as HTMLElement).focus();
    }}>{options.map((option, index) => <button key={option.name} type="button" role="radio" aria-checked={value === index} tabIndex={value === index ? 0 : -1} onClick={() => onChange(index)}>{option.name}{option.detail && <small>{option.detail}</small>}</button>)}</div>
  </div>;
}

// Every real option, in the order the card shows them while it plays on its own.
const showcase = groups.flatMap((group, size) => group.packages.map((_, people) => ({ size, people })));

// A small configurator: the chosen piece stands on the left and its real price updates on the right.
// Until someone makes a choice it steps through every option; the timer line's animation drives each step,
// so pausing (pointer over the card, card off screen) is just pausing that animation.
function PriceCard() {
  const [size, setSize] = useState(0);
  const [people, setPeople] = useState(0);
  const [auto, setAuto] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !card.current) return;
    setAuto(true);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .4 });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, []);
  const group = groups[size];
  // Signature miniatures come for one person only, so the people choice applies to busts alone.
  const item = group.packages[Math.min(people, group.packages.length - 1)];
  const choose = (apply: () => void) => { setAuto(false); apply(); };
  const advance = () => {
    const current = showcase.findIndex(option => option.size === size && option.people === Math.min(people, group.packages.length - 1));
    const next = showcase[(current + 1) % showcase.length];
    setSize(next.size);
    setPeople(next.people);
  };
  return <div className="hl-price-card" ref={card} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
    {/* Keyed by package, so each choice settles in with a short blur-in rather than a hard swap. */}
    <figure className={`hl-price-stage hl-price-stage-${group.id}`} key={item.name} data-count={item.figures.length}>
      {item.figures.map((figure, index) => <img key={figure.src + index} src={figure.src} alt={figure.alt} decoding="async"/>)}
      {item.pictured && <figcaption>{item.pictured}</figcaption>}
      {auto && <span className="hl-price-timer" aria-hidden="true" data-paused={hovered || !visible} onAnimationEnd={advance}/>}
    </figure>
    <div className="hl-price-body">
      <Segmented label="Size" options={groups.map(option => ({ name: option.eyebrow, detail: option.packages[0].size }))} value={size} onChange={index => choose(() => setSize(index))}/>
      {group.packages.length > 1
        ? <Segmented label="People" options={[{ name: 'One Person' }, { name: 'Two People' }]} value={people} onChange={index => choose(() => setPeople(index))}/>
        : <div className="hl-choice"><span className="hl-choice-label">People</span><p className="hl-choice-fixed">One Person</p></div>}
      {/* Quiet while it plays on its own, so screen readers only hear changes the visitor makes. */}
      <div className="hl-price-result" aria-live={auto ? 'off' : 'polite'} aria-atomic="true">
        <p className="hl-price-label">{item.name} · {item.size}</p>
        <p className="hl-price" key={item.price}>{item.price}</p>
      </div>
      <p className="hl-price-note">{item.text} Custom sizes are priced on request.</p>
      <a className="hl-dark-button" href={say(`Hi wivork, I'd like to order the ${item.name} (${item.price}).`)} target="_blank" rel="noreferrer">Order on WhatsApp <span className="wk-arrow" aria-hidden="true">↗</span></a>
    </div>
  </div>;
}

// The FAQ rows rise in once, the first time the band scrolls into view.
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    // Only hide what is still below the screen, so the content never depends on this script to appear.
    if (!element || element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('will-reveal');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add('is-revealed');
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function App() {
  useLenis();
  const faqRef = useRevealOnce<HTMLElement>();
  useEffect(prefetchProcess, []);
  const [piece, setPiece] = useState<Creation | null>(null);
  return <div className="hl-page">
    <WivorkHeader current="home"/>
    <main>
      <section className="hl-hero" aria-labelledby="hero-title">
        <p className="hl-label">Custom miniatures · Hand-painted in Sri Lanka</p>
        <h1 id="hero-title">The people you love,{' '}<br/>made small by hand.</h1>
        <p className="hl-lede">Send us a few photos. We sculpt the likeness, 3D print it and paint every detail, ready within a week.</p>
        <a className="hl-dark-button" href="/packages">Create your miniature <span aria-hidden="true">→</span></a>
        <figure className="hl-hero-frame">
          <img src="/home/v2/hero-couple-window.webp" alt="The Love Birds couple portrait bust, hand-painted, on a sunlit wooden table at home" width="1672" height="941" fetchPriority="high"/>
          <div className="hl-hero-stat"><strong>1 week</strong><span>From confirmed order<br/>to finished piece</span></div>
          <button type="button" className="hl-hero-piece" aria-haspopup="dialog" onClick={() => setPiece(loveBirds)}>
            <span>{loveBirds.name}</span>
            <small>{loveBirds.kind} · {groups[1].packages[1].size} · {groups[1].packages[1].price}</small>
            <em>See prices <span className="wk-arrow" aria-hidden="true">↗</span></em>
          </button>
        </figure>
      </section>

      <section className="hl-section" aria-labelledby="pieces-title">
        <h2 id="pieces-title" className="hl-visually-hidden">Choose your piece</h2>
        <ScrollWords text="Every piece starts with a few photos of someone you love, and ends as something you can hold."/>
        <div className="hl-bento">
          <a className="hl-card hl-card-photo" href="/packages">
            <img src="/home/v2/feature-red-sari-ledge.webp" alt="Priyanka’s full-length miniature standing on a sunny window ledge" width="1122" height="1402" loading="lazy"/>
            <p className="hl-tile-copy"><strong>Signature Miniature.</strong> A full-length likeness, {groups[0].packages[0].size} tall. Made for one person, <span className="hl-nowrap">{groups[0].packages[0].price}</span>.</p>
          </a>
          <a className="hl-card hl-card-dark" href="/packages">
            <p className="hl-tile-copy"><strong>Portrait Bust.</strong> An upper-body likeness on a small oval base, {groups[1].packages[0].size} tall. <span className="hl-nowrap">{groups[1].packages[0].price}</span>, or <span className="hl-nowrap">{groups[1].packages[1].price}</span> for a couple.</p>
            <img src={sundayBest.image} alt={sundayBest.alt} width="1672" height="941" loading="lazy"/>
          </a>
          <div className="hl-card hl-card-plain">
            <p className="hl-tile-copy"><strong>Every piece, made the same careful way.</strong> Sculpted digitally from your photos, 3D printed and painted by hand, with unlimited revisions while we sculpt and paint.</p>
            <a href="/gallery">See all our creations <span className="wk-arrow" aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="hl-section" aria-labelledby="steps-title">
        <div className="hl-section-head"><h2 id="steps-title">From your photos to a piece you can hold.</h2><a className="hl-ghost-button" href="/process">How it’s made <span aria-hidden="true">→</span></a></div>
        <ol className="hl-steps">{steps.map((step, index) => <li key={step.title}>
          <img src={step.image} alt={step.alt} width="1672" height="941" loading="lazy"/>
          <span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p>
        </li>)}</ol>
      </section>

      <section className="hl-section hl-pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="hl-pricing-copy">
          <h2 id="pricing-title">One clear price.<br/>Nothing hidden.</h2>
          <p>Pick a size and how many people. A 50% non-refundable deposit starts the work; the rest is due before we ship.</p>
          <a className="hl-ghost-button" href="/packages">All packages and terms <span aria-hidden="true">→</span></a>
        </div>
        <PriceCard/>
      </section>

      <section className="hl-faq" id="faq" aria-labelledby="faq-title" ref={faqRef}>
        <div className="hl-faq-head"><h2 id="faq-title">Questions, answered.</h2><p>What people ask before they order. Anything else, ask us on WhatsApp.</p></div>
        <div className="hl-faq-list">{faqs.map((faq, index) => <details key={faq.question} name="faq" open={index === 0}>
          <summary>{faq.question}<span aria-hidden="true"/></summary>
          <p>{faq.answer}</p>
        </details>)}</div>
      </section>

      <section className="hl-feature" aria-labelledby="feature-title">
        <div>
          <h2 id="feature-title">{quietGrace.name}</h2>
          <p>{quietGrace.description} Shown here with Thihara, who it was made for.</p>
          <button type="button" aria-haspopup="dialog" onClick={() => setPiece(quietGrace)}>See prices <span className="wk-arrow" aria-hidden="true">↗</span></button>
        </div>
        <img src="/home/v2/thihara-with-quiet-grace-open.webp" alt="Thihara smiling and holding her miniature, a white-sari figure in a clear display case" width="768" height="900" loading="lazy"/>
      </section>

      <section className="hl-cta" aria-labelledby="cta-title">
        <h2 id="cta-title">Start with a photo.</h2>
        <p>Message us on WhatsApp. We’ll help you choose the right photos, size and piece.</p>
        <a className="hl-dark-button" href={say('Hi wivork, I’d like to create a custom miniature.')} target="_blank" rel="noreferrer">Talk to us on WhatsApp <span className="wk-arrow" aria-hidden="true">↗</span></a>
      </section>
    </main>
    <WivorkFooter theme="dark" backHref="#hero-title"/>
    <CreationModal piece={piece} onClose={() => setPiece(null)}/>
  </div>;
}
