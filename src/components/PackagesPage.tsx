import PricingSection from './PricingSection';
import { useState } from 'react';
import '../styles/packages.css';
import '../styles/home-dark.css';
import WivorkHeader from './WivorkHeader';
import WivorkFooter from './WivorkFooter';
import { useLenis } from '../lib/useLenis';

const phone = '94722227440';

const steps = [
  { title: 'Photo submission', image: '/process/reference-upload-woman-v3.webp', alt: 'A phone sending front and side reference photographs of a woman', text: 'Send clear, well-lit front and side photos. In the front view, keep your face straight towards the camera.', help: true },
  { title: 'Digital 3D sculpting', image: '/process/digital-sculpting-v2.webp', bustImage: '/process/bust-sculpting-v1.webp', bustAlt: 'An artist digitally sculpting an upper-body portrait bust', alt: 'An artist sculpting a portrait of a woman in a cream sari', text: 'We sculpt your likeness in 3D, refining facial features, hairstyle, and outfit.' },
  { title: 'Precision 3D printing', image: '/process/3d-printing-v2.webp', bustImage: '/process/bust-printing-v1.webp', bustAlt: 'A resin printer creating an upper-body portrait bust', alt: 'A resin printer creating a portrait miniature of a woman in a sari', text: 'Your digital sculpture is resin printed to capture the fine details.' },
  { title: 'Artisanal hand-painting', image: '/process/hand-painting-woman-v4.webp', bustImage: '/process/bust-painting-v1.webp', bustAlt: 'An artist hand-painting an upper-body portrait bust', alt: 'An artist hand-painting a portrait miniature of a woman in a cream sari', text: 'We paint each piece by hand, matching skin tones, hair, and clothing.' },
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
  return <>
    <WivorkHeader current="packages"/>
    <main className="pk-page">
      <section className="pk-hero" aria-labelledby="packages-title"><div><span className="pk-eyebrow">PERSONALLY YOURS</span><h1 id="packages-title">Personal pieces.<br/>Clear, simple pricing.</h1></div><div className="pk-hero-copy"><p>A little likeness, made just for you. Choose a full-length miniature or a portrait bust, for yourself or someone you love.</p><a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Find your perfect piece <span aria-hidden="true">↗</span></a></div></section>
      <PricingSection tab={tab} onTabChange={setTab}/>
      <section className="pk-process" aria-labelledby="pk-process-title">
        <div className="pk-group-head"><span>Our process</span><h2 id="pk-process-title">From photo to keepsake</h2></div>
        {steps.map((step, index) => <article className={`pk-step${index % 2 ? ' flip' : ''}`} key={step.title}>
          <div className="pk-step-image"><img src={tab === 1 && 'bustImage' in step ? step.bustImage : step.image} alt={tab === 1 && 'bustAlt' in step ? step.bustAlt : step.alt} width="1672" height="941" loading="lazy"/><span>{index + 1}</span></div>
          <div className="pk-step-copy"><h3>{step.title}</h3><p>{step.text}</p>{'help' in step && step.help && <a className="pk-step-help" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Help choosing photos ↗</a>}</div>
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
