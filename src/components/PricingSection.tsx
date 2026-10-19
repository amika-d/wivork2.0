import { useState } from 'react';
import '../styles/packages.css';

const phone = '94722227440';
const order = (name: string, price: string) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hi wivork, I'd like to order the ${name} (${price}).`)}`;

export const groups = [
  { id: 'signature', eyebrow: 'Signature miniatures', title: 'Full-figure, 18cm', note: 'Listed prices are for our standard 18cm height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Miniature', size: '18cm', price: 'Rs. 10,000', text: 'A full-length portrait of one person, made from your photos.', featured: true },
    { name: 'Couple Miniature', size: '18cm', price: 'Rs. 20,000', text: 'Two full-length portraits, connected in one personal piece.' },
  ] },
  { id: 'busts', eyebrow: 'Portrait busts', title: 'Compact, 5cm', note: 'Listed prices are for our standard 5cm bust height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Portrait Bust', size: '5cm', price: 'Rs. 1,800', text: 'An upper-body portrait of one person, made from your photos.' },
    { name: 'Couple Portrait Bust', size: '5cm', price: 'Rs. 3,500', text: 'Two upper-body portraits, together on a shared display base.' },
  ] },
];

export default function PricingSection({ tab: controlledTab, onTabChange, embedded = false }: { tab?: number; onTabChange?: (tab: number) => void; embedded?: boolean }) {
  const [localTab, setLocalTab] = useState(0);
  const tab = controlledTab ?? localTab;
  const setTab = onTabChange ?? setLocalTab;
  const group = groups[tab];
  return <section className={`pk-group${embedded ? ' home-pricing' : ''}`} id="pricing" aria-labelledby="pricing-title">
        <div className="pk-group-head"><span>Choose your size</span><h2 id="pricing-title">{group.title}</h2></div>
        <div className="pk-tabs" role="tablist" aria-label="Package size">{groups.map((item, index) => <button key={item.id} role="tab" id={`tab-${item.id}`} aria-selected={tab === index} aria-controls="pk-panel" onClick={() => setTab(index)}>{item.eyebrow}</button>)}</div>
        <div id="pk-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} key={group.id}>
          <div className="pk-cards">{group.packages.map((item, index) => <article className={`pk-card${index === 1 ? ' featured' : ''}`} key={item.name}>
            <span className="pk-card-detail">{index === 1 ? 'A MOMENT TOGETHER' : 'A LITTLE OF YOU'}</span>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <ul className="pk-features">{['Custom digital sculpting', 'Resin printed and hand-painted', 'Unlimited sculpting revisions'].map(feature => <li key={feature}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg>{feature}</li>)}</ul>
            <div className="pk-card-foot">
              <div className="pk-price"><small>One-time · {item.size}</small><strong>{item.price}</strong></div>
              <a className="wk-primary pk-wa" href={order(item.name, item.price)} target="_blank" rel="noreferrer">Start your order <span aria-hidden="true">↗</span></a>
            </div>
          </article>)}</div>
          <p className="pk-note">* {group.note}</p>
        </div>
        <a className="pk-ask" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Not sure which one? Chat with us</a>
      </section>;
}
