import '../styles/wivork-footer.css';

const contact = 'https://wa.me/94722227440';

export default function WivorkFooter({ theme = 'light', backHref = '#top', backLabel = 'Back to top ↑' }: { theme?: 'light' | 'dark'; backHref?: string; backLabel?: string }) {
  return <footer className="wf" data-theme={theme}>
    <div className="wf-main">
      <div className="wf-brand">
        <a className="wf-logo" href="/" aria-label="wivork home"><img src="/wivork/logo.png" alt="wivork" width="154" height="18" loading="lazy"/></a>
        <p>Your moments, sculpted, printed and painted by hand into miniatures you can keep.</p>
        <a className="wf-cta" href={contact} target="_blank" rel="noreferrer">Create your miniature ↗</a>
      </div>
      <nav aria-label="Explore"><h3>Explore</h3><a href="/#collection">Our creations</a><a href="/process">How it’s made</a><a href="/packages">Packages</a></nav>
      <nav aria-label="Contact"><h3>Contact</h3><a href={contact} target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="/">Back to home</a></nav>
    </div>
    <img className="wf-mark" src="/wivork/symbol.png" alt="" aria-hidden="true" loading="lazy"/>
    <div className="wf-bottom"><span>© {new Date().getFullYear()} wivork</span><span>A creative studio in Sri Lanka</span><a href={backHref}>{backLabel}</a></div>
  </footer>;
}
