// Archived from PackagesPage; render inside .pk-page with packages.css to restore.
const phone = '94722227440';

const steps = [
  { title: 'Photo submission', image: '/process/reference-upload-woman-v3.webp', alt: 'A phone sending front and side reference photographs of a woman', text: 'Send clear, well-lit front and side photos. In the front view, keep your face straight towards the camera.', help: true },
  { title: 'Digital 3D sculpting', image: '/process/digital-sculpting-v2.webp', bustImage: '/process/bust-sculpting-v1.webp', bustAlt: 'An artist digitally sculpting an upper-body portrait bust', alt: 'An artist sculpting a portrait of a woman in a cream sari', text: 'We sculpt your likeness in 3D, refining facial features, hairstyle, and outfit.' },
  { title: 'Precision 3D printing', image: '/process/3d-printing-v2.webp', bustImage: '/process/bust-printing-v1.webp', bustAlt: 'A resin printer creating an upper-body portrait bust', alt: 'A resin printer creating a portrait miniature of a woman in a sari', text: 'Your digital sculpture is resin printed to capture the fine details.' },
  { title: 'Artisanal hand-painting', image: '/process/hand-painting-woman-v4.webp', bustImage: '/process/bust-painting-v1.webp', bustAlt: 'An artist hand-painting an upper-body portrait bust', alt: 'An artist hand-painting a portrait miniature of a woman in a cream sari', text: 'We paint each piece by hand, matching skin tones, hair, and clothing.' },
];

export default function PackagesProcessSection({ tab = 0 }: { tab?: number }) {
  return <section className="pk-process" aria-labelledby="pk-process-title">
        <div className="pk-group-head"><span>Our process</span><h2 id="pk-process-title">From photo to keepsake</h2></div>
        {steps.map((step, index) => <article className={`pk-step${index % 2 ? ' flip' : ''}`} key={step.title}>
          <div className="pk-step-image"><img src={tab === 1 && 'bustImage' in step ? step.bustImage : step.image} alt={tab === 1 && 'bustAlt' in step ? step.bustAlt : step.alt} width="1672" height="941" loading="lazy"/><span>{index + 1}</span></div>
          <div className="pk-step-copy"><h3>{step.title}</h3><p>{step.text}</p>{'help' in step && step.help && <a className="pk-step-help" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Help choosing photos ↗</a>}</div>
        </article>)}
      </section>;
}
