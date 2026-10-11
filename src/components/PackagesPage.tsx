import { useState } from 'react';
import '../styles/packages.css';
import '../styles/home-dark.css';
import WivorkHeader from './WivorkHeader';
import WivorkFooter from './WivorkFooter';
import { useLenis } from '../lib/useLenis';

const phone = '94722227440';
const order = (name: string, price: string) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hi wivorK, I'd like to order the ${name} (${price}).`)}`;

const groups = [
  { id: 'signature', eyebrow: 'Signature miniatures', title: 'Full-figure, 18cm', note: 'Listed prices are for our standard 18cm height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Miniature', size: '18cm', price: 'Rs. 10,000', text: 'Includes 1 person digital sculpt, 3D printing & custom hand-painting.', featured: true },
    { name: 'Couple Miniature', size: '18cm', price: 'Rs. 20,000', text: 'Includes 2 person connected miniature, 3D printing & custom hand-painting.' },
  ] },
  { id: 'busts', eyebrow: 'Portrait busts', title: 'Compact, 5cm', note: 'Listed prices are for our standard 5cm bust height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Portrait Bust', size: '5cm', price: 'Rs. 1,800', text: 'Includes 1 person digital sculpt, 3D printing (5cm height) & custom hand-painting.' },
    { name: 'Couple Portrait Bust', size: '5cm', price: 'Rs. 3,500', text: 'Includes 2 person connected bust, 3D printing (5cm height) & custom hand-painting.' },
  ] },
];
const steps = [
  { title: 'Photo submission', image: '/process/reference-photos.webp', alt: 'A phone showing front and side reference photos', text: 'Send us clear, high-resolution reference photos. A direct frontal view of the face helps us capture authentic expressions and facial details.', highlight: 'Head facing straight forward, with both eyes, ears and sides of the face symmetrically aligned to the camera.', note: 'Having trouble with image quality, angles or choosing suitable photos? Reach out to our support team for guidance.' },
  { title: 'Digital 3D sculpting', image: '/process/digital-sculpting.webp', alt: 'A sculptor refining a 3D model on a pen display', text: 'Our digital artists meticulously sculpt a detailed 3D mesh representation of your photos, capturing signature features and structure.' },
  { title: 'Precision 3D printing', image: '/process/3d-printing.webp', alt: 'A 3D printer building a miniature', text: 'Using ultra-high precision 3D printing technology, the digital model is brought into physical form with remarkable depth and texture.' },
  { title: 'Artisanal hand-painting', image: '/process/hand-painting.webp', alt: 'An artist hand-painting a miniature', text: 'Each miniature is carefully hand-painted by artists to match natural skin tones, hair textures and clothing highlights for a premium finish.' },
];
const terms = [
  ['Production lead time', 'The fully completed miniature will be provided within 1 week from order confirmation.'],
  ['Reference photos', 'Clients must provide high-resolution, frontal view, well-lit reference photos. A natural, mutual expression is preferred for best results. If you have trouble with image quality, angles or selecting suitable photos, you can always reach out to our support team for guidance.'],
  ['Payment terms', 'A 50% non-refundable deposit is required to commence work. The remaining 50% is due prior to final shipping.'],
  ['Revisions', 'Unlimited revisions are provided during the digital sculpting and painting phase. Major structural changes after initial approval may incur additional fees.'],
];

function WhatsAppIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800 0-1.300.7-1.900.9-2.200.2-.3.5-.3.700-.3h.5c.2 0 .4 0 .6.500.2.600.8 2 .8 2.100.1.1.1.3 0 .5-.1.200-.2.300-.3.500l-.5.500c-.2.200-.3.300-.1.700.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.5.100.7-.1l.9-1.100c.2-.3.4-.2.700-.1l2 .9c.3.100.5.200.5.300.1.100.1.600-.1 1.200Z"/></svg>;
}

export default function PackagesPage() {
  useLenis();
  const [tab, setTab] = useState(0);
  const group = groups[tab];
  return <>
    <WivorkHeader current="packages"/>
    <main className="pk-page">
      <section className="pk-hero"><p>SIGNATURE MINIATURES</p><h1>Pricing<br/>packages.</h1><p>We turn the people you love into art you can keep, crafting highly accurate miniatures that combine precise hand-painting with modern 3D printing.</p></section>
      <section className="pk-group" id="pricing" aria-labelledby="pricing-title">
        <div className="pk-group-head"><span>Choose your size</span><h2 id="pricing-title">{group.title}</h2></div>
        <div className="pk-tabs" role="tablist" aria-label="Package size">{groups.map((item, index) => <button key={item.id} role="tab" id={`tab-${item.id}`} aria-selected={tab === index} aria-controls="pk-panel" onClick={() => setTab(index)}>{item.eyebrow}</button>)}</div>
        <div id="pk-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} key={group.id}>
          <div className="pk-cards">{group.packages.map((item) => <article className={`pk-card${item.featured ? ' featured' : ''}`} key={item.name}>
            <span className="pk-card-detail">{group.eyebrow} · {item.size}</span>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <div className="pk-card-foot">
              <div className="pk-price"><small>From · {item.size}</small><strong>{item.price}</strong></div>
              <a className="wk-primary pk-wa" href={order(item.name, item.price)} target="_blank" rel="noreferrer"><WhatsAppIcon/>Order on WhatsApp</a>
            </div>
          </article>)}</div>
          <p className="pk-note">* {group.note}</p>
        </div>
        <a className="pk-ask" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"><WhatsAppIcon/>Not sure which one? Chat with us</a>
      </section>
      <section className="pk-process" aria-labelledby="pk-process-title">
        <div className="pk-group-head"><span>Our process</span><h2 id="pk-process-title">From photo to keepsake</h2></div>
        {steps.map((step, index) => <article className={`pk-step${index % 2 ? ' flip' : ''}`} key={step.title}>
          <div className="pk-step-image"><img src={step.image} alt={step.alt} loading="lazy"/><span>{index + 1}</span></div>
          <div className="pk-step-copy"><h3>{step.title}</h3><p>{step.text}</p>{step.highlight && <p className="pk-highlight">{step.highlight}</p>}{step.note && <p className="pk-small">{step.note}</p>}</div>
        </article>)}
      </section>
      <section className="pk-terms" aria-labelledby="pk-terms-title">
        <h2 id="pk-terms-title">Terms &amp; conditions</h2>
        <dl>{terms.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
      </section>
      <section className="pk-order" aria-labelledby="pk-order-title">
        <p>READY TO ORDER?</p>
        <h2 id="pk-order-title">Let’s make yours.</h2>
        <a className="wk-primary pk-wa pk-order-cta" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"><WhatsAppIcon/>Connect on WhatsApp</a>
        <div className="pk-order-meta"><a href="tel:+94722227440">0722 227 440</a><a href="mailto:wivork@gmail.com">wivork@gmail.com</a><span>Colombo, Sri Lanka</span></div>
      </section>
    </main>
    <WivorkFooter theme="dark" backHref="#top" backLabel="Back to top ↑"/>
  </>;
}
