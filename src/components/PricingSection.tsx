import { useState } from 'react';
import '../styles/packages.css';
import { groups } from '../data/packages';

const phone = '94722227440';
const order = (name: string, price: string) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hi wivork, I'd like to order the ${name} (${price}).`)}`;

export { groups };

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
