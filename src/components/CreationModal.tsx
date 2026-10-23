import { useEffect, useRef } from 'react';
import '../styles/creation-modal.css';
import type { creations } from '../data/products';
import { groups } from '../data/packages';

export type Creation = (typeof creations)[number];

const contact = 'https://wa.me/94722227440';
const ask = (piece: string) => `${contact}?text=${encodeURIComponent(`Hi wivork, I’d love a piece like “${piece}” in your gallery.`)}`;

// Prices for one piece, opened from the home hero or the gallery.
export default function CreationModal({ piece, onClose }: { piece: Creation | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!piece || !dialog.current) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [piece]);
  const isBust = piece?.bust;
  return <dialog ref={dialog} className="gl-modal" aria-labelledby="gl-modal-title" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {piece && <div className="gl-modal-content" data-lenis-prevent>
      <button className="gl-modal-close" type="button" aria-label="Close pricing" onClick={onClose} autoFocus>×</button>
      <div className="gl-modal-photo"><img src={piece.image} alt={piece.alt} width="1672" height="941"/></div>
      <div className="gl-modal-copy">
        <span className="gl-modal-eyebrow">{piece.name} · {piece.kind}</span>
        <h2 id="gl-modal-title">A little of your world.</h2>
        <p>{piece.description} We’ll create yours from your own photographs.</p>
        <dl className="gl-modal-prices">
          <div><dt>Single {isBust ? 'portrait bust' : 'miniature'}<small>{isBust ? '5cm · Upper-body portrait' : '18cm · Full-length figure'}</small></dt><dd>{groups[isBust ? 1 : 0].packages[0].price}</dd></div>
          <div><dt>Couple {isBust ? 'portrait bust' : 'miniature'}<small>Two people, one personal piece</small></dt><dd>{groups[isBust ? 1 : 0].packages[1].price}</dd></div>
        </dl>
        <p className="gl-modal-note">Hand-painted · Custom digital sculpting<br/>Prices may vary for custom sizes.</p>
        <a className="gl-modal-contact" href={ask(piece.name)} target="_blank" rel="noreferrer">Let’s create yours <span aria-hidden="true">↗</span></a>
        <a className="gl-modal-packages" href="/packages">View all packages →</a>
      </div>
    </div>}
  </dialog>;
}
