import { useRef, useState, type KeyboardEvent } from 'react';
import '../styles/packages.css';
import { groups } from '../data/packages';

const phone = '94722227440';
const order = (name: string, price: string) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hi wivork, I'd like to order the ${name} (${price}).`)}`;
const features = ['Custom digital sculpting', 'Resin printed and hand-painted', 'Unlimited sculpting revisions'];

export { groups };

export default function PricingSection({ tab: controlledTab, onTabChange }: { tab?: number; onTabChange?: (tab: number) => void }) {
  const [localTab, setLocalTab] = useState(0);
  const tab = controlledTab ?? localTab;
  const setTab = onTabChange ?? setLocalTab;
  const group = groups[tab];
  const tabsRef = useRef<HTMLDivElement>(null);

  // One tab stop for the whole tablist; arrow keys, Home and End move between the sizes and select them.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = groups.length - 1;
    const next = { ArrowRight: tab + 1, ArrowDown: tab + 1, ArrowLeft: tab - 1, ArrowUp: tab - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const index = (next + groups.length) % groups.length;
    setTab(index);
    (tabsRef.current?.children[index] as HTMLElement | undefined)?.focus();
  };

  return <section className="pk-group" id="pricing" aria-labelledby="pricing-title">
    <div className="pk-group-head"><p className="pk-label">Choose your size</p><h2 id="pricing-title">{group.title}</h2></div>
    <div className="pk-tabs" role="tablist" aria-label="Package size" ref={tabsRef} onKeyDown={onKeyDown}>
      {groups.map((item, index) => <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-selected={tab === index} aria-controls="pk-panel" tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)}>{item.eyebrow}</button>)}
    </div>
    <div id="pk-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} key={group.id}>
      <div className="pk-cards" data-count={group.packages.length}>{group.packages.map((item, index) => <article className={`pk-card${index === 1 ? ' featured' : ''}`} key={item.name}>
        {/* Cut-out pieces stand on a quiet panel with a contact shadow, so the real paintwork reads as an object on a shelf. */}
        <figure className={`pk-stage pk-stage-${group.id}`} data-count={item.figures.length}>
          {item.figures.map((figure, figureIndex) => <img key={figure.src + figureIndex} src={figure.src} alt={figure.alt} loading="lazy" decoding="async"/>)}
          {item.pictured && <figcaption>{item.pictured}</figcaption>}
        </figure>
        <p className="pk-label">{index === 1 ? 'A moment together' : 'A little of you'}</p>
        <h3>{item.name}</h3>
        <p className="pk-card-text">{item.text}</p>
        <ul className="pk-features">{features.map(feature => <li key={feature}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg>{feature}</li>)}</ul>
        <div className="pk-card-foot">
          <div className="pk-price"><small>One-time · {item.size}</small><strong>{item.price}</strong></div>
          <a className="pk-order-button" href={order(item.name, item.price)} target="_blank" rel="noreferrer">Start your order <span aria-hidden="true">↗</span></a>
        </div>
      </article>)}</div>
      <p className="pk-note">* {group.note}</p>
    </div>
    <a className="pk-ghost-button pk-ask" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Not sure which one? Chat with us <span aria-hidden="true">↗</span></a>
  </section>;
}
