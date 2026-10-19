import '../styles/splash.css';

/** Full-screen splash shown from first paint until a page's media is ready, then faded away. */
export default function LoadingSplash({ loading, progress, message, onSkip }: { loading: boolean; progress: number; message: string; onSkip: () => void }) {
  return <div className={`wk-splash${loading ? '' : ' is-done'}`} role="status" aria-live="polite" aria-hidden={!loading}>
    <img src="/wivork/logo.png" alt="Wivork" width="154" height="18"/>
    <p>{message}</p>
    <div className="wk-splash-track" role="progressbar" aria-label="Loading" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ transform: `scaleX(${progress / 100})` }}/></div>
    <span>{progress}%</span>
    <button onClick={onSkip} tabIndex={loading ? 0 : -1}>Continue while loading →</button>
  </div>;
}
