import { useEffect, useState } from 'react';
import '../styles/splash.css';

/** Full-screen splash shown from first paint until a page's media is ready, then lifted away. */
export default function LoadingSplash({ loading, progress, message, onSkip, tone = 'dark' }: { loading: boolean; progress: number; message: string; onSkip: () => void; tone?: 'dark' | 'light' }) {
  // Offer the skip link only once the wait becomes noticeable.
  const [offerSkip, setOfferSkip] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOfferSkip(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  const value = Math.round(Math.min(100, Math.max(0, progress)));
  return <div className={`wk-splash${tone === 'light' ? ' is-light' : ''}${loading ? '' : ' is-done'}`} role="status" aria-live="polite" aria-hidden={loading ? undefined : true}>
    <div className="wk-splash-inner">
      <img className="wk-splash-mark" src="/wivork/symbol.png" alt="" width="546" height="238"/>
      <p>{message}</p>
      <div className="wk-splash-track" role="progressbar" aria-label="Loading" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ transform: `scaleX(${value / 100})` }}/></div>
      <button type="button" className={offerSkip ? 'is-offered' : undefined} onClick={onSkip} tabIndex={loading && offerSkip ? 0 : -1}>Continue while loading →</button>
    </div>
  </div>;
}
